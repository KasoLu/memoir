import { getContext } from "/scripts/extensions.js";

export async function runStSummaryProvider(request) {
    const context = getContext();
    const responseLength = Number(request.maxTokens);
    const rawText = await context.generateRaw({
        prompt: request.promptBundle.userPrompt,
        systemPrompt: request.promptBundle.systemPrompt,
        ...(responseLength > 0 ? { responseLength } : {}),
        trimNames: true,
    });

    const archiveSummary = String(rawText || "").trim();
    return {
        rawText,
        parseError: "",
        parsed: null,
        archiveSummary,
        injectSummary: archiveSummary,
        providerModel: "",
    };
}
