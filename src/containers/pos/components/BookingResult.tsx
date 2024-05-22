import React, {useEffect, useRef, useState} from 'react';
import {IBowlingBooking, IAirHockeyBooking, IDinnerBooking} from '../../../types/booking';
import useBookings from '../../../hooks/useBookings';
import BookingLine from './BookingLine';
import BookingButtons from './BookingButtons';

interface BookingResultProps {
    bookings: (IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[];
    setBookings: React.Dispatch<React.SetStateAction<(IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[]>>;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
}

type OriginalBooking = IBowlingBooking | IAirHockeyBooking | IDinnerBooking | undefined;
type EditedBooking = {
    [key: string]: any;
} & Partial<IBowlingBooking & IAirHockeyBooking & IDinnerBooking>;

function BookingResult({bookings, setBookings, fetchNextPage, hasNextPage, isFetchingNextPage}: BookingResultProps) {
    const {update, checkAvailability} = useBookings();
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

    function onCancel(id: number, bookingType: string) {
        update(id, {status: 'CANCELLED'}, bookingType);
        setBookings((prev) => prev.map((booking) => booking && booking.id === id ? {
            ...booking,
            status: 'CANCELLED'
        } : booking));
    }

    function onEditToggle(id: number) {
        setEditMode((prev) => ({...prev, [id]: !prev[id]}));
    }

    function onAccept(id: number, bookingType: string) {
        const originalBooking: OriginalBooking = bookings.find((booking) => booking && booking.id === id);
        const editedBooking: EditedBooking = editedBookings[id];

        if (!originalBooking || !editedBooking) return;

        const [editedBookingDate, editedBookingStartTime] = editedBooking.start?.split('T') || [];
        const [originalBookingDate, originalBookingStartTime] = originalBooking.start.split('T');
        const [_, editedBookingEndTime] = editedBooking.end?.split('T') || [];
        const [__, originalBookingEndTime] = originalBooking.end.split('T');

        const changes = {
            date: editedBookingDate !== originalBookingDate,
            start: editedBookingStartTime !== originalBookingStartTime,
            end: editedBookingEndTime !== originalBookingEndTime,
        };

        // If no changes
        if (!changes.date && !changes.start && !changes.end) {
            console.log('No changes');
            setEditMode((prev) => ({...prev, [id]: false}));
            return;
        }

        // Adjust the start and end times if only one part has changed
        if (changes.date) {
            if (!changes.start) editedBooking.start = `${editedBookingDate}T${originalBookingStartTime}`;
            if (!changes.end) editedBooking.end = `${editedBookingDate}T${originalBookingEndTime}`;
        }

        if (changes.start && !changes.date) editedBooking.end = `${originalBookingDate}T${originalBookingEndTime}`;
        if (changes.end && !changes.date) editedBooking.start = `${originalBookingDate}T${originalBookingStartTime}`;

        // Ensure the changes are applied before checking availability
        if (editedBooking.start && editedBooking.end) {
            checkAvailability(editedBooking.start, editedBooking.end, bookingType, editedBooking.numberOfGuests).then((isAvailable) => {
                if (!isAvailable) {
                    console.error('No availability');
                    return;
                } else {
                    console.log('Available');
                    update(id, editedBooking, bookingType);
                    setBookings((prev) => prev.map((booking) => booking && booking.id === id ? {...booking, ...editedBooking} : booking));
                    setEditMode((prev) => ({...prev, [id]: false}));
                }
            });
        }
    }

    function handleFieldChange(id: number, field: string, value: any, bookingType: string) {
        setEditedBookings((prev) => {
            const prevBooking = prev[id] || {};
            const newBooking = {...prevBooking};

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
                    const originalBooking: OriginalBooking = bookings.find((booking) => booking && booking.id === id);
                    if (originalBooking && 'numberOfGuests' in originalBooking) {
                        newBooking.numberOfGuests = (originalBooking as IDinnerBooking).numberOfGuests;
                    }
                }

                checkAvailability(newBooking.start, newBooking.end, bookingType, newBooking.numberOfGuests).then((isAvailable) => {
                    setAvailabilityStatus((prevStatus) => ({
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
    }

    return (
        <>
            {bookings.map((booking, index) => {
                    if (!booking) return null;  // Skip undefined bookings
                    const isEditing = editMode[booking.id] || false;
                    const bookingType = booking.hasOwnProperty('laneId') ? 'bowling' : booking.hasOwnProperty('tableId') ? 'airHockey' : 'dinner';
                    return (
                        <div key={index}
                             className={`flex flex-row border border-zinc-400 rounded-md min-w-96 w-2/6 bg-zinc-100 m-5 ${isEditing ? 'animate-flip' : ''}`}>
                            <div className="flex flex-col w-3/5">
                                {
                                    Object.entries(booking).map(([key, value]) => (
                                        <BookingLine
                                            key={key}
                                            bookingLine={{[key]: value}}
                                            editable={isEditing && ['customerEmail', 'date', 'start', 'end', 'status', 'childFriendly'].includes(key)}
                                            onFieldChange={(field, newValue) => handleFieldChange(booking.id, field, newValue, bookingType)}
                                            availability={availabilityStatus[booking.id] || null}
                                        />
                                    ))
                                }
                            </div>
                            <BookingButtons
                                booking={booking}
                                onCancel={onCancel}
                                onEditToggle={onEditToggle}
                                onAccept={onAccept}
                                isEditing={isEditing}
                            />
                        </div>
                    );
                }
            )}
            <div ref={loadMoreRef} style={{height: '20px'}}/>
        </>
    );
}

export default BookingResult;
