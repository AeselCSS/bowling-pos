import React, { useEffect, useRef, useState } from 'react';
import { IBowlingBooking, IAirHockeyBooking, IDinnerBooking } from '../../../types/booking';
import { IBasketProduct } from '../../../types/basketProduct';
import useBookings from '../../../hooks/useBookings';
import BookingLine from './BookingLine';
import BookingButtons from './BookingButtons';

interface BookingResultProps {
    bookings: (IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[];
    setBookings: React.Dispatch<React.SetStateAction<(IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[]>>;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    setBasket: React.Dispatch<React.SetStateAction<(IBasketProduct)[]>>;
}

type OriginalBooking = IBowlingBooking | IAirHockeyBooking | IDinnerBooking | undefined;
type EditedBooking = {
    [key: string]: any;
} & Partial<IBowlingBooking & IAirHockeyBooking & IDinnerBooking>;

function BookingResult({ bookings, setBookings, fetchNextPage, hasNextPage, isFetchingNextPage, setBasket }: BookingResultProps) {
    const { update, checkAvailability, getBookingPrice } = useBookings();
    const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
    const [editedBookings, setEditedBookings] = useState<{ [key: number]: EditedBooking }>({});
    const [availabilityStatus, setAvailabilityStatus] = useState<{ [key: number]: boolean | null }>({});

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    const onAddBookingToBasket = async (booking: IBowlingBooking | IAirHockeyBooking | IDinnerBooking) => {
        const bookingPrice = await getBookingPrice(booking);
        const basketProduct: IBasketProduct = {
            id: booking.id,
            name: booking.customerEmail,
            price: bookingPrice,
            quantity: 1,
            type: 'reservation',
        };

        setBasket(prevBasket => {
            if (prevBasket.find(product => product.id === basketProduct.id)) {
                return prevBasket;
            }
            return [...prevBasket, basketProduct];
        });
    };

    const onCancel = async (id: number, bookingType: string) => {
        await update(id, { status: 'CANCELLED' }, bookingType);
        setBookings(prev => prev.map(booking => booking && booking.id === id ? { ...booking, status: 'CANCELLED' } : booking));
    };

    const onEditToggle = (id: number) => {
        setEditMode(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const onAccept = async (id: number, bookingType: string) => {
        const originalBooking: OriginalBooking = bookings.find(booking => booking && booking.id === id);
        const editedBooking: EditedBooking = editedBookings[id];

        if (!originalBooking || !editedBooking) return;

        const [editedBookingDate, editedBookingStartTime] = editedBooking.start?.split('T') || [];
        const [originalBookingDate, originalBookingStartTime] = originalBooking.start.split('T');
        const [, editedBookingEndTime] = editedBooking.end?.split('T') || [];
        const [, originalBookingEndTime] = originalBooking.end.split('T');

        const changes = {
            date: editedBookingDate !== originalBookingDate,
            start: editedBookingStartTime !== originalBookingStartTime,
            end: editedBookingEndTime !== originalBookingEndTime,
        };

        if (!changes.date && !changes.start && !changes.end) {
            setEditMode(prev => ({ ...prev, [id]: false }));
            return;
        }

        if (changes.date) {
            if (!changes.start) editedBooking.start = `${editedBookingDate}T${originalBookingStartTime}`;
            if (!changes.end) editedBooking.end = `${editedBookingDate}T${originalBookingEndTime}`;
        }

        if (changes.start && !changes.date) editedBooking.end = `${originalBookingDate}T${originalBookingEndTime}`;
        if (changes.end && !changes.date) editedBooking.start = `${originalBookingDate}T${originalBookingStartTime}`;

        if (editedBooking.start && editedBooking.end) {
            const isAvailable = await checkAvailability(editedBooking.start, editedBooking.end, bookingType, editedBooking.numberOfGuests);
            if (!isAvailable) {
                console.error('No availability');
                return;
            } else {
                await update(id, editedBooking, bookingType);
                setBookings(prev => prev.map(booking => booking && booking.id === id ? { ...booking, ...editedBooking } : booking));
                setEditMode(prev => ({ ...prev, [id]: false }));
            }
        }
    };

    const handleFieldChange = (id: number, field: string, value: any, bookingType: string) => {
        setEditedBookings(prev => {
            const prevBooking = prev[id] || {};
            const newBooking = { ...prevBooking };

            if (field === 'startDate') {
                const existingStartTime = prevBooking.start ? prevBooking.start.split('T')[1] : (bookings.find(booking => booking && booking.id === id)?.start.split('T')[1] || '00:00:00');
                const existingEndTime = prevBooking.end ? prevBooking.end.split('T')[1] : (bookings.find(booking => booking && booking.id === id)?.end.split('T')[1] || '00:00:00');
                newBooking.start = `${value}T${existingStartTime}`;
                newBooking.end = `${value}T${existingEndTime}`;
            } else if (field === 'start') {
                const existingDate = prevBooking.start ? prevBooking.start.split('T')[0] : (bookings.find(booking => booking && booking.id === id)?.start.split('T')[0] || '1970-01-01');
                newBooking.start = `${existingDate}T${value}`;
            } else if (field === 'end') {
                const existingDate = prevBooking.end ? prevBooking.end.split('T')[0] : (bookings.find(booking => booking && booking.id === id)?.end.split('T')[0] || '1970-01-01');
                newBooking.end = `${existingDate}T${value}`;
            } else if (field === 'numberOfGuests') {
                newBooking[field] = parseInt(value, 10);
            } else {
                newBooking[field] = value;
            }

            if (newBooking.start && newBooking.end) {
                if (bookingType === 'dinner' && newBooking.numberOfGuests === undefined) {
                    const originalBooking: OriginalBooking = bookings.find(booking => booking && booking.id === id);
                    if (originalBooking && 'numberOfGuests' in originalBooking) {
                        newBooking.numberOfGuests = (originalBooking as IDinnerBooking).numberOfGuests;
                    }
                }

                checkAvailability(newBooking.start, newBooking.end, bookingType, newBooking.numberOfGuests).then(isAvailable => {
                    setAvailabilityStatus(prevStatus => ({
                        ...prevStatus,
                        [id]: isAvailable,
                    }));
                });
            }

            return {
                ...prev,
                [id]: newBooking,
            };
        });
    };

    return (
        <>
            {bookings.map((booking, index) => {
                const isEditing = editMode[booking.id] || false;
                const bookingType = booking.hasOwnProperty('laneId') ? 'bowling' : booking.hasOwnProperty('tableId') ? 'airhockey' : 'dinner';
                return (
                    <div key={index}
                         className={`flex flex-row border border-zinc-400 rounded-md min-w-96 w-full bg-zinc-100 my-5 ${isEditing ? 'animate-flip' : ''}`}>
                        <div className="flex flex-col w-3/5">
                            {Object.entries(booking).map(([key, value]) => (
                                <BookingLine
                                    key={key}
                                    bookingLine={{ [key]: value }}
                                    editable={isEditing && ['customerEmail', 'start', 'end', 'status', 'childFriendly'].includes(key)}
                                    onFieldChange={(field, newValue) => handleFieldChange(booking.id, field, newValue, bookingType)}
                                    availability={availabilityStatus[booking.id] || null}
                                />
                            ))}
                        </div>
                        <BookingButtons
                            booking={booking}
                            onCancel={onCancel}
                            onEditToggle={onEditToggle}
                            onAccept={onAccept}
                            isEditing={isEditing}
                            onAddBookingToBasket={onAddBookingToBasket}
                        />
                    </div>
                );
            })}
            <div ref={loadMoreRef} style={{ height: '20px' }} />
        </>
    );
}

export default BookingResult;
