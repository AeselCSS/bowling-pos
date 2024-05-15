import { useState } from 'react';
import type { IBowlingBooking, IAirHockeyBooking, IDinnerBooking } from '../types/booking';

function useBookings() {
    const [bowlingBookings, setBowlingBookings] = useState<IBowlingBooking[]>([]);
    const [airHockeyBookings, setAirHockeyBookings] = useState<IAirHockeyBooking[]>([]);
    const [dinnerBookings, setDinnerBookings] = useState<IDinnerBooking[]>([]);
    const url = import.meta.env.VITE_API_URL;

    async function getAll() {
        await getAllBowlingBookings();
        await getAllAirHockeyBookings();
        await getAllDinnerBookings();
    }

    async function getAllById(id: number) {
        const bookings: (IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[] = [];
        const bowlingBoookings: IBowlingBooking = await getBowlingBookingById(id);
        const airHockeyBookings: IAirHockeyBooking = await getAirHockeyBookingById(id);
        const dinnerBookings: IDinnerBooking = await getDinnerBookingById(id);

        if (bowlingBoookings) bookings.push(bowlingBoookings);
        if (airHockeyBookings) bookings.push(airHockeyBookings);
        if (dinnerBookings) bookings.push(dinnerBookings);
        return bookings;
    }

    async function getAllByEmail(email: string) {
        const bookings: (IBowlingBooking | IAirHockeyBooking | IDinnerBooking)[] = [];
        const bowlingBoookings: IBowlingBooking[] = await getBowlingBookingsByEmail(email);
        const airHockeyBookings: IAirHockeyBooking[] = await getAirHockeyBookingsByEmail(email);
        const dinnerBookings: IDinnerBooking[] = await getDinnerBookingsByEmail(email);

        if (bowlingBoookings) bookings.push(...bowlingBoookings);
        if (airHockeyBookings) bookings.push(...airHockeyBookings);
        if (dinnerBookings) bookings.push(...dinnerBookings);
        return bookings;
    }

    async function getAllBowlingBookings() {
        try {
            const response = await fetch(`${url}/bowling`);
            const data = await response.json();
            setBowlingBookings(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function getBowlingBookingById(id: number) {
        try {
            const response = await fetch(`${url}/bowling/${id}`);
            if (response.status === 404) {
                return null;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async function getBowlingBookingsByEmail(email: string) {
        try {
            const response = await fetch(`${url}/bowling/email/${email}`);
            const data = await response.json();
            if (response.status === 404) {
                return null;
            }
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    async function getAllAirHockeyBookings() {
        try {
            const response = await fetch(`${url}/airhockey`);
            const data = await response.json();
            setAirHockeyBookings(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function getAirHockeyBookingById(id: number) {
        try {
            const response = await fetch(`${url}/airhockey/${id}`);
            if (response.status === 404) {
                return null;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    async function getAirHockeyBookingsByEmail(email: string) {
        try {
            const response = await fetch(`${url}/airhockey/email/${email}`);
            const data = await response.json();
            if (response.status === 404) {
                return null;
            }
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    async function getAllDinnerBookings() {
        try {
            const response = await fetch(`${url}/dinner`);
            const data = await response.json();
            setDinnerBookings(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function getDinnerBookingById(id: number) {
        try {
            const response = await fetch(`${url}/dinner/${id}`);
            if (response.status === 404) {
                return null;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    async function getDinnerBookingsByEmail(email: string) {
        try {
            const response = await fetch(`${url}/dinner/email/${email}`);
            const data = await response.json();
            if (response.status === 404) {
                return null;
            }
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    return {
        bowlingBookings,
        setBowlingBookings,
        airHockeyBookings,
        dinnerBookings,
        getAll,
        getAllById,
        getAllByEmail
    }
}

export default useBookings;