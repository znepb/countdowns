import React, { useState, useEffect } from "react";
import fs from "fs";
import path from "path";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Counter from "../components/Counter";
import Confetti from "../components/Confetti";
import ConfettiWorker from "../ConfettiWorker";
import { useRouter } from "next/router";
import Image from "next/image";

import countdowns from "../../public/countdowns.json";

import { Countdown } from "../types";
import { getDateFromCountdown, eventIsToday } from "../timeutils";

interface CountdownsProps {
  countdowns: Countdown[];
  id: number;
}

const Home = (props: CountdownsProps) => {
  const countdowns = props.countdowns;
  const router = useRouter();

  const [current, setCurrent] = useState(Number(props.id));
  const [time, setTime] = useState(Date.now());
  const [use24hr, set24hr] = useState(false);

  const [bgImage, setBgImage] = useState(
    `/img/${countdowns[current].backgroundImage}`
  );
  const [usingDark, setDark] = useState(false);
  const [attribute, setAttribute] = useState("");
  const [confetti, setConfetti] = useState(new ConfettiWorker([]));

  const [popupVisible, setPopupVisible] = useState(false);

  const [okay, setOkay] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<Countdown>(countdowns[current]);
  const [currentDateFromCountdown, setDateFromCountdown] = useState<Date>();

  const [preloadImages, setPreloadImages] = useState(countdowns);

  useEffect(() => {
    setCountdown(countdowns[current]);

    router.push("/" + current, undefined, { shallow: true });
  }, [current]);

  useEffect(() => {
    if (countdown) {
      setOkay(true);

      setBgImage("/img/" + countdowns[current].backgroundImage);
      setDark(countdowns[current].useDark);
      setAttribute(countdowns[current].imageAttribution);
      setDateFromCountdown(
        getDateFromCountdown(countdown, new Date(Date.now()))
      );
    } else {
      setOkay(false);
    }
  }, [countdown]);

  useEffect(() => {
    console.log(countdowns);
    setPreloadImages(countdowns);
  }, [countdowns]);

  return (
    <>
      <Head>
        <title>
          {countdown
            ? `${countdown.name.replace(
                "{year}",
                currentDateFromCountdown?.getFullYear() === undefined
                  ? ""
                  : String(currentDateFromCountdown?.getFullYear())
              )} - `
            : ""}
          Countdowns
        </title>
      </Head>

      <Confetti confetti={confetti}></Confetti>

      {/* hacky way to preload images */}
      <div className={styles.imagePreload}>
        {preloadImages.map((countdown, idx) => (
          <Image
            key={idx}
            className={styles.image}
            src={"/img/" + countdown.backgroundImage}
            layout="fill"
            objectFit="cover"
            quality={1}
            placeholder="empty"
            loading="eager"
            priority={true}
          />
        ))}
      </div>

      <Image
        className={styles.image}
        src={bgImage}
        layout="fill"
        objectFit="cover"
        quality={1}
        placeholder="empty"
        loading="eager"
        priority={true}
      ></Image>

      {/* Navigation */}
      <div className={styles.main}>
        <div className={styles.container}>
          {okay ? (
            <>
              {/* Large Screen Navigation Left */}
              <section className={styles.last}>
                <img
                  onClick={() => {
                    if (current > 0) {
                      setCurrent(Number(current) - 1);
                    }
                  }}
                  style={{ display: current == 0 ? "none" : "block" }}
                  className={`${styles.icon} ${
                    usingDark ? undefined : styles.icoInvert
                  }`}
                  src="/icons/chevron-left.svg"
                />
              </section>

              {/* Main Interest */}
              <section className={styles.center}>
                {/* Top (mobile navigations, menu) */}
                <section className={styles.select}>
                  {/* Mobile Navigation Left */}
                  <img
                    onClick={() => {
                      if (current > 0) {
                        setCurrent(Number(current) - 1);
                      }
                    }}
                    style={{
                      opacity: current == 0 ? 0 : 1,
                      pointerEvents: current != 0 ? "auto" : "none",
                    }}
                    className={`${styles.naviSecondary} ${styles.iconTop} ${
                      usingDark ? undefined : styles.icoInvert
                    }`}
                    src="/icons/chevron-left.svg"
                  />

                  {/* Menu Button */}
                  <img
                    onClick={() => {
                      setPopupVisible(true);
                    }}
                    className={`${styles.iconTop} ${
                      usingDark ? undefined : styles.icoInvert
                    }`}
                    src="/icons/menu.svg"
                  />

                  {/* Mobile Navigation Right */}
                  <img
                    onClick={() => {
                      if (current < countdowns.length - 1) {
                        setCurrent(Number(current) + 1);
                      }
                    }}
                    style={{
                      opacity: current < countdowns.length - 1 ? 1 : 0,
                      pointerEvents:
                        current < countdowns.length - 1 ? "auto" : "none",
                    }}
                    className={`${styles.naviSecondary} ${styles.iconTop} ${
                      usingDark ? undefined : styles.icoInvert
                    }`}
                    src="/icons/chevron-right.svg"
                  />
                </section>

                {/* Counter */}
                <section className={styles.counter}>
                  <Counter
                    countdown={countdown}
                    use24hour={use24hr}
                    confetti={confetti}
                  />
                </section>

                {/* Footer */}
                <section
                  className={`${styles.attr} ${
                    usingDark ? undefined : styles.white
                  }`}
                >
                  <section className={styles.attributeText}>
                    {attribute}
                  </section>
                  <a href="https://znepb.me">
                    <img
                      src={usingDark ? "/znepb/dark.svg" : "/znepb/light.svg"}
                      height="37px"
                    />
                  </a>
                </section>
              </section>

              {/* Large Screen Navigation Right */}
              <section className={styles.next}>
                <img
                  onClick={() => {
                    if (countdowns[current + 1]) {
                      setCurrent(Number(current) + 1);
                    }
                  }}
                  style={{
                    display:
                      current == countdowns.length - 1 ? "none" : "block",
                  }}
                  className={`${styles.icon} ${
                    usingDark ? undefined : styles.icoInvert
                  }`}
                  src="/icons/chevron-right.svg"
                />
              </section>
            </>
          ) : (
            <>Well, something happened that wasn&apos;t supposed to...</>
          )}
        </div>
      </div>

      {/* Popup */}
      <div
        className={styles.popupContainer}
        style={{ display: popupVisible ? "flex" : "none" }}
      >
        <div className={styles.popup}>
          <section className={styles.popupHeader}>
            <span>Countdowns</span>{" "}
            <span
              style={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => {
                setPopupVisible(false);
              }}
            >
              &times;
            </span>
          </section>
          <section>
            <div className={styles.pages}>
              {/*<div
                onClick={() => {
                  setPopupVisible(false);
                }}
                className={styles.page}
                style={{
                  background: "#111",
                }}
              >
                <span style={{ color: "white" }}>Custom</span>
              </div>*/}
              {countdowns.map((item, index) => {
                const date = getDateFromCountdown(item, new Date());

                if (eventIsToday(item, new Date(), date)) {
                  if (!item.date.year) {
                    date.setFullYear(date.getFullYear() - 1);
                  }
                }

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setCurrent(index);
                      setPopupVisible(false);
                    }}
                    className={styles.page}
                    style={{
                      backgroundImage: `url("/_next/image?url=%2Fimg%2F${item.backgroundImage}&w=640&q=75")`,
                      backgroundPositionY: -item.popoutOffset,
                    }}
                  >
                    <span
                      style={{ color: !item.useDark ? "white" : undefined }}
                    >
                      {item.name.replace(
                        /{year}/g,
                        date.getFullYear().toString()
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
          <section className={styles.popupFooter}>
            <div className={styles.github}>
              <a className="blue" href={`/e/${current}`}>
                Embed Version
              </a>
            </div>
            <div className={styles.github}>
              <span>Copyright © znepb 2022</span>
            </div>
            <div className={styles.znepbme}>
              <a href="https://znepb.me/">Home</a>
              <span>•</span>
              <a href="https://lens.znepb.me/">Lens</a>
              <span>•</span>
              <a href="https://analytics.znepb.me/">Analytics</a>
              <span>•</span>
              <span className={styles.selected}>Countdowns</span>
              <span>•</span>
              <a href="https://files.znepb.me/">Files</a>
            </div>
            <div className={styles.github}>
              <a className="blue" href="https://github.com/znepb/countdowns">
                Check this out on GitHub
              </a>
              <span> • v4.6.1</span>
            </div>
            <div className={styles.logo}>
              <a href="https://znepb.me">
                <img src="/znepb/light.svg" height="28px" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export async function getStaticPaths() {
  const paths = countdowns.map((countdown: Countdown, index: number) => ({
    params: { id: index.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps = async (context: any) => {
  return {
    props: {
      countdowns: countdowns,
      id: context.params.id,
    },
  };
};

export default Home;
