import axios from "axios";
import { DefaultAzureCredential } from "@azure/identity";

/**
 * Use Phi-4 model via Azure AI Foundry Agents
 */
export async function getCostSummary() {
  try {
    if (!process.env.PHI4_ENDPOINT) {
      console.error("ERROR: PHI4_ENDPOINT environment variable not set");
      return { error: true, message: "PHI4_ENDPOINT not configured" };
    }

    const rawEndpoint = process.env.PHI4_ENDPOINT.trim();

    // Guard against wrong endpoint type
    if (
      rawEndpoint.includes("/models/chat/completions") ||
      rawEndpoint.includes("/openai/")
    ) {
      return {
        error: true,
        message:
          "PHI4_ENDPOINT must be Foundry project endpoint like: https://<resource>.services.ai.azure.com/api/projects/<project>"
      };
    }

    const projectEndpoint = rawEndpoint.replace(/\/+$/, "");
    const agentName = process.env.PHI4_AGENT_NAME || "phi-4";

    const prompt =
      "Analyze my Azure costs for the month to date. Provide a summary of costs by service in a human-readable format.";

    console.log("Project endpoint:", projectEndpoint);
    console.log("Agent name:", agentName);

    // Auth
    let headers = {
      "Content-Type": "application/json"
    };

    if (process.env.PHI4_KEY) {
      console.log("Using API key");
      headers["api-key"] = process.env.PHI4_KEY;
    } else {
      console.log("Using Managed Identity");
      const token = await getAzureAccessToken();
      headers["Authorization"] = `Bearer ${token}`;
    }

    // ✅ Try stable API version first if 07 fails
    const url = `${projectEndpoint}/agents/${agentName}/run?api-version=2024-05-01-preview`;

    console.log("Calling URL:", url);

    const response = await axios.post(
      url,
      {
        // ✅ CORRECT PAYLOAD
        input: prompt
      },
      { headers }
    );

    console.log("Raw response:", JSON.stringify(response.data, null, 2));

    // ✅ Flexible parsing
    const summary =
      response.data?.output ||
      response.data?.messages?.[0]?.content ||
      response.data?.message?.content ||
      null;

    if (!summary) {
      return {
        error: true,
        message: "Could not parse agent response",
        raw: response.data
      };
    }

    return { summary };

  } catch (error) {
    console.error("ERROR STATUS:", error.response?.status);
    console.error("ERROR DATA:", JSON.stringify(error.response?.data, null, 2));

    return {
      error: true,
      message: error.message,
      status: error.response?.status,
      details: error.response?.data
    };
  }
}

/**
 * Get Azure AD token
 */
export async function getAzureAccessToken(
  scope = "https://ai.azure.com/.default"
) {
  const credential = new DefaultAzureCredential();
  const tokenResponse = await credential.getToken(scope);
  return tokenResponse.token;
}