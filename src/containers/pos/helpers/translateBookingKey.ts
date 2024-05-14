function translateBookingKey(key: string) {
    switch (key) {
        case 'id':
            return 'Booking ID';
        case 'customerEmail':
            return 'E-mail';
        case 'start':
            return 'Start';
        case 'end':
            return 'End';
        case 'status':
            return 'Status';
        case 'laneId':
            return 'Lane';
        case 'tableId':
            return 'Table';
        case 'numberOfGuests':
            return 'Number of Guests';
        default:
            return key;
    }
}

export default translateBookingKey;