const axios = require("axios");

class LogWatchClient {
  constructor(endpoint, apiKey, retryCount = 5, baseDelay = 1000) {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
    this.retryCount = retryCount; // Maximum number of retry attempts
    this.baseDelay = baseDelay; // Base delay in milliseconds

    this.api = axios.create({
      baseURL: endpoint,
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      timeout: 5000, // 5 second timeout
    });
  }

  async log(message, level = "info") {
    const payload = {
      message: message,
      level: level,
      timestamp: new Date().toISOString(),
    };

    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        await this.api.post("/logs", payload);
        console.log(
          `[LogWatch] ${level.toUpperCase()}: Log sent successfully (Attempt ${attempt})`
        );
        return;
      } catch (error) {
        console.error(
          `[LogWatch] Error sending log (Attempt ${attempt}): ${error.message}`
        );

        if (attempt < this.retryCount) {
          const delayTime = this.#getExponentialDelay(attempt);
          console.log(`[LogWatch] Waiting ${delayTime} ms before retrying...`);
          await this.#delay(delayTime);
        } else {
          console.error("[LogWatch] All retry attempts failed.");
        }
      }
    }
  }

  // Exponential backoff with optional jitter
  #getExponentialDelay(attempt) {
    const exponential = this.baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.floor(Math.random() * 100); // Random jitter 0-100ms
    return exponential + jitter;
  }

  #delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  info(message) {
    return this.log(message, "info");
  }

  warn(message) {
    return this.log(message, "warn");
  }

  error(message) {
    return this.log(message, "error");
  }
}

module.exports = LogWatchClient;
