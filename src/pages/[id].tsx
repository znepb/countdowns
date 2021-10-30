import React, { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Counter from '../components/Counter'
import Confetti from '../components/Confetti'
import ConfettiWorker from '../ConfettiWorker'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { Countdown } from '../types';
import { getDateFromCountdown, eventIsToday } from "../timeutils";
import { Router } from 'next/dist/client/router';

interface CountdownsProps {
  countdowns: Countdown[];
  id: number;
}

const myLoader = ({ src, width, quality }: any) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}

const Home = (props: CountdownsProps) => {
  const countdowns = props.countdowns;
  const router = useRouter()

  const [current, setCurrent] = useState(props.id);
  const [time, setTime] = useState(Date.now());
  const [use24hr, set24hr] = useState(false);

  const [text, setText] = useState("");
  const [bgImage, setBgImage] = useState("/img/newyears.jpg");
  const [usingDark, setDark] = useState(false);
  const [attribute, setAttribute] = useState("");
  const [confetti, setConfetti] = useState(new ConfettiWorker([]));
  const [intervalId, setId] = useState(-1);

  const [okay, setOkay] = useState(true);

  let interval: any;
  let countdown = countdowns[current];

  const images = {};

  useEffect(() => {
    countdown = countdowns[current];
    clearInterval(intervalId);

    router.push("/" + current, undefined, { shallow: true });

    function tick() {
      const now = Date.now();
      setTime(now);

      const date = getDateFromCountdown(countdown, new Date());

      if(eventIsToday(countdown, new Date(), date)) {
        confetti.startAnimation();
        if(!countdown.date.year) { date.setFullYear(date.getFullYear() - 1) }
      } else {
        confetti.pauseAnimation();
      }

      setText(countdown.name.replace(/{year}/g, date.getFullYear().toString()));
    }

    if(countdown) {
      tick();

      setOkay(true)

      setBgImage("/img/" + countdown.backgroundImage);
      setDark(countdown.useDark);
      setAttribute(countdown.imageAttribution);

      let id: any = setInterval(tick, 1000)

      setId(id);
    } else {
      setOkay(false);
    }
  }, [current])

  return <>
    <Head>
      <title>{text} - Countdowns</title>
    </Head>
    
    <Confetti confetti={confetti}></Confetti>
    
    <Image 
        className={styles.image} 
        src={bgImage} layout="fill"
        objectFit="cover"
        quality={1}
        placeholder="empty">
    </Image>

    <div className={styles.main}>
      <div className={styles.container}>
        {okay ? <>
          <section className={styles.last}><img onClick={() => { setCurrent(Number(current) - 1) }} style={{ display: current == 0 ? "none" : "block" }} className={`${styles.icon} ${usingDark ? undefined : styles.icoInvert}`} src="/icons/chevron-left.svg" /></section>
          <section className={styles.center}>
            <section className={styles.select}>
              <img onClick={() => { setCurrent(Number(current) - 1) }} style={{ opacity: current == 0 ? 0 : 1, pointerEvents: current == 0 ? "auto" : "none" }} className={`${styles.naviSecondary} ${styles.iconTop} ${usingDark ? undefined : styles.icoInvert}`} src="/icons/chevron-left.svg" />
              <img className={`${styles.iconTop} ${usingDark ? undefined : styles.icoInvert}`} src="/icons/menu.svg" />
              <img onClick={() => { setCurrent(Number(current) + 1) }} style={{ opacity: current == countdowns.length - 1 ? 0 : 1, pointerEvents: countdowns.length - 1 ? "auto" : "none" }} className={`${styles.naviSecondary} ${styles.iconTop} ${usingDark ? undefined : styles.icoInvert}`} src="/icons/chevron-right.svg" />
            </section>

            <section className={styles.counter}><Counter countdown={countdown} time={time} use24hour={use24hr}></Counter></section>
            <section className={`${styles.attr} ${usingDark ? undefined : styles.white}`}>
              <section className={styles.attributeText}>{attribute}</section>
              <img src={usingDark ? "/znepb/dark.svg" : "/znepb/light.svg"} />
            </section>
          </section>
          <section className={styles.next}><img onClick={() => { setCurrent(Number(current) + 1) }} style={{ display: current == countdowns.length - 1 ? "none" : "block" }} className={`${styles.icon} ${usingDark ? undefined : styles.icoInvert}`} src="/icons/chevron-right.svg" /></section>
        </> : <>
          Well, something happened that wasn&apos;t supposed to...
        </>}
      </div>
    </div>
    
  </>
}

export async function getStaticPaths() {
  const countdowns = JSON.parse(fs.readFileSync(path.resolve('./', 'src', 'dates.json')).toString("utf-8"));

  const paths = countdowns.map((countdown: Countdown, index: number) => ({
    params: { id: index.toString() },
  }))

  return {
    paths,
    fallback: false
  };
}

export const getStaticProps = async (context: any) => {
  const countdowns = JSON.parse(fs.readFileSync(path.resolve('./', 'src', 'dates.json')).toString("utf-8"));

  return {
    props: {
      countdowns: countdowns,
      id: context.params.id
    }
  }
}

export default Home