import BookingResult from "./components/BookingResult";
import { useState, useEffect } from 'react';
import useBookings from '../../hooks/useBookings';
import type { IBowlingBooking, IAirHockeyBooking, IDinnerBooking } from '../../types/booking';
import { Dispatch, SetStateAction } from 'react';
import PageLayout from "../../components/PageLayout";

interface SearchBarProps {
    setBookingId: Dispatch<SetStateAction<string>>;
    setBookingEmail: Dispatch<SetStateAction<string>>;
}

function SearchBar({setBookingId, setBookingEmail}: SearchBarProps){
    const [searchId, setSearchId] = useState("");
    const [searchEmail, setSearchEmail] = useState("");

    function handleSearch() {
        if (!isNaN(Number(searchId))) {
            setBookingId(searchId);
        }
        if (searchEmail) {
            setBookingEmail(searchEmail);
        } 
    }

    return (
        <div className="flex flex-col border border-zinc-400 rounded-md min-w-96 w-2/6 bg-zinc-100 m-5">
            <input type="text" placeholder="Booking ID" onChange={(e) => {setSearchId(e.target.value)}} className="bg-white border border-zinc-400 rounded-lg w-3/5 p-2.5 m-2.5"/>
            <div className="flex justify-between">
                <input type="text" placeholder="E-mail" onChange={(e) => {setSearchEmail(e.target.value)}} className="bg-white border border-zinc-400 rounded-lg w-3/5 p-2.5 m-2.5"/>
                <input type="button" value="Search" onClick={handleSearch} className="bg-zinc-300 border-zinc-500 border cursor-pointer text-gray-600 py-2 px-4 my-2.5 mr-6 rounded-md hover:bg-zinc-50 "/>
            </div>
        </div>
    )
}

function Pos() {
    const { getAllById, getAllByEmail } = useBookings();
    const [bookings, setBookings] = useState<(IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[]>([]);
    const [bookingId, setBookingId] = useState("");
    const [bookingEmail, setBookingEmail] = useState("");

    useEffect(() => {
        (async () => {
            if (bookingId) {
                const responseBookings = await getAllById(Number(bookingId));
                setBookings(responseBookings);
            } else if (bookingEmail) {
                const responseBookings = await getAllByEmail(bookingEmail);
                setBookings(responseBookings);
            }
        })();
    }, [bookingId, bookingEmail]);

    return (
        <PageLayout>
            <div className="h-1"></div> {/*jeg mister forstanden, jeg kan ik rykke SearchBar nedaf uden at tilføje et element over den. Margin skærer ind i nav bar :') todo:fix lol*/}
            <SearchBar setBookingId={setBookingId} setBookingEmail={setBookingEmail} />
            {!!bookings.length && <BookingResult bookings={bookings} setBookings={setBookings} />}
            
        </PageLayout>
    )
}

export default Pos;