import OpenAI from "openai";

/**
 * Use Phi-4 model for cost analysis
 */
export async function getCostSummary() {
  try {
    // Validate environment variables
    if (!process.env.PHI4_KEY) {
      console.error("ERROR: PHI4_KEY environment variable not set");
      return { error: true, message: "PHI4_KEY not configured" };
    }
    if (!process.env.PHI4_ENDPOINT) {
      console.error("ERROR: PHI4_ENDPOINT environment variable not set");
      return { error: true, message: "PHI4_ENDPOINT not configured" };
    }

    console.log("Creating OpenAI client with endpoint:", process.env.PHI4_ENDPOINT);

    const client = new OpenAI({
      apiKey: process.env.PHI4_KEY,
      baseURL: process.env.PHI4_ENDPOINT,
    });

    const prompt = "Analyze my Azure costs for the month to date. Provide a summary of costs by service in a human-readable format.";
    console.log("Sending prompt to Phi-4:", prompt);

    const response = await client.chat.completions.create({
      model: "phi-4",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    console.log("Raw response:", JSON.stringify(response, null, 2));

    if (!response.choices || response.choices.length === 0) {
      console.error("ERROR: No choices in response");
      return { error: true, message: "No response from Phi-4 model", response };
    }

    const summary = response.choices[0]?.message?.content;
    
    if (!summary) {
      console.error("ERROR: Empty content in response");
      return { error: true, message: "Empty response from Phi-4", response };
    }

    console.log("Cost summary generated:", summary);
    return { summary };

  } catch (error) {
    console.error("FULL ERROR:", error);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response?.data || "N/A");

    return {
      error: true,
      message: error.message,
      details: error.response?.data || error.message
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