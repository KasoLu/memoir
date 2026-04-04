import { getSafeContext } from "../core/context.js";
import { getCumulativeSummary } from "../state/chat-segment-store.js";

export async function getApprovedSummaryTokenStats(summaryText = getCumulativeSummary()) {
    const context = getSafeContext();
    const counter = typeof context?.getTokenCountAsync === "function"
        ? context.getTokenCountAsync.bind(context)
        : null;
    const rawText = String(summaryText || "").trim();
    const summaryTokens = await countTokens(counter, rawText);

    return {
        available: !!counter,
        rawText,
        summaryTokens,
    };
}

async function countTokens(counter, text) {
    if (!counter) {
        return null;
    }

    if (!String(text || "").trim()) {
        return 0;
    }

    try {
        const value = await counter(text);
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : null;
    } catch {
        return null;
    }
}
