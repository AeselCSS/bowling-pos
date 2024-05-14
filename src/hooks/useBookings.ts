import { useEffect, useState } from 'react';
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
        await getBowlingBookingById(id);
        //await getAirHockeyBookingById(id);
        //await getDinnerBookingById(id);
    }

    async function getAllBowlingBookings() {
        const response = await fetch(`${url}/bowling`);
        const data = await response.json();
        setBowlingBookings(data);
    }

    async function getBowlingBookingById(id: number) {
        const response = await fetch(`${url}/bowling/${id}`);
        const data = await response.json();
        setBowlingBookings(data);
        console.log([data]);
    }

    async function getAllAirHockeyBookings() {
        const response = await fetch(`${url}/airhockey`);
        const data = await response.json();
        setAirHockeyBookings(data);
    }

    async function getAirHockeyBookingById(id: number) {
        const response = await fetch(`${url}/airhockey/${id}`);
        const data = await response.json();
        return data;
    }

    async function getAllDinnerBookings() {
        const response = await fetch(`${url}/dinner`);
        const data = await response.json();
        setDinnerBookings(data);
    }

    async function getDinnerBookingById(id: number) {
        const response = await fetch(`${url}/dinner/${id}`);
        const data = await response.json();
        return data;
    }

    async function getAllByEmail(email: string) {
        const bowlingResponse = await fetch(`${url}/bowling/email/${email}`);
        const bowlingData = await bowlingResponse.json();
        setBowlingBookings(bowlingData);
        const airHockeyResponse = await fetch(`${url}/airhockey/email/${email}`);
        const airHockeyData = await airHockeyResponse.json();
        setAirHockeyBookings(airHockeyData);
        const dinnerResponse = await fetch(`${url}/dinner/email/${email}`);
        const dinnerData = await dinnerResponse.json();
        setDinnerBookings(dinnerData);
    }

    return {
        bowlingBookings,
        airHockeyBookings,
        dinnerBookings,
        getAll,
        getAllById,
        getAllByEmail
    }
}

export default useBookings;