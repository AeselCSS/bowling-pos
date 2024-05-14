import BookingResult from "./components/BookingResult";
import { useState, useEffect } from 'react';
import useBookings from '../../hooks/useBookings';

function SearchBar({setBookingId}: {setBookingId: (bookingId: string) => void}){
    const [searchId, setSearchId] = useState("");

    function handleSearch() {
        if (!isNaN(Number(searchId))) {
            setBookingId(searchId);
        }
    }

    return (
        <div className="flex flex-col border border-zinc-400 rounded-md min-w-96 w-2/6 bg-zinc-100 m-5">
            <input type="text" placeholder="Booking ID" onChange={(e) => {setSearchId(e.target.value)}} className="bg-white border border-zinc-400 rounded-lg w-3/5 p-2.5 m-2.5"/>
            <div className="flex justify-between">
                <input type="text" placeholder="E-mail" className="bg-white border border-zinc-400 rounded-lg w-3/5 p-2.5 m-2.5"/>
                <input type="button" value="Search" onClick={handleSearch} className="bg-zinc-300 border-zinc-500 border cursor-pointer text-gray-600 py-2 px-4 my-2.5 mr-6 rounded-md hover:bg-zinc-50 "/>
            </div>
        </div>
    )
}

function Pos() {
    const { bowlingBookings, airHockeyBookings, dinnerBookings, getAllById} = useBookings();
    const [bookingId, setBookingId] = useState("");

    useEffect(() => {
        if (bookingId) getAllById(Number(bookingId));
    }, [bookingId]);

    return (
        <>
            <SearchBar setBookingId={setBookingId} />
            {!!bowlingBookings.length && <BookingResult bookings={bowlingBookings} />}
        </>
    )
}

export default Pos;