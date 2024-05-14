interface IBooking {
    id: number;
    customerEmail: string;
    start: string;
    end: string;
    status: string;
}

interface IBowlingBooking extends IBooking {
    laneId: number;
}

interface IAirHockeyBooking extends IBooking {
    tableId: number;
}

interface IDinnerBooking extends IBooking {
    numberOfGuests: number;
}

export type {
    IBowlingBooking,
    IAirHockeyBooking,
    IDinnerBooking
}