import { getContext } from "/scripts/extensions.js";

const DEFAULT_RESPONSE_LENGTH = 2200;

export async function runStSummaryProvider(request) {
    const context = getContext();
    const rawText = await context.generateRaw({
        prompt: request.promptBundle.userPrompt,
        systemPrompt: request.promptBundle.systemPrompt,
        responseLength: request.maxTokens || DEFAULT_RESPONSE_LENGTH,
        trimNames: true,
    });

    const archiveSummary = String(rawText || "").trim();
    return {
        rawText,
        parseError: "",
        parsed: null,
        archiveSummary,
        injectSummary: archiveSummary,
    };
}
