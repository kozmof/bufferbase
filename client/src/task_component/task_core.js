"use strict";
exports.__esModule = true;
var meta_data_1 = require("./meta_data");
var uuid = require("uuid/v4");
var Core = /** @class */ (function () {
    function Core(init, parent_id, data_type) {
        var _this = this;
        this.to_unix_time = function (t) {
            return Math.round(t.getTime() / 1000);
        };
        this.to_time = function (t) {
            return new Date(t * 1000);
        };
        this.elapsed_time = function (start, pause) {
            return _this.to_unix_time(pause) - _this.to_unix_time(start);
        };
        this.stom = function (seconds) {
            return Math.round(seconds / 60);
        };
        this.mtoh = function (minutes) {
            return Math.round(minutes / 60);
        };
        this.htod = function (hours) {
            return Math.round(hours / 24);
        };
        this.start = function () {
            if (!_this.meta_data.running) {
                _this.meta_data.time_stamp.started = new Date();
                // update DB
            }
        };
        this.pause = function () {
            if (_this.meta_data.running) {
                _this.meta_data.time_stamp.paused = new Date();
                // update DB
            }
        };
        this.finish = function () {
            if (!_this.meta_data.done) {
                _this.meta_data.time_stamp.finished = new Date();
            }
            else {
                // TODO 
                _this.meta_data.time_stamp.finished = null;
            }
            // update DB
        };
        this.load = function () {
        };
        this.gen_id = function () {
            return uuid();
        };
        // TODO
        this.load_all_difficulty = function () {
            // Dummy
            return [0, 1, 1, 1, 1, 1, 1];
        };
        this.level = function (dif, debug) {
            if (debug === void 0) { debug = false; }
            var all_difficulty = _this.load_all_difficulty();
            all_difficulty.push(5);
            var ssd = _this.signed_deviation(all_difficulty);
            if (debug) {
                console.log("signed standard deviation: " + ssd);
            }
            if (10 >= dif && dif > (25 + ssd) / 3) {
                return 6;
            }
            else if ((25 + ssd) / 3 >= dif && dif > (20 - (2 * ssd)) / 3) {
                return 5;
            }
            else if ((20 - (2 * ssd)) / 3 >= dif && dif > 5 + ssd) {
                return 4;
            }
            else if (5 + ssd >= dif && dif > (5 + ssd) * 2 / 3) {
                return 3;
            }
            else if ((5 + ssd) * 2 / 3 >= dif && dif > (5 + ssd) / 3) {
                return 2;
            }
            else if ((5 + ssd) / 3 >= dif && dif >= 0) {
                return 1;
            }
        };
        this.signed_deviation = function (nums) {
            if (nums.length <= 1) {
                return 0;
            }
            else {
                var average = nums.reduce(function (acc, el) { return acc + el; }) / nums.length;
                var acc = 0;
                var pm = {
                    plus: 0,
                    minus: 0
                };
                for (var _i = 0, nums_1 = nums; _i < nums_1.length; _i++) {
                    var el = nums_1[_i];
                    if (el - average >= 0) {
                        pm.plus += 1;
                    }
                    else {
                        pm.minus += 1;
                    }
                    acc += Math.pow((el - average), 2);
                }
                var deviation = Math.pow((acc / (nums.length - 1)), (1 / 2));
                if (pm.plus > pm.minus) {
                    return deviation;
                }
                else if (pm.plus < pm.minus) {
                    return -deviation;
                }
                else {
                    return 0;
                }
            }
        };
        if (init.is_first) {
            this.meta_data = new meta_data_1.MetaData(parent_id, data_type);
            this.id = this.gen_id();
        }
        else {
            this.load();
        }
    }
    return Core;
}());
exports.Core = Core;
