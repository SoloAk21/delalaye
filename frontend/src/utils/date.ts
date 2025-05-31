import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'

export  function accountExpired(targetDate: string): boolean {
    // Convert the target date string to a Date object
    const targetDateTime = new Date(targetDate);
    
    // Get today's date
    const today = new Date();

    // Calculate the difference in milliseconds
    const differenceMs = today.getTime() - targetDateTime.getTime();

    // Convert milliseconds to days
    const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    
    return differenceDays>0;



}


export  const calculateDateDifference = (targetDate:string) => {
    dayjs.extend(relativeTime)
    return dayjs(targetDate).fromNow()
};

export  const formatDate = (dateString:string) => {
    // Format the date using date-fns
    return dayjs(dateString).format('MMM DD YYYY') // Output format: Jan 12 2023
};