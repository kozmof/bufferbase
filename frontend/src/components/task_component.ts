type UserID = string;
type ParentID = string;
type ID = string;
type Duration = number;
type Difficulty = number;
type Percentage = number;

type TimeStamp = Date;
type UnixTimeStamp = number;

interface TimeStampData {
    readonly created: TimeStamp;
    started ? : TimeStamp;
    paused ? : TimeStamp;
    finished ? : TimeStamp;
}

interface TimeDurationData {
    consumed: Duration;
    last ? : Duration;
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
    running: boolean;
    done: boolean;

    fresh_rate: number;
    done_percentage: Percentage;
    done_counts: Counts;

    constructor(public parent_id: ParentID = "") {
        this.time_stamp = {
            created: new Date()
        }

        this.duration = {
            consumed: 0
        }

        this.category = [];
        this.running = false;
        this.done = false;
        this.fresh_rate = 0;
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

    constructor(init: Init) {
        if (init.is_first) {
            this.meta_data = new MetaData();
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

    consumed_time = (start: TimeStamp, pause: TimeStamp): Duration => {
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

    gen_id = () => {

    }
}

class Collection < T extends Core > extends Core {
    constructor(init: Init, public container: Array < T > = []) {
        super(init);
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


    duration = () => {

    }

    buffer_time = () => {

    }
}

class Atom extends Core {
    constructor(init: Init, public todo: string = "", public attack: string = "", public difficulty: Difficulty = 0) {
        super(init)
    }

}

class Molecule extends Collection < Atom > {
    constructor(init: Init, public abstract_text: string = "", public attack: string = "") {
        super(init);
    }

}

class Beaker extends Collection < Molecule > {
    constructor(init: Init, public title: string = "", public note: string = "") {
        super(init);
    }
}

let a = new Atom({is_first:true, user_id: ""});
console.log(a);

let m = new Molecule({is_first:true, user_id: ""});
console.log(m);

let b = new Beaker({is_first:true, user_id: ""})
console.log(b);

