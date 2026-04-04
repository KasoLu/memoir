import { getSafeContext } from "../core/context.js";
import { getCumulativeSummary } from "../state/chat-segment-store.js";
import { getSettings } from "../state/settings-store.js";
import { normalizeNonNegativeInteger } from "../utils.js";
import { buildApprovedSummaryInjectionText } from "./injection-service.js";

export async function getApprovedSummaryTokenStats(summaryText = getCumulativeSummary(), settings = getSettings()) {
    const context = getSafeContext();
    const counter = typeof context?.getTokenCountAsync === "function"
        ? context.getTokenCountAsync.bind(context)
        : null;
    const rawText = String(summaryText || "").trim();
    const injectedText = buildApprovedSummaryInjectionText(rawText, settings);
    const maxContext = normalizeNonNegativeInteger(context?.maxContext, 0);
    const budgetPercent = normalizeNonNegativeInteger(settings?.summaryTokenBudgetPercent, 0);
    const budgetCap = normalizeNonNegativeInteger(settings?.summaryTokenBudgetCap, 0);
    const budgetTokens = resolveBudget(maxContext, budgetPercent, budgetCap);

    const [summaryTokens, injectedTokens] = await Promise.all([
        countTokens(counter, rawText),
        countTokens(counter, injectedText),
    ]);

    const contextUsageRatio = maxContext > 0 && injectedTokens !== null
        ? injectedTokens / maxContext
        : null;
    const budgetUsageRatio = budgetTokens > 0 && injectedTokens !== null
        ? injectedTokens / budgetTokens
        : null;
    const overflowTokens = budgetTokens > 0 && injectedTokens !== null
        ? Math.max(0, injectedTokens - budgetTokens)
        : 0;

    return {
        available: !!counter,
        rawText,
        injectedText,
        summaryTokens,
        injectedTokens,
        maxContext,
        budgetPercent,
        budgetCap,
        budgetTokens,
        contextUsageRatio,
        budgetUsageRatio,
        overflowTokens,
        overBudget: overflowTokens > 0,
    };
}

function resolveBudget(maxContext, budgetPercent, budgetCap) {
    const percentBudget = maxContext > 0 && budgetPercent > 0
        ? Math.round((maxContext * budgetPercent) / 100)
        : 0;

    if (budgetCap > 0 && percentBudget > 0) {
        return Math.min(percentBudget, budgetCap);
    }

    if (percentBudget > 0) {
        return percentBudget;
    }

    return budgetCap > 0 ? budgetCap : 0;
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
