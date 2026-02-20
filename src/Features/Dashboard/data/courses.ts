export interface Course {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  stream: string;
  trim: string;
  progress: number;
  color: string;
}

export const courses: Course[] = [
  {
    id: "1",
    code: "CPP 3202",
    name: "ADVANCED JAVA PROGRAMMING",
    lecturer: "FT:JARED MARANGA",
    stream: "",
    trim: "TRIM1 26",
    progress: 100,
    color: "bg-purple-400",
  },
  {
    id: "2",
    code: "CPP 3204",
    name: "NETWORK PROGRAMMING",
    lecturer: "FT:JOHN KIMANI",
    stream: "",
    trim: "TRIM1 26",
    progress: 0,
    color: "bg-blue-500",
  },
  {
    id: "3",
    code: "CPU 3203",
    name: "MOBILE GAMING PROGRAMMING",
    lecturer: "FT:MAIN:SAMUEL",
    stream: "",
    trim: "TRIM1 26",
    progress: 100,
    color: "bg-violet-500",
  },
  {
    id: "4",
    code: "ISS 3102",
    name: "EXPERT SYSTEMS",
    lecturer: "FT:ISAAC OKOLA",
    stream: "ZOOM:Stream B",
    trim: "TRIM1 26",
    progress: 0,
    color: "bg-blue-400",
  },
  {
    id: "5",
    code: "ISS 4104",
    name: "DISTRIBUTED SYSTEMS",
    lecturer: "FT:ERNEST KAYEYIA",
    stream: "",
    trim: "TRIM1 26",
    progress: 0,
    color: "bg-emerald-500",
  },
  {
    id: "6",
    code: "MAT 3201",
    name: "LINEAR PROGRAMMING",
    lecturer: "FT:MAIN:JOHN NGAII",
    stream: "",
    trim: "TRIM1 26",
    progress: 0,
    color: "bg-sky-300",
  },
];