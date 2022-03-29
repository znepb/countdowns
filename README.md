# Countdowns
A website that shows some countdowns to somewhat important dates. 
Check it out at https://countdowns.znepb.me.

## Countdown Format

Below is the JSON format used for countdowns. Countdowns are stored in `/public/countdowns.json`.

```js
{
  name: string, // The name that appears for the countdown name. {year} is a placeholder for the year of the event.
  backgroundImage: string, // A URL for the background image.
  imageAttribution: string, // Attribution for an image that appears at the bottom.
  useDark: boolean, // Inverts colors of the UI. If set to true, text will be black.
  popoutOffset: number, // Percentage of vertical offset for button in countdown selection popout.
  date: {
    month: number, // Self-explanatory
    day: number, // Self-explanatory
    year?: number, // Not required, but if entered, this countdown will happen once, and then it will never start counting after the event date is over.
    useLocalOffset: boolean, // Self-explanatory
    time?: { // Optional time. Default time is midnight local time.
      hour: number, // Self-explanatory
      minute: number, // Self-explanatory
      second: number, // Self-explanatory
    }
  }
}
```