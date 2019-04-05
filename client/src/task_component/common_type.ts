export type UserID = string;
export type ParentID = string;
export type ID = UserID | ParentID;
export type Duration = number;
export type Percentage = number;
export type DataType = "core" | "atom" | "molecule" | "beaker";

export type TimeStamp = Date;
export type UnixTimeStamp = number;

export interface Init {
  readonly is_first: boolean;
  readonly user_id: UserID;
  readonly id ? : ID;
}

export interface TimePlan {
  readonly whole_time: Duration;
  readonly buffer: Duration;
}

export interface Counts {
  numerator: number;
  denominator: number;
}

