import axios from "axios";

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
    console.error("Cost API error:", error.response?.data || error.message);

    return {
      error: true,
      message: "Failed to fetch Azure cost data"
    };
  }
}

/**
 * Get Azure access token using Managed Identity
 */
async function getAzureAccessToken() {
  const url =
    "http://169.254.169.254/metadata/identity/oauth2/token" +
    "?api-version=2018-02-01&resource=https://management.azure.com/";

  const res = await axios.get(url, {
    headers: { Metadata: "true" }
  });

  return res.data.access_token;
}