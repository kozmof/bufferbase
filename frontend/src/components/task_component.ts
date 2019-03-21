type UserID = string;
type ParentID = string;
type ID = string;
type Duration = number;
type Percentage = number;
type DataType = "core" | "atom" | "molecule" | "beaker";
type Difficulty = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6;

type TimeStamp = Date;
type UnixTimeStamp = number;

interface TimeStampData {
    readonly created: TimeStamp;
    started ? : TimeStamp;
    paused ? : TimeStamp;
    finished ? : TimeStamp;
}

interface TimePlan {
    readonly whole_time: Duration;
    readonly buffer: Duration;
}

interface TimeDurationData {
    elapsed: Duration;
    whole_time ? : Duration;
    left ? : Duration;
    buffer ? : Duration;
}

interface Counts {
    numerator: number;
    denominator: number;
}

interface Init {
    readonly is_first: boolean;
    readonly user_id: UserID;
    readonly id ? : ID;
}

class MetaData {
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

interface Meta {
    meta_data: MetaData;
}

class Core implements Meta {
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
        return parseInt((t.getTime() / 1000).toFixed(0))
    }

    to_time = (t: UnixTimeStamp): TimeStamp => {
        return new Date(t * 1000)
    }

    elapsed_time = (start: TimeStamp, pause: TimeStamp): Duration => {
        return this.to_unix_time(pause) - this.to_unix_time(start)
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
        return "dummy"
    }

    // TODO
    load_all_difficulty = (): Array < number > => {
        // Dummy
        return [10, 10, 10, 10, 10, 10, 10]
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
            let acc_diff = 0;

            for (let el of nums) {
                acc_diff += el - average;
                acc += (el - average) ** 2;
            }

            const deviation = (acc / (nums.length - 1)) ** (1 / 2);

            if (acc_diff >= 0) {
                return deviation
            } else {
                return -deviation
            }
        }
    }
}

class Collection < T extends Core > extends Core {
    constructor(init: Init, parent_id: ParentID, data_type: DataType, private time_plan: TimePlan, private container: Array < T > = []) {
        super(init, parent_id, data_type);
        this.meta_data.duration.whole_time = this.time_plan.whole_time;
        this.meta_data.duration.left = this.time_plan.whole_time;
        this.meta_data.duration.buffer = this.time_plan.buffer;
    }

    fresh_rate = (): number => {
        let numerator = 0;
        let denominator = this.container.length;
        for (let el of this.container) {
            numerator += el.meta_data.fresh_rate;
        }

        if (denominator) {
            return Math.round(numerator / denominator)
        } else {
            return 0
        }
    }

    done_percentage = (): Percentage => {
        let numerator = 0;
        let denominator = this.container.length;
        for (let el of this.container) {
            numerator += el.meta_data.done_percentage
        }

        if (denominator) {
            return Math.round((numerator / denominator) * 100);
        } else {
            return 0
        }
    }

    done_counts = (): Counts => {
        let counts = {
            numerator: 0,
            denominator: this.container.length
        }

        for (let el of this.container) {
            if (el.meta_data.done) {
                counts.numerator += 1;
            }
        }

        return counts
    }

    add = (el: T) => {
        this.container.push(el)
    }

    remove = (id: ID) => {
        for (let n = 0; n < this.container.length; n++) {
            if (this.container[n].id === id) {
                this.container.splice(n, 1);
                return
            }
        }
    }

    left = () => {
        let whole_time = this.meta_data.duration.whole_time
        for (let el of this.container) {
            whole_time -= el.meta_data.duration.elapsed;
        }
        this.meta_data.duration.left = whole_time;
    }

    buffer = () => {
        this.meta_data.duration.buffer = this.meta_data.duration.buffer + this.meta_data.duration.left;
    }

}

class Atom extends Core {
    constructor(init: Init, parent_id: ParentID = "", public todo: string = "", public attack: string = "") {
        super(init, parent_id, "atom")
    }

}

class Molecule extends Collection < Atom > {
    constructor(init: Init, parent_id: ParentID = "", public abstract_text: string = "", public attack: string = "", time_plan: TimePlan) {
        super(init, parent_id, "molecule", time_plan);
    }

}

class Beaker extends Collection < Molecule > {
    constructor(init: Init, parent_id: ParentID = "", public title: string = "", public note: string = "", time_plan: TimePlan) {
        super(init, parent_id, "beaker", time_plan);
    }

}

let a = new Atom({
    is_first: true,
    user_id: ""
}, "atom_test_id");

console.log("level");
console.log(a.level(5, true));

let m = new Molecule({
        is_first: true,
        user_id: ""
    }, "molecule_test_id",
    "test_abstract",
    "test_attack", {
        whole_time: 60,
        buffer: 30
    }
);

m.add(a)

let b = new Beaker({
        is_first: true,
        user_id: ""
    }, "beaker_test_id",
    "test_title",
    "test_note", {
        whole_time: 60,
        buffer: 30
    }
);

b.add(m);

console.log(b);

b.remove("dummy");
console.log(b);
