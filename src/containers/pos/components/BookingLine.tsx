import { translateBookingKey, translateBookingValue } from '../helpers/translateBooking';

function BookingLine({ bookingLine }: { bookingLine: { [key: string]: number | string } }) {
    const lineTitle = Object.keys(bookingLine)[0];
    const lineValue = Object.values(bookingLine)[0];

    if (lineTitle === 'start' || lineTitle === 'end') {
        const bookingValue = translateBookingValue(lineTitle, lineValue);
        if (typeof bookingValue === 'object' && bookingValue !== null && 'date' in bookingValue && 'time' in bookingValue) {
            const { date, time } = bookingValue;
            return (
                <>
                    {lineTitle === 'start' && (
                        <div className="flex mb-2">
                            <div className="flex bg-white border border-zinc-400 rounded-lg min-w-full p-2.5 m-1">
                                <div className="w-1/2 ">Date:</div>
                                <div className="w-1/2 text-left">{date}</div>
                            </div>
                        </div>
                    )}
                    <div className="flex mb-2">
                        <div className="flex bg-white border border-zinc-400 rounded-lg min-w-full p-2.5 m-1">
                            <div className="w-1/2 ">{translateBookingKey(lineTitle)}:</div>
                            <div className="w-1/2 text-left">{time}</div>
                        </div>
                    </div>
                </>
            );
        }
    }

    return (
        <div className="flex mb-2">
            <div className="flex bg-white border border-zinc-400 rounded-lg min-w-full p-2.5 m-1">
                <div className="w-1/2 ">{translateBookingKey(lineTitle)}:</div>
                <div className="w-1/2 text-left">{String(translateBookingValue(lineTitle, lineValue))}</div>
            </div>
        </div>
    );
}

export default BookingLine;