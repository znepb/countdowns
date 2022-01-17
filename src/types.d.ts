interface Countdown {
  name: string;
  backgroundImage: string;
  imageAttribution: string;
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
    };
  };
}

export type { Countdown };
