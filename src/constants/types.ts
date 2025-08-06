export interface Level {
  key: "L100" | "L200" | "L200F" | "L300" | "L400";
  name: string;
  value: string;
}

export interface Program {
  key: "CYSDSC" | "ICTIFT" | "SWIS" | "CSC";

  name: string;
  description: string;
}
export interface Payment {
  _id: object;
  fullName: string;
  matricNumber: string;
  email: string;
  amount: number;
  level: Level["key"];
  department: Program["key"];
  type: "college" | "departmental";
  createdAt: string;
}

export interface formdata {
  fullName: string;
  matricNumber: string;
  email: string;
  department: string;
  level: string;
  amount: number;
  type: string;
}

