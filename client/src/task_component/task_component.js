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
var task_collection_1 = require("./task_collection");
var Atom = /** @class */ (function (_super) {
    __extends(Atom, _super);
    function Atom(init, parent_id, todo, attack) {
        if (parent_id === void 0) { parent_id = ""; }
        if (todo === void 0) { todo = ""; }
        if (attack === void 0) { attack = ""; }
        var _this = _super.call(this, init, parent_id, "atom") || this;
        _this.todo = todo;
        _this.attack = attack;
        return _this;
    }
    return Atom;
}(task_core_1.Core));
exports.Atom = Atom;
var Molecule = /** @class */ (function (_super) {
    __extends(Molecule, _super);
    function Molecule(init, parent_id, abstract_text, attack, time_plan) {
        if (parent_id === void 0) { parent_id = ""; }
        if (abstract_text === void 0) { abstract_text = ""; }
        if (attack === void 0) { attack = ""; }
        var _this = _super.call(this, init, parent_id, "molecule", time_plan) || this;
        _this.abstract_text = abstract_text;
        _this.attack = attack;
        return _this;
    }
    return Molecule;
}(task_collection_1.Collection));
exports.Molecule = Molecule;
var Beaker = /** @class */ (function (_super) {
    __extends(Beaker, _super);
    function Beaker(init, parent_id, title, note, time_plan) {
        if (parent_id === void 0) { parent_id = ""; }
        if (title === void 0) { title = ""; }
        if (note === void 0) { note = ""; }
        var _this = _super.call(this, init, parent_id, "beaker", time_plan) || this;
        _this.title = title;
        _this.note = note;
        return _this;
    }
    return Beaker;
}(task_collection_1.Collection));
exports.Beaker = Beaker;
