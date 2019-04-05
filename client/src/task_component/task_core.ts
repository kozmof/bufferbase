import { ID, ParentID, Init, Duration, DataType, UnixTimeStamp, TimeStamp } from "./common_type"
import { Meta, MetaData } from "./meta_data"

const uuid = require("uuid/v4");

type Difficulty = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface PlusMinus {
  plus: number;
  minus: number;
}

export class Core implements Meta {
  meta_data: MetaData;
  id: ID;

  constructor(init: Init, parent_id: ParentID, data_type: DataType) {
    if (init.is_first) {
      this.meta_data = new MetaData(parent_id, data_type);
      this.id = this.gen_id();
    } else {
      this.load();
    }
  }

  to_unix_time = (t: TimeStamp): UnixTimeStamp => {
    return Math.round(t.getTime() / 1000)
  }

  to_time = (t: UnixTimeStamp): TimeStamp => {
    return new Date(t * 1000)
  }

  elapsed_time = (start: TimeStamp, pause: TimeStamp): Duration => {
    return this.to_unix_time(pause) - this.to_unix_time(start)
  }

  stom = (seconds: UnixTimeStamp): number => {
    return Math.round(seconds / 60)
  }

  mtoh = (minutes: number): number => {
    return Math.round(minutes / 60)
  }

  htod = (hours: number): number => {
    return Math.round(hours / 24)
  }

  start = () => {
    if (!this.meta_data.running) {
      this.meta_data.time_stamp.started = new Date();
      // update DB
    }
  }

  pause = () => {
    if (this.meta_data.running) {
      this.meta_data.time_stamp.paused = new Date();
      // update DB
    }
  }

  finish = () => {
    if (!this.meta_data.done) {
      this.meta_data.time_stamp.finished = new Date();
    } else {
      // TODO 
      this.meta_data.time_stamp.finished = null;
    }
        // update DB

  }

  load = () => {

  }

  gen_id = (): ID => {
    return uuid()
  }

  // TODO
  load_all_difficulty = (): Array < number > => {
    // Dummy
    return [0, 1, 1, 1, 1, 1, 1]
  }

  level = (dif: Difficulty, debug: boolean = false): DifficultyLevel => {
    let all_difficulty = this.load_all_difficulty();
    all_difficulty.push(5);
    const ssd = this.signed_deviation(all_difficulty);

    if (debug) {
      console.log(`signed standard deviation: ${ssd}`);
    }

    if (10 >= dif && dif > (25 + ssd) / 3) {
      return 6
    } else if ((25 + ssd) / 3 >= dif && dif > (20 - (2 * ssd)) / 3) {
      return 5
    } else if ((20 - (2 * ssd)) / 3 >= dif && dif > 5 + ssd) {
      return 4
    } else if (5 + ssd >= dif && dif > (5 + ssd) * 2 / 3) {
      return 3
    } else if ((5 + ssd) * 2 / 3 >= dif && dif > (5 + ssd) / 3) {
      return 2
    } else if ((5 + ssd) / 3 >= dif && dif >= 0) {
      return 1
    }
  }

  signed_deviation = (nums: Array < number > ): number => {
    if (nums.length <= 1) {
      return 0
    } else {
      const average = nums.reduce((acc, el) => acc + el) / nums.length;

      let acc = 0;
      let pm: PlusMinus = {
        plus: 0,
        minus: 0
      };

      for (let el of nums) {
        if (el - average >= 0) {
          pm.plus += 1;
        } else {
          pm.minus += 1;
        }

        acc += (el - average) ** 2;
      }

      const deviation = (acc / (nums.length - 1)) ** (1 / 2);

      if (pm.plus > pm.minus) {
        return deviation
      } else if (pm.plus < pm.minus) {
        return -deviation
      } else {
        return 0
      }
    }
  }
}

