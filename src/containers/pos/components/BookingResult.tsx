import type { IBowlingBooking, IAirHockeyBooking, IDinnerBooking } from '../../../types/booking';
import translateBookingKey from '../helpers/translateBookingKey';

function BookingLine({bookingLine}: {bookingLine: { [key: string]: number | string }}) {
    return (
        <div className="flex mb-2">
            <div className="flex bg-white border border-zinc-400 rounded-lg w-3/5 p-2.5 m-2.5">
                <div className="w-1/2 pr-2">{translateBookingKey(Object.keys(bookingLine)[0])}:</div>
                <div className="w-1/2 pl-2 text-left">{Object.values(bookingLine)[0]}</div>
            </div>
        </div>
    )
}

function BookingResult({bookings}: {bookings: ( IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[]}) {
    return (
    <>
        {bookings.map((booking, index) => (
            <div key={index}  className="flex flex-col border border-zinc-400 rounded-md min-w-96 w-2/6 bg-zinc-100 m-5">
                {
                    Object.entries(booking).map(([key, value]) => (
                        <BookingLine key={key} bookingLine={{[key]: value}}/>
                    ))
                }
            </div>
        ))}
    </>
    )
}

export default BookingResult;