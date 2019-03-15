type UserID = string;
type ParentID = string;
type ID = string;
type Duration = number;
type Difficulty = number;
type Percentage = number;
type DataType = "core" | "atom" | "molecule" | "beaker";

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

    constructor(public parent_id: ParentID, public data_type: DataType) {
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

    gen_id = (): ID => {
        return "dummy"
    }
}

class Collection < T extends Core > extends Core {
    constructor(init: Init, parent_id: ParentID, data_type: DataType, public container: Array < T > = []) {
        super(init, parent_id, data_type);
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

    duration = () => {

    }

    buffer = () => {

    }

}

class Atom extends Core {
    constructor(init: Init, parent_id: ParentID = "", public todo: string = "", public attack: string = "", public difficulty: Difficulty = 0) {
        super(init, parent_id, "atom")
    }

}

class Molecule extends Collection < Atom > {
    constructor(init: Init, parent_id: ParentID = "", public abstract_text: string = "", public attack: string = "") {
        super(init, parent_id, "molecule");
    }

}

class Beaker extends Collection < Molecule > {
    constructor(init: Init, parent_id: ParentID = "", public title: string = "", public note: string = "") {
        super(init, parent_id, "beaker");
    }

}

let a = new Atom({is_first: true, user_id: ""}, "atom_test");

let m = new Molecule({is_first: true, user_id: ""}, "molecule_test");

m.add(a)

let b = new Beaker({is_first: true, user_id: ""}, "beaker_test");

b.add(m);

console.log(b);

b.remove("dummy");
console.log(b);
