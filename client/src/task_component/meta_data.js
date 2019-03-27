"use strict";
exports.__esModule = true;
var MetaData = /** @class */ (function () {
    function MetaData(parent_id, data_type) {
        this.parent_id = parent_id;
        this.data_type = data_type;
        this.time_stamp = {
            created: new Date()
        };
        this.duration = {
            elapsed: 0
        };
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
    return MetaData;
}());
exports.MetaData = MetaData;
