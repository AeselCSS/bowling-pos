function translateBookingKey(key: string) {
    switch (key) {
        case 'id':
            return 'Booking ID';
        case 'customerEmail':
            return 'E-mail';
        case 'start':
            return 'Start Time';
        case 'end':
            return 'End Time';
        case 'status':
            return 'Status';
        case 'laneId':
            return 'Lane';
        case 'tableId':
            return 'Table';
        case 'numberOfGuests':
            return 'Number of Guests';
        case 'childFriendly':
            return 'Child Friendly';
        default:
            return key;
    }
}

function translateBookingValue(key: string, value: string | number | boolean | Date | undefined | null) {
    if (key === 'start' || key === 'end') {
        if (typeof value === 'string' && !isNaN(Date.parse(value))) {
            const date = new Date(value);
            return {
                date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
                time: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
            };
        }

        if (value instanceof Date) {
            return {
                date: `${value.getDate()}/${value.getMonth() + 1}/${value.getFullYear()}`,
                time: `${value.getHours()}:${value.getMinutes().toString().padStart(2, '0')}`
            };
        }
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    return value;
}

export { translateBookingKey, translateBookingValue };