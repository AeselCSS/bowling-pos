import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { IAirHockeyBooking, IBowlingBooking, IDinnerBooking, IPatchBooking } from '../types/booking';

interface BookingResponse<T> {
    data: T[];
    nextPage?: number;
}

function useBookings() {
    const url = import.meta.env.VITE_API_URL;

    const [bookings, setBookings] = useState<(IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[]>([]);
    const [page, setPage] = useState(0);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
    const [fetchNextPageFn, setFetchNextPageFn] = useState<() => void>(() => {});

    const getBookingsByEmail = async <T>(type: string, email: string, pageParam: number, size: number): Promise<BookingResponse<T>> => {
        try {
            const response = await fetch(`${url}/${type}/email/${email}?page=${pageParam}&size=${size}`);
            const data = await response.json();
            if (response.status === 404) {
                return { data: [] };
            }
            return { data: data.content, nextPage: data.content.length === size ? pageParam + 1 : undefined };
        } catch (error) {
            console.error(error);
            return { data: [], nextPage: undefined };
        }
    };

    const fetchBookingsByEmail = (email: string, size: number = 5) => {
        const query = useInfiniteQuery<BookingResponse<IBowlingBooking | IAirHockeyBooking | IDinnerBooking>, Error>({
            queryKey: ['bookings', email],
            queryFn: async ({ pageParam = 0 }) => {
                const bookingTypes = ['bowling', 'airhockey', 'dinner'];
                const results = await Promise.all(
                    bookingTypes.map(type => getBookingsByEmail<IBowlingBooking | IAirHockeyBooking | IDinnerBooking>(type, email, pageParam as number, size))
                );

                return results.reduce((acc, result) => {
                    acc.data.push(...result.data);
                    acc.nextPage = result.nextPage;
                    return acc;
                }, { data: [], nextPage: results[0].nextPage });
            },
            getNextPageParam: (lastPage) => lastPage.nextPage,
            initialPageParam: 0,
            enabled: !!email, // Only fetch data if email is provided
        });

        useEffect(() => {
            if (query.data) {
                const allPages = query.data.pages.flatMap(page => page.data);
                setBookings(allPages);
                setPage(query.data.pages.length - 1);
                setHasNextPage(query.hasNextPage ?? false);
            }
        }, [query.data, query.hasNextPage]);

        useEffect(() => {
            setIsFetchingNextPage(query.isFetchingNextPage);
            setFetchNextPageFn(() => query.fetchNextPage);
        }, [query.isFetchingNextPage, query.fetchNextPage]);

        return { bookings, page, hasNextPage, isFetchingNextPage, fetchNextPage: fetchNextPageFn };
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

    const fetchBookingById = (id: number) => {
        const bookingTypes = ['bowling', 'airhockey', 'dinner'];

        const queries = bookingTypes.map(type =>
            useQuery({
                queryKey: ['booking', id, type],
                queryFn: () => getBookingById(id, type),
                enabled: !!id,
            })
        );

        useEffect(() => {
            queries.forEach(query => {
                if (query.data) {
                    setBookings(prev => [...prev.filter(b => b.id !== id), query.data!].filter(b => b !== null));
                }
            });
        }, [queries.map(query => query.data)]);

        return queries
            .map(query => query.data)
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
                setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...booking } : b)));
                return data;
            } else {
                toast.error("Booking could not be updated");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const checkAvailability = async (start: string, end: string, type: string, numberOfGuests?: number) => {
        let urlPath: string;

        switch (type) {
            case 'dinner':
                urlPath = `${type}/availability?start=${start}&end=${end}&numberOfGuests=${numberOfGuests}`;
                break;
            case 'bowling':
                urlPath = `bowling-lanes/availability?start=${start}&end=${end}`;
                break;
            case 'airhockey':
                urlPath = `airhockey-tables/availability?start=${start}&end=${end}`;
                break;
            default:
                throw new Error(`Unsupported booking type: ${type}`);
        }

        try {
            const response = await fetch(`${url}/${urlPath}`);
            return await response.json();
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    async function getBookingPrice(booking: IBowlingBooking | IAirHockeyBooking | IDinnerBooking): Promise<number> {
        const bookingType = booking.hasOwnProperty('numberOfGuests') ? 'dinner' : booking.hasOwnProperty('laneId') ? 'bowling' : 'airhockey';

        if (bookingType === 'dinner') {
            return 0;
        }

        try {
            const response = await fetch(`${url}/${bookingType}/${booking.id}/price`);
            return await response.json();
        } catch (error) {
            console.error(error);
        }

        return 0;
    }

    return {
        bookings,
        setBookings,
        fetchBookingsByEmail,
        fetchBookingById,
        update,
        checkAvailability,
        getBookingPrice,
        page,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage: fetchNextPageFn,
    };
}

export default useBookings;
