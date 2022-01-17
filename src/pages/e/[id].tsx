import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../../styles/Embed.module.css";
import Counter from "../../components/Counter";
import Confetti from "../../components/Confetti";
import ConfettiWorker from "../../ConfettiWorker";
import Image from "next/image";

import { Countdown } from "../../types";
import { getDateFromCountdown, eventIsToday } from "../../timeutils";

import countdowns from "../../../public/countdowns.json";

interface CountdownsProps {
  countdowns: Countdown[];
  id: number;
}

const Home = (props: CountdownsProps) => {
  const countdowns = props.countdowns;

  const [current, setCurrent] = useState(props.id);
  const [time, setTime] = useState(Date.now());
  const [use24hr, set24hr] = useState(false);

  const [text, setText] = useState("");
  const [bgImage, setBgImage] = useState(
    "/img/" + countdowns[props.id].backgroundImage
  );
  const [confetti, setConfetti] = useState(new ConfettiWorker([]));
  const [intervalId, setId] = useState(-1);

  const [okay, setOkay] = useState(true);

  let countdown = countdowns[current];

  useEffect(() => {
    countdown = countdowns[current];
  }, []);

  return (
    <>
      <Head>
        <title>
          {text}
          {text.length == 0 ? "" : " - "}Countdowns
        </title>
      </Head>

      <Confetti confetti={confetti}></Confetti>

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

      <div className={styles.main}>
        <div className={styles.container}>
          {okay ? (
            <>
              <section className={styles.counter}>
                <Counter
                  countdown={countdown}
                  confetti={confetti}
                  use24hour={use24hr}
                ></Counter>
              </section>
            </>
          ) : (
            <>Well, something happened that wasn&apos;t supposed to...</>
          )}
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
