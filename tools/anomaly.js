import axios from "axios";
import { DefaultAzureCredential } from "@azure/identity";

export async function detectAnomaly() {
  try {
    if (!process.env.PHI4_ENDPOINT) {
      console.error("ERROR: PHI4_ENDPOINT environment variable not set");
      return { error: true, message: "PHI4_ENDPOINT not configured" };
    }

    const projectEndpoint = process.env.PHI4_ENDPOINT.replace(/\/+$/, "");
    const agentName = process.env.PHI4_AGENT_NAME || "phi-4";
    const prompt = "Detect any anomalies in my Azure costs. Provide details on detected anomalies including service, spike percentage, possible cause, and severity.";

    console.log("Project endpoint:", projectEndpoint);
    console.log("Agent name:", agentName);
    console.log("Sending prompt:", prompt);

    const token = await getAzureAccessToken("https://ai.azure.com/.default");
    const url = `${projectEndpoint}/agents/${agentName}/run?api-version=2024-07-01-preview`;

    const response = await axios.post(
      url,
      {
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Raw response:", JSON.stringify(response.data, null, 2));

    const summary = response.data?.choices?.[0]?.message?.content || response.data?.output?.[0]?.content?.[0]?.text || "Unable to parse agent response.";

    if (!summary) {
      console.error("ERROR: Empty content in response");
      return { error: true, message: "Empty response from agent", response: response.data };
    }

    return { summary };
  } catch (error) {
    console.error("FULL ERROR:", error);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response?.data || "N/A");

    return {
      error: true,
      message: error.message || "Unknown error",
      details: error.response?.data || error.message,
      status: error.response?.status
    };
  }
}

async function getAzureAccessToken(scope = "https://ai.azure.com/.default") {
  const credential = new DefaultAzureCredential();
  const tokenResponse = await credential.getToken(scope);
  return tokenResponse.token;
}