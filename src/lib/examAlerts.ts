// Indian competitive/technical exam notifications. Dates are INDICATIVE (based
// on each exam's usual annual cycle) — always confirm on the official site.
// Easy to update: edit the dates/links here.
export interface ExamAlert {
  slug: string;
  name: string;
  org: string;
  category: "Engineering" | "Medical" | "Management" | "Research" | "Civil Services" | "Science";
  level: string;
  examDate: string;       // ISO; "" if rolling
  applyStart: string;     // ISO
  applyEnd: string;       // ISO
  eligibility: string;
  fee: string;
  mode: string;
  link: string;
}

export const EXAM_ALERTS: ExamAlert[] = [
  {
    slug: "cat-2026", name: "CAT 2026", org: "IIMs", category: "Management", level: "MBA admission",
    examDate: "2026-11-29", applyStart: "2026-08-05", applyEnd: "2026-09-21",
    eligibility: "Bachelor's degree with 50% (45% for reserved categories).",
    fee: "₹2,500 (₹1,250 reserved)", mode: "Computer-based (3 sections, 2 hrs)",
    link: "https://iimcat.ac.in/",
  },
  {
    slug: "gate-2027", name: "GATE 2027", org: "IISc Bangalore", category: "Engineering", level: "M.Tech / PSU / research",
    examDate: "2027-02-06", applyStart: "2026-08-28", applyEnd: "2026-10-09",
    eligibility: "Final-year or graduate in engineering/science.",
    fee: "₹1,800 (₹900 reserved/female)", mode: "Computer-based (3 hrs, 30 papers)",
    link: "https://gate.iitkgp.ac.in/",
  },
  {
    slug: "jee-main-2027-s1", name: "JEE Main 2027 (Session 1)", org: "NTA", category: "Engineering", level: "B.E./B.Tech admission (NITs, IIITs)",
    examDate: "2027-01-24", applyStart: "2026-11-01", applyEnd: "2026-11-30",
    eligibility: "Class 12 pass / appearing (PCM).",
    fee: "₹1,000 approx (varies)", mode: "Computer-based (2 sessions/year)",
    link: "https://jeemain.nta.nic.in/",
  },
  {
    slug: "jee-advanced-2027", name: "JEE Advanced 2027", org: "IITs", category: "Engineering", level: "IIT admission",
    examDate: "2027-05-23", applyStart: "2027-04-30", applyEnd: "2027-05-05",
    eligibility: "Top ~2.5 lakh JEE Main 2027 qualifiers.",
    fee: "₹3,200 (₹1,600 reserved/female)", mode: "Computer-based (2 papers)",
    link: "https://jeeadv.ac.in/",
  },
  {
    slug: "neet-ug-2027", name: "NEET (UG) 2027", org: "NTA", category: "Medical", level: "MBBS/BDS admission",
    examDate: "2027-05-02", applyStart: "2027-02-09", applyEnd: "2027-03-09",
    eligibility: "Class 12 with Physics, Chemistry, Biology; min age 17.",
    fee: "₹1,700 approx", mode: "Pen-and-paper (3 hrs 20 min)",
    link: "https://neet.nta.nic.in/",
  },
  {
    slug: "bitsat-2027", name: "BITSAT 2027", org: "BITS Pilani", category: "Engineering", level: "BITS admission",
    examDate: "2027-05-20", applyStart: "2027-01-15", applyEnd: "2027-04-15",
    eligibility: "Class 12 with PCM, ≥75% aggregate.",
    fee: "₹3,400 approx", mode: "Computer-based (2 sessions)",
    link: "https://www.bitsadmission.com/",
  },
  {
    slug: "isi-2027", name: "ISI Admission Test 2027", org: "Indian Statistical Institute", category: "Science", level: "B.Stat / B.Math / M.Stat",
    examDate: "2027-05-09", applyStart: "2027-02-15", applyEnd: "2027-03-15",
    eligibility: "Class 12 (B.Stat/B.Math) with mathematics.",
    fee: "₹1,500 approx", mode: "Written (objective + descriptive)",
    link: "https://www.isical.ac.in/admissions",
  },
  {
    slug: "iit-jam-2027", name: "IIT JAM 2027", org: "IITs", category: "Science", level: "M.Sc admission",
    examDate: "2027-02-14", applyStart: "2026-09-05", applyEnd: "2026-10-15",
    eligibility: "Bachelor's degree in relevant science subject.",
    fee: "₹1,800 (₹900 reserved/female)", mode: "Computer-based",
    link: "https://jam.iitm.ac.in/",
  },
  {
    slug: "upsc-cse-2027", name: "UPSC Civil Services 2027", org: "UPSC", category: "Civil Services", level: "IAS/IPS/IFS etc.",
    examDate: "2027-05-30", applyStart: "2027-01-20", applyEnd: "2027-02-10",
    eligibility: "Bachelor's degree; age 21–32 (relaxations apply).",
    fee: "₹100 (Prelims)", mode: "Prelims → Mains → Interview",
    link: "https://upsc.gov.in/",
  },
  {
    slug: "jest-2027", name: "JEST 2027", org: "Participating institutes", category: "Research", level: "Ph.D in Physics/CS",
    examDate: "2027-02-21", applyStart: "2026-11-10", applyEnd: "2027-01-10",
    eligibility: "M.Sc/B.E./B.Tech in physics or related; some allow B.Sc.",
    fee: "₹500 approx", mode: "Computer-based",
    link: "https://www.jest.org.in/",
  },
  {
    slug: "csir-ugc-net-2026", name: "CSIR UGC-NET (Dec 2026)", org: "NTA", category: "Research", level: "JRF / Lectureship",
    examDate: "2026-12-15", applyStart: "2026-10-01", applyEnd: "2026-10-30",
    eligibility: "M.Sc or equivalent in science with ≥55%.",
    fee: "₹1,150 approx", mode: "Computer-based",
    link: "https://csirnet.nta.ac.in/",
  },
  {
    slug: "gre-rolling", name: "GRE General Test", org: "ETS", category: "Management", level: "Grad school (global)",
    examDate: "", applyStart: "2026-01-01", applyEnd: "2027-12-31",
    eligibility: "No fixed eligibility; for graduate/MBA admissions abroad.",
    fee: "$220 approx", mode: "Computer-based, year-round (book any date)",
    link: "https://www.ets.org/gre",
  },
];
