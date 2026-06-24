export type Notary = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  area: string;
  landmarks: string;
  hours: string;
  contact: string;
  email: string;
  facebook: string;
  payments: string[];
  fee: string;
  feedback: string;
  status: "Approved" | "Pending";
};

export const notariesData: Notary[] = [
  {
    id: "1",
    name: "Ken Notarial Services (Main Branch)",
    address: "001 Kalayaan B St., corner IBP Rd., Batasan Hills, Quezon City",
    lat: 14.698380,
    lng: 121.094520,
    area: "Metro Manila District 2",
    landmarks: "",
    hours: "Monday to Sunday, 7:00 AM – 6:30 PM",
    contact: "0930 099 3389",
    email: "kennotarialservices@gmail.com",
    facebook: "facebook.com/notarypublicquezoncity",
    payments: ["Cash", "GCash"],
    fee: "₱100–150",
    feedback: "",
    status: "Approved",
  },
  {
    id: "2",
    name: "Ken Notarial Services (Extended Branch)",
    address: "1 Kasayahan St., IBP Rd., Batasan Hills, Quezon City",
    lat: 14.698500,
    lng: 121.094600,
    area: "Metro Manila District 2",
    landmarks: "With Parking",
    hours: "Monday to Saturday, 8:00 AM – 6:30 PM",
    contact: "0930 099 3389",
    email: "kennotarialservices@gmail.com",
    facebook: "",
    payments: ["Cash", "GCash"],
    fee: "₱100–150",
    feedback: "",
    status: "Approved",
  },
  {
    id: "3",
    name: "Soguilon Law Office",
    address: "15 Anonas, Project 3, Quezon City",
    lat: 14.628850,
    lng: 121.064510,
    area: "Metro Manila District 2",
    landmarks: "",
    hours: "Not specified",
    contact: "Not specified",
    email: "",
    facebook: "",
    payments: ["Cash"],
    fee: "₱200",
    feedback: "",
    status: "Approved",
  },
  {
    id: "4",
    name: "Arceo & Tandoc Law Firm",
    address: "3F Xavier Building, 41 Esteban Abada St., Loyola Heights, QC",
    lat: 14.636034,
    lng: 121.073546,
    area: "Metro Manila District 2",
    landmarks: "Enter the street between McDo and Shakey's. Go to Room 314.",
    hours: "Monday to Friday, 8:00 AM – 5:00 PM",
    contact: "Not specified",
    email: "lawfirm@arceotandoc.com",
    facebook: "facebook.com/arceotandoclawfirm",
    payments: ["Cash"],
    fee: "₱1,000",
    feedback: "I wouldn't recommend going here, unless you're really desperate. They charge 1000 pesos per document.",
    status: "Approved",
  },
  {
    id: "5",
    name: "Del Mundo-Buendia Law & Notarial Office",
    address: "396 Sumulong Highway, Marikina City",
    lat: 14.630540,
    lng: 121.096720,
    area: "Metro Manila District 2",
    landmarks: "In front of Marikina Public Market",
    hours: "Not specified",
    contact: "Not specified",
    email: "",
    facebook: "",
    payments: ["Cash"],
    fee: "Varies",
    feedback: "",
    status: "Approved",
  }
];