# finops-mcp-server

A Model Context Protocol (MCP) server for FinOps analysis using Azure AI services (Phi-4 model).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables in App Service Configuration:
   - `PHI4_ENDPOINT`: Your Azure AI Foundry project endpoint (e.g. `https://<resource>.services.ai.azure.com/api/projects/finops-chatbot`)
   - `PHI4_AGENT_NAME`: Your Foundry agent name (default: `phi-4`)
   - `EMBED_ENDPOINT`: Endpoint for embedding service (optional)
   - `embed_key`: Key for embedding service (optional)

3. Run the server:
   ```bash
   npm start
   ```

## Tools

- **Cost Summary** (`/tool/cost-summary`): Analyzes Azure costs using Phi-4 model
- **Anomaly Detection** (`/tool/anomaly`): Detects cost anomalies using Phi-4 model
- **Embeddings** (`/tool/embed`): Generates embeddings for text
- **Debug Config** (`/debug/config`): Shows which environment variables are set

## Important Notes

- The `PHI4_ENDPOINT` should be the Azure OpenAI resource endpoint (ends with `/`)
- The model name "phi-4" must exist as a deployment in your Azure OpenAI resource
- Uses Azure OpenAI SDK for proper authentication and API handling