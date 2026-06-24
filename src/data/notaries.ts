export type Notary = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  fee: string;
  status: "Approved" | "Pending";
};

export const notariesData: Notary[] = [
  {
    id: "1",
    name: "Arceo & Tandoc Law Firm",
    address: "3F Xavier Building, 41 Esteban Abada St., Loyola Heights, Quezon City",
    lat: 14.636034, 
    lng: 121.073546,
    fee: "₱1,000",
    status: "Approved",
  },
  {
    id: "2",
    name: "Ken Notarial Services (Main Branch)",
    address: "001 Kalayaan B St., corner IBP Rd., Batasan Hills, Quezon City",
    lat: 14.698380,
    lng: 121.094520,
    fee: "₱100-150",
    status: "Approved",
  },
  {
    id: "3",
    name: "Soguilon Law Office",
    address: "15 Anonas, Project 3, Quezon City",
    lat: 14.628850,
    lng: 121.064510,
    fee: "₱200",
    status: "Approved",
  },
  {
    id: "4",
    name: "Del Mundo-Buendia Law & Notarial Office",
    address: "396 Sumulong Highway, Marikina City",
    lat: 14.630540,
    lng: 121.096720,
    fee: "Unknown",
    status: "Approved",
  }
];