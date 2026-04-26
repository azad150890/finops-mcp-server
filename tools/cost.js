import OpenAI from "openai";

/**
 * Use Phi-4 model for cost analysis
 */
export async function getCostSummary() {
  try {
    const client = new OpenAI({
      apiKey: process.env.PHI4_KEY,
      baseURL: process.env.PHI4_ENDPOINT,
    });

    const response = await client.chat.completions.create({
      model: "phi-4", // or whatever the deployment name is
      messages: [
        {
          role: "user",
          content: "Analyze my Azure costs for the month to date. Provide a summary of costs by service in a human-readable format."
        }
      ],
      max_tokens: 1000,
    });

    const summary = response.choices[0]?.message?.content || "Unable to generate cost summary.";

    return { summary };

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
export async function getAzureAccessToken(scope = "https://management.azure.com/.default") {
  const credential = new DefaultAzureCredential();

  const tokenResponse = await credential.getToken(scope);

  return tokenResponse.token;
}