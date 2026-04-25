import axios from "axios";

export async function getCostSummary() {
  // MOCK / Replace with Azure Cost Management API
  return {
    totalCost: 12500,
    currency: "INR",
    topServices: [
      { name: "Virtual Machines", cost: 6000 },
      { name: "Storage", cost: 2500 },
      { name: "Networking", cost: 2000 }
    ],
    trend: "increasing",
    changePercent: 14.2
  };
}