# finops-mcp-server

A Model Context Protocol (MCP) server for FinOps analysis using Azure AI Foundry agents.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables:
   - `EMBED_ENDPOINT`: Endpoint for embedding service
   - `embed_key`: API key for embedding service
   - `PHI4_ENDPOINT`: Endpoint for Phi-4 model
   - `PHI4_KEY`: API key for Phi-4 model

3. Run the server:
   ```bash
   npm start
   ```

## Tools

- **Cost Summary**: Analyzes Azure costs using Foundry agent
- **Anomaly Detection**: Detects cost anomalies using Foundry agent
- **Embeddings**: Generates embeddings (uses external service)