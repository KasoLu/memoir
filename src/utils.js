/**
 * Normalize an API base URL to a full chat/completions endpoint.
 * Handles trailing slashes, partial paths, and v1 prefix.
 */
export function normalizeChatCompletionsUrl(apiUrl) {
    let value = String(apiUrl || "").trim();
    if (!value) {
        return value;
    }

    if (!value.endsWith("/")) {
        value += "/";
    }

    if (value.endsWith("/chat/completions/")) {
        return value.replace(/\/$/, "");
    }

    if (value.includes("/chat/completions")) {
        return value;
    }

    if (value.endsWith("/v1/")) {
        return `${value}chat/completions`;
    }

    return `${value}v1/chat/completions`;
}

/**
 * Show a toast notification via SillyTavern's toastr.
 */
export function notify(type, message) {
    if (globalThis.toastr?.[type]) {
        globalThis.toastr[type](message);
    }
}

/**
 * Simple debounce helper.
 */
export function debounce(fn, ms) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), ms);
    };
}

/**
 * Fetch available models from an OpenAI-compatible /v1/models endpoint.
 */
export async function fetchAvailableModels(apiUrl, apiKey) {
    let url = String(apiUrl || "").trim();
    if (!url) {
        throw new Error("API URL is required.");
    }
    if (!url.endsWith("/")) {
        url += "/";
    }
    if (url.endsWith("/v1/")) {
        url += "models";
    } else {
        url += "v1/models";
    }

    const headers = { "Content-Type": "application/json" };
    if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const response = await fetch(url, { method: "GET", headers });
    if (!response.ok) {
        throw new Error(`${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const models = [];

    if (data?.data && Array.isArray(data.data)) {
        for (const m of data.data) {
            if (m.id) {
                models.push(m.id);
            }
        }
    } else if (Array.isArray(data)) {
        for (const m of data) {
            if (typeof m === "string") {
                models.push(m);
            } else if (m.id) {
                models.push(m.id);
            }
        }
    }

    models.sort((a, b) => a.localeCompare(b));
    return models;
}
