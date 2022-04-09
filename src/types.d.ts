interface Countdown {
  name: string;
  backgroundImage?: string;
  imageAttribution?: string;
  useDark: boolean;
  popoutOffset: number;
  date: {
    month: number;
    day: number;
    year?: number;
    useLocalOffset: boolean;
    time?: {
      hour: number;
      minute: number;
      second: number;
      timezone: string;
    };
  };
}

interface DateTimeDict {
  d: number;
  h: number;
  m: number;
  s: number;
}

export type { Countdown, DateTimeDict };
