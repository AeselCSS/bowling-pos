import { useState } from 'react';
import { IBowlingBooking, IAirHockeyBooking, IDinnerBooking } from '../../../types/booking';
import { ConfirmModal } from '../../../components/Modal';
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { MdControlPoint, MdArrowBack } from "react-icons/md";

interface BookingButtonsProps {
    booking: IBowlingBooking | IAirHockeyBooking | IDinnerBooking;
    onCancel: (id: number, bookingType: string) => void;
    onEditToggle: (id: number) => void;
    onAccept: (id: number, bookingType: string) => void;
    isEditing: boolean;
}

function BookingButtons({ booking, onCancel, onEditToggle, onAccept, isEditing }: BookingButtonsProps) {
    let bookingType = booking.hasOwnProperty('laneId') ? 'bowling' : booking.hasOwnProperty('tableId') ? 'airHockey' : 'dinner';
    const [showCancelModal, setShowCancelModal] = useState(false);

    return (
        <>
            {booking.status !== 'CANCELLED' && <>
                {showCancelModal && (
                    <ConfirmModal
                        setIsOpen={setShowCancelModal}
                        onConfirm={() => {
                            onCancel(booking.id, bookingType);
                            setShowCancelModal(false);
                        }}
                    />
                )}
                <div className="flex w-2/5 pl-5 items-end">
                    {isEditing ? (
                        <>
                            <button className='bg-green-600 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 ml-6 mr-2 rounded-md hover:bg-zinc-50 w-1.5/5' onClick={() => onAccept(booking.id, bookingType)}><MdControlPoint /></button>
                            <button className='bg-zinc-300 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 mr-2 rounded-md hover:bg-zinc-50 w-1.5/5' onClick={() => onEditToggle(booking.id)}><MdArrowBack /></button>
                        </>
                    ) : (
                        <>
                            <button
                                className='bg-red-500 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 ml-6 mr-2 rounded-md hover:bg-zinc-50 w-1.5/5'
                                onClick={() => setShowCancelModal(true)}><MdOutlineCancel/></button>
                            <button
                                className='bg-zinc-300 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 mr-2 rounded-md hover:bg-zinc-50 w-1.5/5'
                                onClick={() => onEditToggle(booking.id)}><FaRegEdit/></button>
                            <button
                                className='bg-green-600 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 mr-2 rounded-md hover:bg-zinc-50 w-1.5/5'>
                                <MdControlPoint/></button>
                        </>
                    )}
                </div>
            </>}
        </>
    )
}

export default BookingButtons;



/*<button
    className='bg-green-600 border-zinc-500 border cursor-pointer text-black text-center py-2 px-4 my-3 mr-2 rounded-md hover:bg-zinc-50 w-1.5/5'>
    <MdControlPoint/></button>
 */