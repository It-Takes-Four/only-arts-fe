import type { DayOfWeek } from "./_models";

const formatDate = (date: Date, includeSecond: boolean = false) => {
    const padZero = (value: number) => String(value).padStart(2, "0");

    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    const formattedTime = includeSecond ? ` ${hours}:${minutes}:${seconds}` : ` ${hours}:${minutes}`;
    return `${year}-${month}-${day}${formattedTime}`;
};

export const toDT = (inputDate: Date, includeSecond: boolean = false) => {
    return formatDate(new Date(inputDate), includeSecond);
};

export const toDate = (inputDate: Date) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const startDayOfThisMonth = () => {
    const date = new Date();
    date.setDate(1);
    return date;
}

export const endDayOfThisMonth = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1, 0);
    return date;
};

export const dayOfWeekData: DayOfWeek[] = [
    { day_of_week: 0, name: "Sunday" },
    { day_of_week: 1, name: "Monday" },
    { day_of_week: 2, name: "Tuesday" },
    { day_of_week: 3, name: "Wednesday" },
    { day_of_week: 4, name: "Thursday" },
    { day_of_week: 5, name: "Friday" },
    { day_of_week: 6, name: "Saturday" }
];

export const getDayOfWeekName = (day_of_week: number) => {
    const day = dayOfWeekData.find(day => day.day_of_week === day_of_week);
    return day ? day.name : "Invalid day"; // If day is found, return its name; otherwise, return "Invalid day"
}