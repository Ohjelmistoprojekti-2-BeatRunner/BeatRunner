import { formatDistanceToNow, format } from 'date-fns';

//date-fns library to show timestamps in a readable way, like "10 minutes ago"
export const formatTimestamp = (timestamp: any) => {
    const date = timestamp.toDate();

    // Check if the date is less than 2 days ago
    const daysDifference = (Date.now() - date.getTime()) / (1000 * 3600 * 24);

    if (daysDifference <= 2) {
        return `${formatDistanceToNow(date)} ago`;
    } else {
        // if result is older than 2 days, show the exact date
        return format(date, 'dd/MM/yyyy');
    }
};