import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Countdown from "../components/countdown";
import countdowns from "../../public/countdowns.json";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Countdown as CountdownType } from "../types";
import { getCustomCountdowns } from "../LocalData";

export default function Countdowns({ setMenuVisible }: any) {
  const router = useRouter();
  const [countdown, setCountdown] = useState<CountdownType>();
  const [countdownIndex, setCountdownIndex] = useState<any[]>([
    ...countdowns,
    ...getCustomCountdowns(),
  ]);
  const [currentInIndex, setCurrentInIndex] = useState<any>(0);

  useEffect(() => {
    if (router.query.id && typeof router.query.id === "string") {
      if (router.query.id.startsWith("c-")) {
        setCurrentInIndex(
          Number(router.query.id.replaceAll("c-", "")) + countdowns.length
        );
      } else if (Number(router.query.id) !== NaN) {
        setCurrentInIndex(Number(router.query.id));
      } else {
        console.warn("Invalid countdown");
      }
    }
  }, [router]);

  useEffect(() => {
    setCountdown(countdownIndex[currentInIndex]);

    router.push(
      currentInIndex >= countdowns.length
        ? `/c-${currentInIndex - countdowns.length}`
        : `/${currentInIndex}`,
      undefined,
      {
        shallow: true,
      }
    );
  }, [currentInIndex]);

  if (countdown) {
    return (
      <>
        <main
          className={styles.main}
          style={{
            backgroundImage: `url(${countdown.backgroundImage})`,
          }}
        ></main>
        <main
          className={styles.container}
          style={{
            color: countdown.useDark ? "black" : "white",
          }}
        >
          <div className="navi">
            <div
              onClick={() => {
                if (countdownIndex[currentInIndex - 1]) {
                  setCurrentInIndex(currentInIndex - 1);
                }
              }}
              style={{
                opacity: countdownIndex[currentInIndex - 1] ? 1 : 0,
                cursor: countdownIndex[currentInIndex - 1]
                  ? "pointer"
                  : "initial",
              }}
            >
              <ChevronLeft size={48} />
            </div>
            <div
              onClick={() => {
                setMenuVisible(true);
              }}
            >
              <Menu size={48} />
            </div>
            <div
              onClick={() => {
                if (countdownIndex[currentInIndex + 1]) {
                  setCurrentInIndex(currentInIndex + 1);
                }
              }}
              style={{
                opacity: countdownIndex[currentInIndex + 1] ? 1 : 0,
                cursor: countdownIndex[currentInIndex + 1]
                  ? "pointer"
                  : "initial",
              }}
            >
              <ChevronRight size={48} />
            </div>
          </div>
          <div>
            <Countdown countdown={countdown} />
          </div>
          <div style={{ textAlign: "center" }}>
            {countdown.imageAttribution && (
              <>Image Attribution: {countdown.imageAttribution}</>
            )}
            <div>
              <b>
                NOTICE - Countdowns v5 is currently still in development.
                Current features are not final and are subject to change.
              </b>
              <br />
              If you find any bugs, please report them to me via Discord. You
              can find my profile on my main website, znepb.me.
            </div>
          </div>
        </main>
      </>
    );
  } else {
    return (
      <>
        Looks like this countdown doesn&apos;t exist.{" "}
        <button
          onClick={() => {
            setCurrentInIndex(0);
          }}
        >
          Reset
        </button>
      </>
    );
  }
}
