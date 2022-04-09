import "../styles/globals.scss";
import styles from "../styles/Menu.module.scss";
import type { AppProps } from "next/app";
import { useState } from "react";
import countdowns from "../../public/countdowns.json";
import { Countdown } from "../types";
import { ChevronLeft, Plus, X } from "lucide-react";
import { eventIsToday, getDateFromCountdown } from "../timeutils";
import Link from "next/link";
import { getCustomCountdowns } from "../LocalData";
import { useRouter } from "next/router";
import changelog from "../changelog.json";
import TimeAgo from "react-timeago";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [changelogVisible, setChangelogVisible] = useState(false);

  return (
    <>
      {menuVisible === true && (
        <>
          {!changelogVisible ? (
            <div className={styles.menuWrapper}>
              <main className={styles.menu}>
                <h2>
                  <div>Countdowns</div>
                  <div
                    onClick={() => {
                      setMenuVisible(false);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <X />
                  </div>
                </h2>

                <div className={styles.countdownsList}>
                  {countdowns.map((countdown: Countdown, id) => (
                    <Link href={`/${id}`}>
                      <div
                        className={styles.countdown}
                        key={countdown.name}
                        style={{
                          backgroundPosition: `${countdown.popoutOffset}%`,
                          backgroundImage: `url(${countdown.backgroundImage}`,
                          color: countdown.useDark ? "black" : "white",
                        }}
                        onClick={() => {
                          setMenuVisible(false);
                        }}
                      >
                        {countdown.name.replace(
                          "{year}",
                          countdown.date.year
                            ? String(countdown.date.year)
                            : getDateFromCountdown(countdown, new Date())
                                .getFullYear()
                                .toString()
                        )}
                      </div>
                    </Link>
                  ))}
                  {typeof window != "undefined" &&
                    getCustomCountdowns().map(
                      (countdown: Countdown, id: number) => (
                        <Link href={`/c-${id}`}>
                          <div
                            className={styles.countdown}
                            key={countdown.name}
                            style={{
                              backgroundPosition: `${countdown.popoutOffset}%`,
                              background: countdown.backgroundImage
                                ? `url(${countdown.backgroundImage})`
                                : "white",
                              color: countdown.useDark ? "black" : "white",
                            }}
                            onClick={() => {
                              setMenuVisible(false);
                            }}
                          >
                            <span>
                              {countdown.name.replace(
                                "{year}",
                                countdown.date.year
                                  ? String(countdown.date.year)
                                  : getDateFromCountdown(countdown, new Date())
                                      .getFullYear()
                                      .toString()
                              )}
                            </span>
                            <span
                              className={styles.delete}
                              onClick={() => {
                                const data = [...getCustomCountdowns()];
                                data.splice(id);
                                localStorage.setItem(
                                  "znepb-countdowns-custom",
                                  JSON.stringify(data)
                                );
                                window.location.reload();
                              }}
                            >
                              <Link href={router.asPath}>
                                <X height={20} width={20} z={1000}></X>
                              </Link>
                            </span>
                          </div>
                        </Link>
                      )
                    )}
                  <Link href="/create">
                    <div
                      onClick={() => {
                        setMenuVisible(false);
                      }}
                      className={`${styles.countdown} ${styles.countdownCustom}`}
                    >
                      <Plus />
                    </div>
                  </Link>
                </div>

                <div className={styles.info}>
                  <a
                    onClick={() => {
                      setChangelogVisible(true);
                    }}
                  >
                    Changelog
                  </a>
                  <span>Copyright © znepb 2022</span>
                  <div className={styles.znepbmeNav}>
                    <a>
                      <Link href="https://znepb.me/">Home</Link>
                    </a>
                    <i>·</i>
                    <a>
                      <Link href="https://lens.znepb.me/">Lens</Link>
                    </a>
                    <i>·</i>
                    <b className={styles.changelogTitle}>Countdowns</b>
                    <i>·</i>
                    <a>
                      <Link href="https://files.znepb.me/">Files</Link>
                    </a>
                  </div>
                  <div>
                    <Link href="https://github.com/znepb/countdowns">
                      <a>Check this out on Github</a>
                    </Link>
                    {" · "}
                    <span>v{changelog[0].version.join(".")}</span>
                  </div>
                  <img
                    src="/light.svg"
                    width={180}
                    style={{
                      marginTop: "0.5rem",
                    }}
                  />
                </div>
              </main>
            </div>
          ) : (
            <div className={styles.menuWrapper}>
              <main className={styles.menu}>
                <h2>
                  <div className={styles.changelogTitleTop}>
                    <span
                      onClick={() => {
                        setChangelogVisible(false);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <ChevronLeft />
                    </span>
                    Changelog
                  </div>
                  <div
                    onClick={() => {
                      setMenuVisible(false);
                      setChangelogVisible(false);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <X />
                  </div>
                </h2>

                <div className={styles.countdownsList}>
                  {changelog.map((o) => (
                    <section>
                      <div className={styles.changelogTitle}>
                        <b>{o.version.join(".")}</b>
                        {" · "}
                        <span>
                          {o.date} {o.rc && `Release Canidate ${o.rc}`}
                        </span>
                        {" · "}
                        <i>
                          <TimeAgo
                            date={new Date(
                              `${o.date} ${o.time || ""}`
                            ).toISOString()}
                          />
                        </i>
                      </div>
                      <main>
                        {o.notes.map((note, i) => (
                          <li key={i}>{note}</li>
                        ))}
                      </main>
                    </section>
                  ))}
                </div>
              </main>
            </div>
          )}
        </>
      )}
      <Component setMenuVisible={setMenuVisible} {...pageProps} />
    </>
  );
}

export default MyApp;
