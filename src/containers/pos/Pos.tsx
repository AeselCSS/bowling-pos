import BookingResult from "./components/BookingResult";
import SaleProducts from "./components/SaleProducts";
import Basket from "./components/Basket";
import { useState, useEffect } from 'react';
import useBookings from '../../hooks/useBookings';
import useSaleProducts from '../../hooks/useSaleProducts';
import type { IBowlingBooking, IAirHockeyBooking, IDinnerBooking } from '../../types/booking';
import { Dispatch, SetStateAction } from 'react';
import PageLayout from "../../components/PageLayout";
import { IBasketProduct } from "../../types/basketProduct";

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
        <div className="flex flex-col border border-zinc-400 rounded-md min-w-96 w-full bg-zinc-100">
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
    const { saleProducts } = useSaleProducts();
    const [bookings, setBookings] = useState<(IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[]>([]);
    const [bookingId, setBookingId] = useState("");
    const [bookingEmail, setBookingEmail] = useState("");
    const [basket, setBasket] = useState<(IBasketProduct)[]>([]);

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

    useEffect(() => {
        console.log(basket);
    }, [basket]);

    return (
        <PageLayout>
            <div className="flex">
                <div className="flex-row w-2/6 m-5">
                    <SearchBar setBookingId={setBookingId} setBookingEmail={setBookingEmail} />
                    {!!bookings.length && <BookingResult bookings={bookings} setBookings={setBookings} />}
                </div>
                <div className="flex-row w-3/12 m-5">
                    <SaleProducts saleProducts={saleProducts} setBasket={setBasket} />
                </div>
                {basket.length > 0 &&
                    <div className="flex-row w-3/12 m-5">
                        <Basket basket={basket} setBasket={setBasket} />
                    </div>
                }
                
            </div>
        </PageLayout>
    )
}

export default Pos;