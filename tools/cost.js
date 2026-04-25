import axios from "axios";
import { DefaultAzureCredential } from "@azure/identity";

/**
 * REAL Azure Cost Management API call
 */
export async function getCostSummary() {
  try {
    const subscriptionId = process.env.SUBSCRIPTION_ID;

    const token = await getAzureAccessToken();

    const url = `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.CostManagement/query?api-version=2023-03-01`;

    const response = await axios.post(
      url,
      {
        type: "ActualCost",
        timeframe: "MonthToDate",
        dataset: {
          aggregation: {
            totalCost: {
              name: "PreTaxCost",
              function: "Sum"
            }
          },
          grouping: [
            {
              type: "Dimension",
              name: "ServiceName"
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);

    return {
      error: true,
      raw: error.response?.data || error.message
    };
  }
}

/**
 * Get Azure access token using Managed Identity (CORRECT WAY)
 */
export async function getAzureAccessToken() {
  const credential = new DefaultAzureCredential();

  const scope = "https://management.azure.com/.default";

  const tokenResponse = await credential.getToken(scope);

  return tokenResponse.token;
}