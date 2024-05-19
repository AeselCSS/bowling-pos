import { translateBookingKey, translateBookingValue } from '../helpers/translateBooking';

interface BookingLineProps {
    bookingLine: { [key: string]: number | string };
    editable: boolean;
    onFieldChange: (field: string, value: any) => void;
}

function BookingLine({ bookingLine, editable, onFieldChange }: BookingLineProps) {
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
                                <div className="w-1/3 ">Date:</div>
                                <div className="w-2/3 text-center">
                                    {editable ?
                                        <input
                                            type="date"
                                            defaultValue={date}
                                            className="form-input w-5/6 py-0 px-1"
                                            onChange={(e) => onFieldChange('startDate', e.target.value)}
                                        />
                                        :
                                        date}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex mb-2">
                        <div className="flex bg-white border border-zinc-400 rounded-lg min-w-full p-2.5 m-1">
                            <div className="w-1/3 ">{translateBookingKey(lineTitle)}:</div>
                            <div className="w-2/3 text-center">
                                {editable ?
                                    <input
                                        type="time"
                                        defaultValue={time}
                                        className="form-input w-5/6 py-0 px-1"
                                        onChange={(e) => onFieldChange(lineTitle, e.target.value)}
                                    />
                                    :
                                    time}
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }

    if (lineTitle === 'status' && editable) {
        return (
            <div className="flex mb-2">
                <div className="flex bg-white border border-zinc-400 rounded-lg min-w-full p-2.5 m-1">
                    <div className="w-1/3 ">{translateBookingKey(lineTitle)}:</div>
                    <div className="w-2/3 text-center">
                        <select defaultValue={String(translateBookingValue(lineTitle, lineValue))}
                                className="form-select w-5/6 py-0 px-1"
                                onChange={(e) => onFieldChange(lineTitle, e.target.value)}>
                            <option value="BOOKED">Booked</option>
                            <option value="PAID">Paid</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="NO_SHOW">No Show</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    if (lineTitle === 'childFriendly' && editable) {
        return (
            <div className="flex mb-2">
                <div className="flex bg-white border border-zinc-400 rounded-lg min-w-full p-2.5 m-1">
                    <div className="w-1/3 ">{translateBookingKey(lineTitle)}:</div>
                    <div className="w-2/3 text-center">
                        <select defaultValue={String(translateBookingValue(lineTitle, lineValue))}
                                className="form-select w-5/6 py-0 px-1"
                                onChange={(e) => onFieldChange(lineTitle, e.target.value)}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex mb-2">
            <div className="flex bg-white border border-zinc-400 rounded-lg min-w-full p-2.5 m-1">
                <div className="w-1/3 ">{translateBookingKey(lineTitle)}:</div>
                <div className="w-2/3 text-center">
                    {editable ?
                        <input
                            type={typeof lineValue === 'number' ? 'number' : 'text'}
                            defaultValue={String(translateBookingValue(lineTitle, lineValue))}
                            className="form-input w-5/6 py-0 px-1"
                            onChange={(e) => onFieldChange(lineTitle, e.target.value)}
                        />
                        :
                        String(translateBookingValue(lineTitle, lineValue))}
                </div>
            </div>
        </div>
    );
}

export default BookingLine;
