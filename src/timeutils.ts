import { Countdown, DateTimeDict } from "./types";

const months: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdays: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const msecondsIn = {
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

function getNumberSuffix(number: number): string {
  const last = number.toString().split("").pop();

  if (number >= 11 && number <= 19) {
    return "th";
  } else {
    switch (last) {
      case "1":
        return "st";
      case "2":
        return "nd";
      case "3":
        return "rd";
      default:
        return "th";
    }
  }
}

function getTimeSuffix(hour: number): string {
  return hour < 12 ? "AM" : "PM";
}

function formatForClock(number: number): string {
  return number < 10 ? "0" + number : number.toString();
}

function getHourNumber(number: number): number {
  if (number == 0) {
    return 12;
  } else if (number >= 13) {
    return number - 12;
  } else {
    return number;
  }
}

function getTimeUntil(from: Date | number, to: Date | number): DateTimeDict {
  const distance: number = to.valueOf() - from.valueOf();

  const totalHours: number = Math.floor(distance / msecondsIn.hour);
  const totalMinutes: number = Math.floor(distance / msecondsIn.minute);

  const days: number = Math.floor(distance / msecondsIn.day);
  const hours: number = Math.floor(distance / msecondsIn.hour) - days * 24;
  const minutes: number =
    Math.floor(distance / msecondsIn.minute) - totalHours * 60;
  const seconds: number =
    Math.floor(distance / msecondsIn.second) - totalMinutes * 60;

  return {
    d: days,
    h: hours,
    m: minutes,
    s: seconds,
  };
}

function getDateFromCountdown(countdown: Countdown, now: Date): Date {
  let dateObj: Date;

  if (countdown.date.time) {
    dateObj = new Date(
      now.getFullYear(),
      countdown.date.month - 1,
      countdown.date.day,
      countdown.date.time.hour,
      countdown.date.time.minute,
      countdown.date.time.second
    );
  } else {
    dateObj = new Date(
      now.getFullYear(),
      countdown.date.month - 1,
      countdown.date.day
    );
  }

  if (countdown.date.year == null) {
    if (now > dateObj) {
      dateObj.setFullYear(now.getFullYear() + 1);
    }
  } else {
    dateObj.setFullYear(countdown.date.year);
  }

  return dateObj;
}

function eventIsToday(countdown: Countdown, now: Date, dateObj: Date): boolean {
  if (
    dateObj.getMonth() == now.getMonth() &&
    dateObj.getDate() == now.getDate()
  ) {
    if (countdown.date.year) {
      if (countdown.date.year == dateObj.getFullYear()) {
        return true;
      }
    } else {
      return true;
    }
  }

  return false;
}

export {
  getNumberSuffix,
  getTimeSuffix,
  formatForClock,
  getHourNumber,
  months,
  getTimeUntil,
  getDateFromCountdown,
  eventIsToday,
  weekdays,
};
