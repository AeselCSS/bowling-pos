import BookingResult from "./components/BookingResult";
import SaleProducts from "./components/SaleProducts";
import Basket from "./components/Basket";
import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import useBookings from '../../hooks/useBookings';
import useSaleProducts from '../../hooks/useSaleProducts';
import PageLayout from "../../components/PageLayout";
import { IBasketProduct } from "../../types/basketProduct";

interface SearchBarProps {
    setBookingId: Dispatch<SetStateAction<string>>;
    setBookingEmail: Dispatch<SetStateAction<string>>;
}

function SearchBar({ setBookingId, setBookingEmail }: SearchBarProps) {
    const [searchId, setSearchId] = useState("");
    const [searchEmail, setSearchEmail] = useState("");

    function handleSearch(event: FormEvent) {
        event.preventDefault(); // Prevent the form from refreshing the page
        if (!isNaN(Number(searchId))) {
            setBookingId(searchId);
        }
        if (searchEmail) {
            setBookingEmail(searchEmail);
        }
    }

    return (
        <form onSubmit={handleSearch} className="flex flex-col border border-zinc-400 rounded-md min-w-96 bg-zinc-100 ml-5 mt-5">
            <input type="text" placeholder="Booking ID" onChange={(e) => { setSearchId(e.target.value) }} className="bg-white border border-zinc-400 rounded-lg w-3/5 p-2.5 m-2.5" />
            <div className="flex justify-between">
                <input type="text" placeholder="E-mail" onChange={(e) => { setSearchEmail(e.target.value) }} className="bg-white border border-zinc-400 rounded-lg w-3/5 p-2.5 m-2.5" />
                <button type="submit" className="bg-zinc-300 border-zinc-500 border cursor-pointer text-gray-600 py-2 px-4 my-2.5 mr-6 rounded-md hover:bg-zinc-50 "> Search </button>
            </div>
        </form>
    );
}

function Pos() {
    const { fetchBookingsByEmail, fetchBookingById, update, bookings, setBookings, hasNextPage, isFetchingNextPage, fetchNextPage } = useBookings();
    const { saleProducts, setSaleProducts } = useSaleProducts();
    const [bookingId, setBookingId] = useState<string>("");
    const [bookingEmail, setBookingEmail] = useState<string>("");
    const [basket, setBasket] = useState<(IBasketProduct)[]>([]);

    fetchBookingsByEmail(bookingEmail);
    fetchBookingById(Number(bookingId));

    const setBookingPaid = async (id: number) => {
        const booking = bookings.find(booking => booking && booking.id === id);
        if(!booking) return;
        const bookingType = booking?.hasOwnProperty('laneId') ? 'bowling' : booking?.hasOwnProperty('tableId') ? 'airhockey' : 'dinner';
        await update(id, {status: "PAID"}, bookingType);
        setBookings(prev => prev.map(booking => booking && booking.id === id ? { ...booking, status: "PAID" } : booking));
    }

    return (
        <PageLayout>
            <div className="flex">
                <div className="flex flex-col w-2/6">
                    <SearchBar setBookingId={setBookingId} setBookingEmail={setBookingEmail}/>
                    <div className="flex-row ml-5">
                        {!!bookings.length &&
                            <BookingResult
                                bookings={bookings}
                                setBookings={setBookings}
                                setBasket={setBasket}
                                fetchNextPage={fetchNextPage}
                                hasNextPage={hasNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                            />}
                    </div>
                </div>

                <div className="flex-row w-3/12 m-5">
                    <SaleProducts saleProducts={saleProducts} setBasket={setBasket} setSaleProducts={setSaleProducts}/>
                </div>
                {basket.length > 0 &&
                    <div className="flex-row w-3/12 mt-5">
                        <Basket basket={basket} setBasket={setBasket} setBookingPaid={setBookingPaid}/>
                    </div>
                }
            </div>
        </PageLayout>
    );
}

export default Pos;
