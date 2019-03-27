"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var task_core_1 = require("./task_core");
var Collection = /** @class */ (function (_super) {
    __extends(Collection, _super);
    function Collection(init, parent_id, data_type, time_plan, container) {
        if (container === void 0) { container = []; }
        var _this = _super.call(this, init, parent_id, data_type) || this;
        _this.time_plan = time_plan;
        _this.container = container;
        _this.fresh_rate = function () {
            var numerator = 0;
            var denominator = _this.container.length;
            for (var _i = 0, _a = _this.container; _i < _a.length; _i++) {
                var el = _a[_i];
                numerator += el.meta_data.fresh_rate;
            }
            if (denominator) {
                return Math.round(numerator / denominator);
            }
            else {
                return 0;
            }
        };
        _this.done_percentage = function () {
            var numerator = 0;
            var denominator = _this.container.length;
            for (var _i = 0, _a = _this.container; _i < _a.length; _i++) {
                var el = _a[_i];
                numerator += el.meta_data.done_percentage;
            }
            if (denominator) {
                return Math.round((numerator / denominator) * 100);
            }
            else {
                return 0;
            }
        };
        _this.done_counts = function () {
            var counts = {
                numerator: 0,
                denominator: _this.container.length
            };
            for (var _i = 0, _a = _this.container; _i < _a.length; _i++) {
                var el = _a[_i];
                if (el.meta_data.done) {
                    counts.numerator += 1;
                }
            }
            return counts;
        };
        _this.add = function (el) {
            _this.container.push(el);
        };
        _this.remove = function (id) {
            for (var n = 0; n < _this.container.length; n++) {
                if (_this.container[n].id === id) {
                    _this.container.splice(n, 1);
                    return;
                }
            }
        };
        _this.left = function () {
            var whole_time = _this.meta_data.duration.whole_time;
            for (var _i = 0, _a = _this.container; _i < _a.length; _i++) {
                var el = _a[_i];
                whole_time -= el.meta_data.duration.elapsed;
            }
            _this.meta_data.duration.left = whole_time;
        };
        _this.buffer = function () {
            _this.meta_data.duration.buffer = _this.meta_data.duration.buffer + _this.meta_data.duration.left;
        };
        _this.meta_data.duration.whole_time = _this.time_plan.whole_time;
        _this.meta_data.duration.left = _this.time_plan.whole_time;
        _this.meta_data.duration.buffer = _this.time_plan.buffer;
        return _this;
    }
    return Collection;
}(task_core_1.Core));
exports.Collection = Collection;
