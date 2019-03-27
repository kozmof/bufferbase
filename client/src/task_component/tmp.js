"use strict";
exports.__esModule = true;
var task_component_1 = require("./task_component");
var a = new task_component_1.Atom({
    is_first: true,
    user_id: ""
}, "atom_test_id");
console.log("level");
console.log(a.level(5, true));
var m = new task_component_1.Molecule({
    is_first: true,
    user_id: ""
}, "molecule_test_id", "test_abstract", "test_attack", {
    whole_time: 60,
    buffer: 30
});
m.add(a);
var b = new task_component_1.Beaker({
    is_first: true,
    user_id: ""
}, "beaker_test_id", "test_title", "test_note", {
    whole_time: 60,
    buffer: 30
});
b.add(m);
console.log(b);
b.remove("dummy");
console.log(b);
