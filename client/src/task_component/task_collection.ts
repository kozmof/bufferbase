import { Init, ID, ParentID, Counts, Percentage, DataType, TimePlan } from "./common_type"
import { Core } from "./task_core"

export class Collection < T extends Core > extends Core {
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

