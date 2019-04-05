import { Init, ParentID, TimePlan } from "./common_type"
import { Core } from "./task_core"
import { Collection } from "./task_collection"


export class Atom extends Core {
  constructor(init: Init, parent_id: ParentID = "", public todo: string = "", public attack: string = "") {
    super(init, parent_id, "atom")
  }
}

export class Molecule extends Collection < Atom > {
  constructor(init: Init, parent_id: ParentID = "", public abstract_text: string = "", public attack: string = "", time_plan: TimePlan) {
    super(init, parent_id, "molecule", time_plan);
  }
}

export class Beaker extends Collection < Molecule > {
  constructor(init: Init, parent_id: ParentID = "", public title: string = "", public note: string = "", time_plan: TimePlan) {
    super(init, parent_id, "beaker", time_plan);
  }
}
