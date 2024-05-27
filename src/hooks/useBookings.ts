import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import type {IAirHockeyBooking, IBowlingBooking, IDinnerBooking, IPatchBooking} from '../types/booking';
import toast from 'react-hot-toast';

interface BookingResponse<T> {
    data: T[];
    nextPage?: number;
}

function useBookings() {
    const url = import.meta.env.VITE_API_URL;

    const getBookingsByEmail = async <T>(type: string, email: string, pageParam: number, size: number): Promise<BookingResponse<T>> => {
    try {
        const response = await fetch(`${url}/${type}/email/${email}?page=${pageParam}&size=${size}`);
        const data = await response.json();
        if (response.status === 404) {
            return {data: []};
        }
        // Extract the content field from the data
        return {data: data.content, nextPage: data.content.length === size ? pageParam + 1 : undefined};
    } catch (error) {
        console.error(error);
        return {data: [], nextPage: undefined};
    }
};

    const useGetAllByEmail = (email: string, size: number = 5) => {
        return useInfiniteQuery<BookingResponse<IBowlingBooking | IAirHockeyBooking | IDinnerBooking>, Error>({
            queryKey: ['bookings', email],
            queryFn: async ({pageParam = 0}) => {
                const bookingTypes = ['bowling', 'airhockey', 'dinner'];
                const results = await Promise.all(
                    bookingTypes.map(type => getBookingsByEmail<IBowlingBooking | IAirHockeyBooking | IDinnerBooking>(type, email, pageParam as number, size))
                );

                return results.reduce((acc, result) => {
                    acc.data.push(...result.data);
                    acc.nextPage = result.data.length === size ? pageParam as number + 1 : acc.nextPage;
                    return acc;
                }, {data: [], nextPage: results[0].data.length});
            },
            getNextPageParam: (lastPage) => lastPage.nextPage,
            initialPageParam: 0,
            enabled: !!email, // Only fetch data if email is provided
        });
    };

    const getBookingById = async (id: number, type: string): Promise<IBowlingBooking | IAirHockeyBooking | IDinnerBooking | null> => {
        try {
            const response = await fetch(`${url}/${type}/${id}`);
            if (response.status === 404) {
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const useGetBookingById = (id: number) => {
        const bookingTypes = ['bowling', 'airhockey', 'dinner'];

        const results = bookingTypes.map(type =>
            useQuery({
                queryKey: ['booking', id, type],
                queryFn: () => getBookingById(id, type),
                enabled: !!id,
            })
        );

        return results
            .map(result => result.data)
            .filter(data => data !== null) as (IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[];
    };

    async function update(id: number, booking: IPatchBooking, type: string) {
        try {
            const response = await fetch(`${url}/${type}/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(booking)
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success("Booking updated");
                return data;
            } else {
                toast.error("Booking could not be updated");
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function checkAvailability(start: string, end: string, type: string, numberOfGuests?: number) {
        const urlPath = type === 'dinner' ? `${type}/availability?start=${start}&end=${end}&numberOfGuests=${numberOfGuests}` : `${type}-lanes/availability?start=${start}&end=${end}`;
        try {
            const response = await fetch(`${url}/${urlPath}`);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async function getBookingPrice(booking: IBowlingBooking | IAirHockeyBooking | IDinnerBooking): Promise<number>{
        const bookingType = booking.hasOwnProperty('numberOfGuests') ? 'dinner' : booking.hasOwnProperty('laneId') ? 'bowling' : 'airhockey';

        if(bookingType === 'dinner') {
            return 0;
        }

        try {
            const response = await fetch(`${url}/${bookingType}/${booking.id}/price`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }

        return 0;
    }

    return {
        useGetAllByEmail,
        useGetBookingById,
        update,
        checkAvailability,
        getBookingPrice
    };
}

export default useBookings;
