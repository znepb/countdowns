import styles from "../styles/Create.module.scss";
import Countdown from "../components/countdown";
import menustyles from "../styles/Menu.module.scss";
import { useState } from "react";
import { useRouter } from "next/router";
import { Check, HelpCircle, ImagePlus, Moon, X } from "lucide-react";
import { Countdown as CountdownType } from "../types";
import Link from "next/link";

export enum Menu {
  NONE,
  HELP,
  DATE,
  TITLE,
  IMAGE,
}

export default function Countdowns({ setMenuVisible }: any) {
  const router = useRouter();
  const [countdown, setCountdown] = useState<CountdownType>({
    name: "New Countdown",
    useDark: true,
    popoutOffset: 0,
    date: {
      month: 1,
      day: 1,
      useLocalOffset: true,
    },
  });

  const [name, setName] = useState<string>("New Countdown");
  const [useDark, setUseDark] = useState<boolean>(true);
  const [date, setDate] = useState<CountdownType["date"]>({
    month: 1,
    day: 1,
    useLocalOffset: true,
  });
  const [backgroundImage, setBackgroundImage] = useState<string>();

  const [tempName, setTempName] = useState<string>(name);

  const [tempDay, setTempDay] = useState<number | undefined>(date.month);
  const [tempMonth, setTempMonth] = useState<number | undefined>(date.day);
  const [tempYear, setTempYear] = useState<number | undefined>(date.year);

  const [tempMinute, setTempMinute] = useState<number | undefined>(
    date.time?.hour
  );
  const [tempHour, setTempHour] = useState<number | undefined>(
    date.time?.minute
  );

  const [tempImage, setTempImage] = useState<string | undefined>(
    backgroundImage
  );

  const [menu, setMenu] = useState<Menu>(Menu.NONE);

  return (
    <>
      {menu == Menu.HELP && (
        <div className={menustyles.menuWrapper}>
          <main className={menustyles.menu} style={{ width: "26rem" }}>
            <h2>
              <div>Help</div>
              <div
                onClick={() => {
                  setMenu(Menu.NONE);
                }}
                style={{ cursor: "pointer" }}
              >
                <X />
              </div>
            </h2>

            <div className={menustyles.countdownsList}>
              <b>Navigation</b>
              <div className={styles.iconAbout}>
                <X /> <span>Cancel creating this countdown and go back</span>
              </div>
              <div className={styles.iconAbout}>
                <Moon /> <span>Toggle between dark and light text</span>
              </div>
              <div className={styles.iconAbout}>
                <ImagePlus />{" "}
                <span>
                  Choose an image for the background. This will open a prompt
                  where you can enter a URL of an image.
                </span>
              </div>
              <div className={styles.iconAbout}>
                <Check />
                <span>Complete this countdown, and add it to your list.</span>
              </div>
              <br />
              <b>Changing Title</b>
              <div>
                To change the title of your countdown, simply click on the
                current title text and enter in a new name. The string{" "}
                <code>&#123;year&#125;</code> will be replaced with the year the
                countdown will end.
              </div>
              <br />
              <b>Changing Date &amp; Time</b>
              <div>
                Click on the date and time underneath the title, and you will be
                given a prompt to choose a date, and optionally, a time. If you
                don&apos;t type in a year, the event will occur annually, but if
                you do type in a year it will only occur once, and after the
                date has passed, the countdown will stay on zero until the
                countdown is removed.
              </div>
              <br />
              <div>
                <b>Notice:</b> Once you make your countdown, you won&apos;t be
                able to change it, so make it good!
              </div>
              <br />
              <div>
                If you&apos;ve found a bug please report it on Github, or if you
                have any questions DM me on Discord. (You can find that info in
                the contact section of my website)
              </div>
            </div>
          </main>
        </div>
      )}

      {menu == Menu.TITLE && (
        <div className={menustyles.menuWrapper}>
          <main className={menustyles.menu} style={{ width: "26rem" }}>
            <h2>
              <div>Modify Title</div>
              <div
                onClick={() => {
                  setMenu(Menu.NONE);
                }}
                style={{ cursor: "pointer" }}
              >
                <X />
              </div>
            </h2>

            <div
              className={menustyles.countdownsList}
              style={{ gap: "0.5rem" }}
            >
              <input
                placeholder="Title"
                value={tempName}
                className={styles.input}
                onChange={(e) => {
                  setTempName(e.target.value);
                }}
              />
              <div className={styles.buttons}>
                <button
                  className={styles.button}
                  onClick={() => {
                    setName(tempName);
                    setMenu(Menu.NONE);
                  }}
                >
                  Set
                </button>
                <button
                  className={styles.button}
                  onClick={() => {
                    setTempName(name);
                    setMenu(Menu.NONE);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </main>
        </div>
      )}

      {menu == Menu.DATE && (
        <div className={menustyles.menuWrapper}>
          <main className={menustyles.menu} style={{ width: "26rem" }}>
            <h2>
              <div>Modify Date</div>
              <div
                onClick={() => {
                  setMenu(Menu.NONE);
                }}
                style={{ cursor: "pointer" }}
              >
                <X />
              </div>
            </h2>

            <div
              className={menustyles.countdownsList}
              style={{ gap: "0.5rem" }}
            >
              <div className={styles.buttons}>
                <input
                  placeholder="DD"
                  type="number"
                  value={tempDay}
                  className={styles.input}
                  min={1}
                  max={31}
                  onChange={(e) => {
                    setTempDay(Number(e.target.value) || undefined);
                  }}
                />
                <input
                  placeholder="MM"
                  type="number"
                  value={tempMonth}
                  className={styles.input}
                  min={1}
                  max={12}
                  onChange={(e) => {
                    setTempMonth(Number(e.target.value) || undefined);
                  }}
                />
                <input
                  placeholder="YYYY"
                  type="number"
                  value={tempYear}
                  className={styles.input}
                  onChange={(e) => {
                    setTempYear(Number(e.target.value) || undefined);
                  }}
                />
              </div>

              <div className={styles.buttons}>
                <input
                  placeholder="HH"
                  type="number"
                  value={tempHour}
                  className={styles.input}
                  min={0}
                  max={23}
                  onChange={(e) => {
                    setTempHour(Number(e.target.value) || undefined);
                  }}
                />
                <input
                  placeholder="MM"
                  type="number"
                  value={tempMinute}
                  className={styles.input}
                  min={0}
                  max={59}
                  onChange={(e) => {
                    setTempMinute(Number(e.target.value) || undefined);
                  }}
                />
              </div>

              <div className={styles.buttons}>
                <button
                  className={styles.button}
                  onClick={() => {
                    const date: CountdownType["date"] = {
                      day: tempDay || 1,
                      month: tempMonth || 1,
                      year: tempYear,
                      useLocalOffset: true,
                    };

                    if (tempDay && tempHour) {
                      date.time = {
                        hour: tempHour || 0,
                        minute: tempMinute || 0,
                        second: 0,
                        timezone: String(new Date().getTimezoneOffset()),
                      };
                    }

                    setDate(date);
                    setMenu(Menu.NONE);
                  }}
                >
                  Set
                </button>
                <button
                  className={styles.button}
                  onClick={() => {
                    setTempDay(date.day);
                    setTempHour(date.time?.hour);
                    setTempMinute(date.time?.minute);
                    setTempMonth(date.month);
                    setTempYear(date.year);
                    setMenu(Menu.NONE);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </main>
        </div>
      )}

      {menu == Menu.IMAGE && (
        <div className={menustyles.menuWrapper}>
          <main className={menustyles.menu} style={{ width: "26rem" }}>
            <h2>
              <div>Modify Background Image</div>
              <div
                onClick={() => {
                  setMenu(Menu.NONE);
                }}
                style={{ cursor: "pointer" }}
              >
                <X />
              </div>
            </h2>

            <input
              placeholder="Some image URL"
              value={tempImage}
              className={styles.input}
              onChange={(e) => {
                setTempImage(e.target.value || undefined);
              }}
            />

            <div className={styles.buttons}>
              <button
                className={styles.button}
                onClick={() => {
                  setBackgroundImage(tempImage);
                  setMenu(Menu.NONE);
                }}
              >
                Set
              </button>
              <button
                className={styles.button}
                onClick={() => {
                  setTempImage(backgroundImage);
                  setMenu(Menu.NONE);
                }}
              >
                Cancel
              </button>
            </div>
          </main>
        </div>
      )}

      <main
        className={styles.main}
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      ></main>
      <main
        className={styles.container}
        style={{
          color: countdown.useDark ? "black" : "white",
        }}
      >
        <div className="navi" style={{ color: useDark ? "black" : "white" }}>
          <div>
            <Link href="/0">
              <X size={48} />
            </Link>
          </div>
          <div
            onClick={() => {
              setUseDark(!useDark);
            }}
          >
            <Moon size={48} />
          </div>
          <div
            onClick={() => {
              setMenu(Menu.HELP);
            }}
          >
            <HelpCircle size={48} />
          </div>
          <div
            onClick={() => {
              setMenu(Menu.IMAGE);
            }}
          >
            <ImagePlus size={48} />
          </div>
          <div>
            <Check
              onClick={() => {
                const items: any = localStorage.getItem(
                  "znepb-countdowns-custom"
                );
                console.log(items);

                let newCountdowns: CountdownType[] = [];

                if (items !== null && typeof items == "string") {
                  newCountdowns = [...JSON.parse(items)];
                }

                let obj = newCountdowns.push({
                  name,
                  backgroundImage,
                  useDark,
                  popoutOffset: 0,
                  date,
                });

                localStorage.setItem(
                  "znepb-countdowns-custom",
                  JSON.stringify(newCountdowns)
                );

                router.push(`/custom-${obj - 1}`);
              }}
              size={48}
            />
          </div>
        </div>
        <div>
          <Countdown
            countdown={{
              name: name || "",
              useDark,
              popoutOffset: 0,
              date,
            }}
            setMenu={setMenu}
          />
        </div>
        <div
          style={{ textAlign: "center", color: useDark ? "black" : "white" }}
        >
          {" "}
        </div>
      </main>
    </>
  );
}
