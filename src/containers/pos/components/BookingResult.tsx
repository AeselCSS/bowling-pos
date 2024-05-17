import React, { Dispatch } from 'react';
import { IBowlingBooking, IAirHockeyBooking, IDinnerBooking } from '../../../types/booking';
import useBookings from '../../../hooks/useBookings';
import BookingLine from './BookingLine';
import BookingButtons from './BookingButtons';

interface BookingResultProps {
    bookings: ( IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[];
    setBookings: Dispatch<React.SetStateAction<( IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[]>>;
}

function BookingResult({bookings, setBookings}: BookingResultProps) {
    const {update} = useBookings();
    function onCancel(id: number, bookingType: string) {
        update(id, {status: 'CANCELLED'}, bookingType);
        setBookings((prev) => prev.map((booking) => booking.id === id ? {...booking, status: 'CANCELLED'} : booking));
    }

    return (
        <>
            {bookings.map((booking, index) => (
                <div key={index} className="flex flex-row border border-zinc-400 rounded-md min-w-96 w-2/6 bg-zinc-100 m-5">
                    <div className="flex flex-col w-3/5">
                        {
                            Object.entries(booking).map(([key, value]) => (
                                <BookingLine key={key} bookingLine={{[key]: value}}/>
                            ))
                        }
                    </div>
                    <BookingButtons booking={booking} onCancel={onCancel}/>
                </div>

            ))}
        </>
    )
}

export default BookingResult;