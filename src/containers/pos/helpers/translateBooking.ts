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

function translateBookingValue(value: string | number | boolean | Date | undefined | null) {
    if(typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    if(typeof value === 'string' && !isNaN(Date.parse(value))) {
        const date = new Date(value);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    }
    
    if(value instanceof Date) {
        const date = new Date(value);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    }

    return value;
}

export {translateBookingKey, translateBookingValue};