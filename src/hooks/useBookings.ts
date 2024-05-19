import {useState} from 'react';
import type {IAirHockeyBooking, IBowlingBooking, IDinnerBooking, IPatchBooking} from '../types/booking';
import toast from 'react-hot-toast';

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

    async function update(id: number, booking: IPatchBooking, type: string) {
        switch (type) {
            case "bowling":
                return updateBowling(id, booking);
            case "airhockey":
                return updateAirHockey(id, booking);
            case "dinner":
                return updateDinner(id, booking);
            default:
                return null;
        }
    }

    async function updateBowling(id: number, booking: IPatchBooking) {
        try {
            const response = await fetch(`${url}/bowling/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(booking)
            });
            const data = await response.json();
            if(response.status === 200) {
                toast.success("Booking updated");
                return data;
            } else {
                toast.error("Booking could not be updated");
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function updateAirHockey(id: number, booking: IPatchBooking) {
        try {
            const response = await fetch(`${url}/airhockey/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(booking)
            });
            const data = await response.json();
            if(response.status === 200) {
                toast.success("Booking updated");
                return data;
            } else {
                toast.error("Booking could not be updated");
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function updateDinner(id: number, booking: IPatchBooking) {
        try {
            const response = await fetch(`${url}/dinner/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(booking)
            });
            const data = await response.json();
            if(response.status === 200) {
                toast.success("Booking updated");
                return data;
            } else {
                toast.error("Booking could not be updated");
            }
        } catch (error) {
            console.error(error);
        }
    }

        async function checkAvailability(start: string, end: string, type: string) {
            switch (type) {
                case "bowling":
                    return checkBowlingAvailability(start, end);
                case "airhockey":
                    return checkAirHockeyAvailability(start, end);
                case "dinner":
                    return checkDinnerAvailability(start, end);
                default:
                    return null;
            }
        }

        async function checkBowlingAvailability(start: string, end: string) {
            try {
                const response = await fetch(`${url}/bowling-lanes/availability?start=${start}&end=${end}`);
                return await response.json();
            } catch (error) {
                console.error(error);
            }
        }

        async function checkAirHockeyAvailability(start: string, end: string) {
            try {
                const response = await fetch(`${url}/airhockey/availability?start=${start}&end=${end}`);
                return await response.json();
            } catch (error) {
                console.error(error);
            }
        }

        async function checkDinnerAvailability(start: string, end: string) {
            try {
                const response = await fetch(`${url}/dinner/availability?start=${start}&end=${end}`);
                return await response.json();
            } catch (error) {
                console.error(error);
            }
        }

    return {
        bowlingBookings,
        airHockeyBookings,
        dinnerBookings,
        getAll,
        getAllById,
        getAllByEmail,
        update,
        checkAvailability
    }
}


export default useBookings;