import { Countdown as CountdownType, DateTimeDict } from "../types";
import ConfettiWorker from "../ConfettiWorker";
import styles from "../styles/Countdown.module.scss";
import { useEffect, useState } from "react";
import {
  formatForClock,
  getTimeUntil,
  getDateFromCountdown,
  months,
  weekdays,
  eventIsToday,
} from "../timeutils";
import Confetti from "./Confetti";
import Head from "next/head";
import { Menu } from "../pages/create";

export interface CountdownProps {
  countdown: CountdownType;
  setMenu?: any;
}

export default function Countdown({ countdown, setMenu }: CountdownProps) {
  const [until, setUntil] = useState<DateTimeDict>({ d: 0, h: 0, m: 0, s: 0 });
  const [countdownDate, setCountdownDate] = useState<Date>(
    getDateFromCountdown(countdown, new Date())
  );
  const [confetti, setConfetti] = useState(new ConfettiWorker([]));
  const [isToday, setIsToday] = useState<boolean>(false);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [current, setCurrent] = useState<any>();

  function update() {
    const date = getDateFromCountdown(countdown, new Date());
    setCountdownDate(date);
    const timeUntil = getTimeUntil(new Date(), date);
    setUntil(timeUntil);

    if (eventIsToday(countdown, new Date(), date)) {
      setIsToday(true);
      const now = new Date();

      // Start confetti animation

      if (
        countdown.date.time == undefined ||
        now.getHours() > countdown.date.time.hour ||
        (now.getHours() == countdown.date.time.hour &&
          now.getMinutes() > countdown.date.time.minute) ||
        (now.getHours() == countdown.date.time.hour &&
          now.getMinutes() == countdown.date.time.minute &&
          now.getSeconds() >= countdown.date.time.second)
      ) {
        setUntil({ d: 0, h: 0, m: 0, s: 0 });
        confetti.startAnimation();
      }
    } else if (
      timeUntil.s < 0 ||
      timeUntil.m < 0 ||
      timeUntil.h < 0 ||
      timeUntil.d < 0
    ) {
      // Checks if the date has passed for non-recurring dates.
      setUntil({ d: 0, h: 0, m: 0, s: 0 });
      confetti.pauseAnimation();
      setIsToday(false);
    } else {
      confetti.pauseAnimation();
      setIsToday(false);
    }
  }

  useEffect(() => {
    clearInterval(current);
    update();
    setCurrent(setInterval(update, 500));
  }, [countdown]);

  return (
    <div className={styles.countdownWrapper}>
      <Head>
        <title>
          {typeof countdown.name === "string"
            ? `${countdown.name.replace(
                "{year}",
                (countdownDate.getFullYear() - (isToday ? 1 : 0)).toString()
              )} - Countdowns`
            : "Countdowns"}
        </title>
      </Head>

      <Confetti confetti={confetti} />
      <div
        className={`${styles.countdown} ${
          countdown.useDark ? styles.dark : ""
        }`}
      >
        <header>
          <h2
            onClick={() => {
              if (setMenu) {
                setMenu(Menu.TITLE);
              }
            }}
          >
            {typeof countdown.name === "string"
              ? `${countdown.name.replace(
                  "{year}",
                  (countdownDate.getFullYear() - (isToday ? 1 : 0)).toString()
                )}`
              : ""}
          </h2>
          <h3
            onClick={() => {
              if (setMenu) {
                setMenu(Menu.DATE);
              }
            }}
          >
            {weekdays[countdownDate.getDay()]},{" "}
            {months[countdownDate.getMonth()]} {countdownDate.getDate()},{" "}
            {countdownDate.getFullYear() - (isToday ? 1 : 0)}{" "}
            {countdown.date.time &&
              `@ ${countdownDate.toLocaleTimeString(undefined, {})}`}
          </h3>
        </header>
        <section className={styles.countdownTickers}>
          <main>{formatForClock(until.d)}</main>
          <div></div>
          <main>{formatForClock(until.h)}</main>
          <div></div>
          <main>{formatForClock(until.m)}</main>
          <div></div>
          <main>{formatForClock(until.s)}</main>
        </section>
      </div>
    </div>
  );
}
