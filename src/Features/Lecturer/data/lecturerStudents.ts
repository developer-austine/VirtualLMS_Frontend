export interface Student {
  id: string;
  name: string;
  regNumber: string;
  email: string;
  attendance: number; // percentage
  avatar: string;
  grades: Record<string, number | null>; // activityId → mark
}

export const studentsByCourse: Record<string, Student[]> = {
  lc1: [
    { id: "st1", name: "Austine Alex",    regNumber: "SKL/2021/001", email: "austine@kcau.ac.ke",  attendance: 90, avatar: "AA", grades: { m7: 18, m8: 16 } },
    { id: "st2", name: "Brian Omondi",    regNumber: "SKL/2021/002", email: "brian@kcau.ac.ke",    attendance: 75, avatar: "BO", grades: { m7: 14, m8: null } },
    { id: "st3", name: "Carol Wanjiku",   regNumber: "SKL/2021/003", email: "carol@kcau.ac.ke",    attendance: 85, avatar: "CW", grades: { m7: 20, m8: 19 } },
    { id: "st4", name: "David Kipchoge",  regNumber: "SKL/2021/004", email: "david@kcau.ac.ke",    attendance: 60, avatar: "DK", grades: { m7: null, m8: 12 } },
    { id: "st5", name: "Esther Mutua",    regNumber: "SKL/2021/005", email: "esther@kcau.ac.ke",   attendance: 95, avatar: "EM", grades: { m7: 17, m8: 18 } },
    { id: "st6", name: "Felix Otieno",    regNumber: "SKL/2021/006", email: "felix@kcau.ac.ke",    attendance: 70, avatar: "FO", grades: { m7: 15, m8: null } },
    { id: "st7", name: "Grace Achieng",   regNumber: "SKL/2021/007", email: "grace@kcau.ac.ke",    attendance: 88, avatar: "GA", grades: { m7: 19, m8: 17 } },
    { id: "st8", name: "Hassan Abdi",     regNumber: "SKL/2021/008", email: "hassan@kcau.ac.ke",   attendance: 55, avatar: "HA", grades: { m7: null, m8: null } },
  ],
  lc2: [
    { id: "st1", name: "Austine Alex",    regNumber: "SKL/2021/001", email: "austine@kcau.ac.ke",  attendance: 82, avatar: "AA", grades: { m5: 15 } },
    { id: "st2", name: "Brian Omondi",    regNumber: "SKL/2021/002", email: "brian@kcau.ac.ke",    attendance: 78, avatar: "BO", grades: { m5: 12 } },
    { id: "st3", name: "Ivy Kamau",       regNumber: "SKL/2021/009", email: "ivy@kcau.ac.ke",      attendance: 91, avatar: "IK", grades: { m5: 18 } },
    { id: "st4", name: "James Mwangi",    regNumber: "SKL/2021/010", email: "james@kcau.ac.ke",    attendance: 66, avatar: "JM", grades: { m5: null } },
  ],
  lc3: [
    { id: "st1", name: "Austine Alex",    regNumber: "SKL/2021/001", email: "austine@kcau.ac.ke",  attendance: 88, avatar: "AA", grades: {} },
    { id: "st2", name: "Kevin Njoroge",   regNumber: "SKL/2021/011", email: "kevin@kcau.ac.ke",    attendance: 72, avatar: "KN", grades: {} },
    { id: "st3", name: "Linda Chebet",    regNumber: "SKL/2021/012", email: "linda@kcau.ac.ke",    attendance: 94, avatar: "LC", grades: {} },
  ],
};