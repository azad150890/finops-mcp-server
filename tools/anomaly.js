export async function detectAnomaly() {
  return {
    anomalyDetected: true,
    service: "Compute",
    spikePercent: 42,
    possibleCause: "Increased VM usage or scale-out event",
    severity: "high"
  };
}