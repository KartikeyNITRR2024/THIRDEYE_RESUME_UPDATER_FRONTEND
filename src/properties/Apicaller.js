import Backend from "./Backend";

export default class ApiCaller {
  getBaseUrl() {
    return Backend.THIRDEYE_RESUME_UPDATER_BACKEND.URL;
  }

  async call(endpoint, options = {}) {
    // 1. TOKEN GUARD: Prevent "undefined" string tokens from being sent
    // if (options.headers?.token === "undefined" || options.headers?.token === null) {
    //   console.warn(`[ApiCaller] Blocked call to ${endpoint} due to missing token.`);
    //   return { response: { ok: false }, data: { success: false, errorMessage: "Auth token not ready" } };
    // }

    const retries = Backend.RETRY.COUNT || 1;
    const delay = Backend.RETRY.DELAY_MS || 1000;
    const timeout = Backend.RETRY.TIMEOUT_MS || 30000;
    const enableTimeout = Backend.RETRY.ENABLE_TIMEOUT;

    for (let i = 0; i < retries; i++) {
      let controller;
      let timeoutId;

      if (enableTimeout) {
        controller = new AbortController();
        timeoutId = setTimeout(() => {
          controller.abort();
          console.warn(`[ApiCaller] Request to ${endpoint} timed out.`);
        }, timeout);
      }

      try {
        const url = `${this.getBaseUrl()}${endpoint}`;
        const fetchOptions = {
          ...options,
          signal: controller?.signal,
        };

        const response = await fetch(url, fetchOptions);

        if (enableTimeout) clearTimeout(timeoutId);

        // Attempt to parse JSON, default to empty object if body is empty/invalid
        const data = await response.json().catch(() => ({}));

        // Handle 5xx Server Errors with Retries
        if (response.status >= 500 && i < retries - 1) {
          await this.sleep(delay);
          continue;
        }

        // Return standardized object for the Providers
        return { response, data };

      } catch (err) {
        if (enableTimeout) clearTimeout(timeoutId);

        const isAbort = err.name === "AbortError";
        const isLastTry = i === retries - 1;

        // If it was timed out/aborted and we have retries left
        if (isAbort && !isLastTry) {
          await this.sleep(delay);
          continue;
        }

        if (isLastTry) {
          return { 
            response: { ok: false, status: 0 }, 
            data: { success: false, errorMessage: isAbort ? "Request Timed Out" : "Network Error" } 
          };
        }

        await this.sleep(delay);
      }
    }
  }

  sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
}