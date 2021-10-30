import React from 'react';
import styles from "../styles/Counter.module.css";
import {months, getNumberSuffix, getTimeSuffix, getHourNumber, formatForClock, getTimeUntil, getDateFromCountdown, eventIsToday} from "../timeutils";
import { Countdown } from '../types';

const Counter = ( props: any ) => {
  const countdown: Countdown = props.countdown;
  const now: Date = new Date(props.time);
  const use12hour = !props.use24hour;

  const dateObj = getDateFromCountdown(countdown, now)
  const timeUntil = getTimeUntil(now, dateObj);

  const until = {
    "d": formatForClock(timeUntil.d),
    "h": formatForClock(timeUntil.h),
    "m": formatForClock(timeUntil.m),
    "s": formatForClock(timeUntil.s)
  }

  function clearUntil() {
    until.d = "00";
    until.h = "00";
    until.m = "00";
    until.s = "00";
  }

  if(eventIsToday(countdown, now, dateObj)) {
    clearUntil();
    if(!countdown.date.year) { dateObj.setFullYear(dateObj.getFullYear() - 1) }
  } else if(timeUntil.s < 0 || timeUntil.m < 0 || timeUntil.h < 0 || timeUntil.d < 0) { // Checks if the date has passed for non-recurring dates.
    clearUntil();
  }

  return <div className={styles.container}>
    <section className={`${styles.title} ${countdown.useDark ? styles.black : styles.white}`}>
      {countdown.name.replace(/{year}/g, dateObj.getFullYear().toString())}
    </section>
    <section className={`${styles.when} ${countdown.useDark ? styles.black : styles.white}`}>
      {months[dateObj.getMonth()]} {dateObj.getDate()}{getNumberSuffix(dateObj.getDate())}, {dateObj.getFullYear()} {countdown.date.time ? `@ ${use12hour ? formatForClock(dateObj.getHours()) : formatForClock(Number(getHourNumber(dateObj.getHours())))}:${formatForClock(dateObj.getMinutes())}:${formatForClock(dateObj.getSeconds())} ${use12hour ? getTimeSuffix(dateObj.getHours()) : ''}` : ''}
    </section>
    <section>
      <span className={`${styles.ticker} ${countdown.useDark ? styles.tickerDark : undefined}`}>{until.d}</span>
      <span className={`${styles.colon} ${countdown.useDark ? styles.black : styles.white}`}>:</span>
      <span className={`${styles.ticker} ${countdown.useDark ? styles.tickerDark : undefined}`}>{until.h}</span>
      <span className={`${styles.colon} ${countdown.useDark ? styles.black : styles.white}`}>:</span>
      <span className={`${styles.ticker} ${countdown.useDark ? styles.tickerDark : undefined}`}>{until.m}</span>
      <span className={`${styles.colon} ${countdown.useDark ? styles.black : styles.white}`}>:</span>
      <span className={`${styles.ticker} ${countdown.useDark ? styles.tickerDark : undefined}`}>{until.s}</span>
    </section>
  </div>;
};

export default Counter;