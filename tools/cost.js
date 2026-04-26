import OpenAI from "openai";
import { DefaultAzureCredential } from "@azure/identity";

/**
 * Step 1: Fetch Azure cost data
 */
async function fetchAzureCosts() {
  const credential = new DefaultAzureCredential();
  const token = await credential.getToken(
    "https://management.azure.com/.default"
  );

  const subscriptionId = process.env.SUBSCRIPTION_ID;

  const url = `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.CostManagement/query?api-version=2023-03-01`;

  const body = {
    type: "ActualCost",
    timeframe: "MonthToDate",
    dataset: {
      granularity: "None",
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
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  return data;
}

/**
 * Step 2: Summarize with Phi-4
 */
export async function getCostSummary() {
  try {
    const costData = await fetchAzureCosts();

    const client = new OpenAI({
      baseURL: process.env.PHI4_ENDPOINT,
      apiKey: process.env.PHI4_KEY,
      defaultQuery: {
        "api-version": "2024-05-01-preview"
      }
    });

    const completion = await client.chat.completions.create({
      model: process.env.PHI4_AGENT_NAME,
      messages: [
        {
          role: "system",
          content:
            "You are a FinOps expert. Analyze Azure cost data and produce insights."
        },
        {
          role: "user",
          content: `
Here is Azure cost data (month-to-date):

${JSON.stringify(costData, null, 2)}

Return:
- Total cost
- Top 3 services by cost
- Cost anomalies
- Optimization recommendations
`
        }
      ]
    });

    return {
      summary: completion.choices?.[0]?.message?.content,
      rawCostData: costData
    };

  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);

    return {
      error: true,
      message: error.message,
      details: error.response?.data
    };
  }
}