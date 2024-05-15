import type { IBowlingBooking, IAirHockeyBooking, IDinnerBooking } from '../../../types/booking';
import translateBookingKey from '../helpers/translateBookingKey';

function BookingButtons() {
    return (
        <div className="flex flex-col justify-end w-2/5 pl-5 items-end">
            <input type="button" value="Cancel" className='bg-red-500 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3.5 mr-6 rounded-md hover:bg-zinc-50 w-2/5 '/>
        </div>
    )
}

function BookingLine({bookingLine}: {bookingLine: { [key: string]: number | string }}) {
    const lineTitle = Object.keys(bookingLine)[0];
    const lineValue = Object.values(bookingLine)[0];
    return (
        <div className="flex mb-2">
            <div className="flex bg-white border border-zinc-400 rounded-lg min-w-full p-2.5 m-2.5">
                <div className="w-1/2 ">{translateBookingKey(lineTitle)}:</div>
                <div className="w-1/2 text-left">{lineValue}</div>
            </div>
        </div>
    )
}

function BookingResult({bookings}: {bookings: ( IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[]}) {
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
            <BookingButtons/>
        </div>
            
        ))}
    </>
    )
}

export default BookingResult;