import { Percentage, Counts, TimeStamp, Duration, ParentID, DataType } from "./common_type"

interface TimeStampData {
  readonly created: TimeStamp;
  started ? : TimeStamp;
  paused ? : TimeStamp;
  finished ? : TimeStamp;
}

interface TimeDurationData {
  elapsed: Duration;
  whole_time ? : Duration;
  left ? : Duration;
  buffer ? : Duration;
}

export class MetaData {
  time_stamp: TimeStampData;
  duration: TimeDurationData;
  category: string[];

  touched: boolean;
  running: boolean;
  paused: boolean;
  done: boolean;

  fresh_rate: number;
  difficulty: number;
  done_percentage: Percentage;
  done_counts: Counts;

  constructor(public parent_id: ParentID, public data_type: DataType) {
    this.time_stamp = {
      created: new Date()
    }

    this.duration = {
      elapsed: 0
    }

    this.category = [];
    this.touched = false;
    this.running = false;
    this.paused = false;
    this.done = false;
    this.fresh_rate = 0;
    this.difficulty = 0;
    this.done_percentage = 0;
    this.done_counts = {
      denominator: 0,
      numerator: 0
    };

  }
}

export interface Meta {
  meta_data: MetaData;
}

