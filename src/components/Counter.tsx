import React, { useState } from "react";
import styles from "../styles/Counter.module.css";
import {
  months,
  getNumberSuffix,
  getTimeSuffix,
  getHourNumber,
  formatForClock,
  getTimeUntil,
  getDateFromCountdown,
  eventIsToday,
} from "../timeutils";
import { Countdown } from "../types";

import { useEffect } from "react";

interface CounterProps {
  countdown: Countdown;
  use24hour: boolean;
  confetti: any;
}

interface Until {
  d: string;
  h: string;
  m: string;
  s: string;
}

const Counter = (props: CounterProps) => {
  const { countdown, use24hour, confetti } = props;

  const [time, setTime] = useState(new Date());
  const [target, setTarget] = useState<Date>(
    getDateFromCountdown(countdown, time)
  );
  const [until, setUntil] = useState<Until>({
    d: "00",
    h: "00",
    m: "00",
    s: "00",
  });
  const [tick, setTick] = useState<number>(0);

  const [interval, updateInterval] = useState<any>();

  function update() {
    setTime(new Date());

    const timeUntil = getTimeUntil(time, target);

    setUntil({
      d: formatForClock(timeUntil.d),
      h: formatForClock(timeUntil.h),
      m: formatForClock(timeUntil.m),
      s: formatForClock(timeUntil.s),
    });

    setTarget(target);

    function clearUntil() {
      setUntil({
        d: "00",
        h: "00",
        m: "00",
        s: "00",
      });
    }

    if (eventIsToday(countdown, time, target)) {
      clearUntil();

      // Start confetti animation
      confetti.startAnimation();

      // Push date back by one year
      if (!countdown.date.year) {
        target.setFullYear(target.getFullYear() - 1);
      }
    } else if (
      timeUntil.s < 0 ||
      timeUntil.m < 0 ||
      timeUntil.h < 0 ||
      timeUntil.d < 0
    ) {
      // Checks if the date has passed for non-recurring dates.
      clearUntil();
      confetti.pauseAnimation();
    } else {
      confetti.pauseAnimation();
    }
  }

  useEffect(() => {
    update();
    updateInterval(
      setInterval(() => {
        setTick(tick + 1);
      }, 1000)
    );
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    console.log(countdown);
    clearInterval(interval);

    setTime(new Date());
    setTarget(getDateFromCountdown(countdown, time));

    clearInterval(interval);
    setTick(tick + 1);
  }, [countdown]);

  return (
    <div className={styles.container}>
      <section
        className={`${styles.title} ${
          countdown.useDark ? styles.black : styles.white
        }`}
      >
        {countdown.name.replace(/{year}/g, target.getFullYear().toString())}
      </section>
      <section
        className={`${styles.when} ${
          countdown.useDark ? styles.black : styles.white
        }`}
      >
        {months[target.getMonth()]} {target.getDate()}
        {getNumberSuffix(target.getDate())}, {target.getFullYear()}{" "}
        {countdown.date.time
          ? `@ ${
              !use24hour
                ? formatForClock(target.getHours())
                : formatForClock(Number(getHourNumber(target.getHours())))
            }:${formatForClock(target.getMinutes())}:${formatForClock(
              target.getSeconds()
            )} ${!use24hour ? getTimeSuffix(target.getHours()) : ""}`
          : ""}
      </section>
      <section>
        {/* DD */}
        <span
          className={`${styles.ticker} ${
            countdown.useDark ? styles.tickerDark : undefined
          }`}
        >
          {until.d}
        </span>
        <span
          className={`${styles.colon} ${
            countdown.useDark ? styles.black : styles.white
          }`}
        >
          :
        </span>

        {/* HH */}

        <span
          className={`${styles.ticker} ${
            countdown.useDark ? styles.tickerDark : undefined
          }`}
        >
          {until.h}
        </span>
        <span
          className={`${styles.colon} ${
            countdown.useDark ? styles.black : styles.white
          }`}
        >
          :
        </span>

        {/* MM */}

        <span
          className={`${styles.ticker} ${
            countdown.useDark ? styles.tickerDark : undefined
          }`}
        >
          {until.m}
        </span>
        <span
          className={`${styles.colon} ${
            countdown.useDark ? styles.black : styles.white
          }`}
        >
          :
        </span>

        {/* SS */}

        <span
          className={`${styles.ticker} ${
            countdown.useDark ? styles.tickerDark : undefined
          }`}
        >
          {until.s}
        </span>
      </section>
    </div>
  );
};

export default Counter;
