import type { Level, Program } from "./types";

export const departments: Program[] = [
  {
    key: "CYSDSC",
    name: "Cybersecurity & Data Science",
    description:
      "Study of protecting digital systems and using data science for insights and innovation",
  },
  {
    key: "ICTIFT",
    name: "ICT & Information Technology",
    description:
      "Focus on communication networks and the application of information technology",
  },
  {
    key: "SWIS",
    name: "Software Engr & Information Software",
    description:
      "Study of designing, building, and maintaining reliable software systems",
  },
  {
    key: "CSC",
    name: "Computer Science",
    description:
      "Study of computation, algorithms, programming, and systems design",
  },
];

export const levels: Level[] = [
  {
    key: "L100",
    name: "100 Level",
    value: "100",
  },
  {
    key: "L200F",
    name: "Direct Entry",
    value: "200 D.E",
  },
  {
    key: "L200",
    name: "200 Level",
    value: "200",
  },
  {
    key: "L300",
    name: "300 Level",
    value: "300",
  },
  {
    key: "L400",
    name: "400 Level",
    value: "400",
  },
];

export const types = ["college", "departmental"];

