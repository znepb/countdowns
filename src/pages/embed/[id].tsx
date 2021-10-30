import React, { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';
import Head from 'next/head'
import styles from '../../styles/Embed.module.css'
import Counter from '../../components/Counter'
import Confetti from '../../components/Confetti'
import ConfettiWorker from '../../ConfettiWorker'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { Countdown } from '../../types';
import { getDateFromCountdown, eventIsToday } from "../../timeutils";

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
  const [bgImage, setBgImage] = useState("/img/newyears.jpg");
  const [confetti, setConfetti] = useState(new ConfettiWorker([]));
  const [intervalId, setId] = useState(-1);

  const [okay, setOkay] = useState(true);

  let countdown = countdowns[current];

  const images = {};

  useEffect(() => {
    countdown = countdowns[current];
    clearInterval(intervalId);

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

      let id: any = setInterval(tick, 1000)

      setId(id);
    } else {
      setOkay(false);
    }
  }, [])

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
        placeholder="empty"
        loading="eager"
        priority={true}>
    </Image>

    <div className={styles.main}>
      <div className={styles.container}>
        {okay ? <>
          <section className={styles.counter}><Counter countdown={countdown} time={time} use24hour={use24hr}></Counter></section>
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