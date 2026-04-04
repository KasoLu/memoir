import { getChatRange } from "../core/context.js";
import { getSettings } from "../state/settings-store.js";
import { buildPromptBundle } from "../prompts/prompt-registry.js";
import { runSummaryProvider } from "./provider-router.js";
import { hashMessageRange } from "./segment-hash-service.js";

export async function generateDraftForRange({ startMes, endMes }) {
    const settings = getSettings();
    const messages = getChatRange(startMes, endMes);

    if (!messages.length) {
        throw new Error("No messages found in the selected range.");
    }

    const startFloor = Number(startMes) + 1;
    const endFloor = Number(endMes) + 1;
    const filterRules = Array.isArray(settings.summaryFilterFragments)
        ? settings.summaryFilterFragments.map((item) => String(item || "")).filter(Boolean)
        : [];
    const chatHistoryText = messages
        .map((message, index) => {
            const text = applySummaryFilters(message.mes || "", filterRules);
            return `#${startFloor + index} ${message.name || ""}\n${text}`.trim();
        })
        .join("\n\n");

    const promptBundle = buildPromptBundle(settings, { startFloor, endFloor }, chatHistoryText);
    const sourceHash = await hashMessageRange(messages);

    const providerRequest = {
        startMes,
        endMes,
        startFloor,
        endFloor,
        messages,
        sourceHash,
        promptBundle,
        maxTokens: Number(settings.summaryResponseLength) > 0 ? Number(settings.summaryResponseLength) : 0,
    };

    const response = await runSummaryProvider(providerRequest, settings);
    const resolvedMode = response.providerResolved || settings.summaryGenerationMode;
    const resolvedModel =
        resolvedMode === "independent-api"
            ? response.providerModel || settings.independentApiConfig.model || ""
            : response.providerModel || "";

    return {
        id: `draft_${Date.now()}`,
        range: { startMes, endMes, startFloor, endFloor },
        sourceHash,
        request: providerRequest,
        response,
        status: "draft",
        promptProfileId: settings.promptProfileId,
        stylePatchId: settings.stylePatchId,
        fanficPatchEnabled: settings.fanficPatchEnabled,
        providerInfo: {
            requestedMode: settings.summaryGenerationMode,
            resolvedMode,
            fallbackUsed: !!response.providerFallbackUsed,
            fallbackReason: response.providerFallbackReason || "",
            model: resolvedModel,
        },
        createdAt: Date.now(),
    };
}

function applySummaryFilters(text, rules) {
    let result = String(text || "");

    for (const rule of rules) {
        const parsedPair = parsePairedRule(rule);
        if (parsedPair) {
            result = removePairedBlocks(result, parsedPair.start, parsedPair.end);
            continue;
        }

        const fragment = String(rule || "").trim();
        if (!fragment) {
            continue;
        }

        const keywordPairRules = expandKeywordRule(fragment);
        if (keywordPairRules.length) {
            for (const pair of keywordPairRules) {
                result = removePairedBlocks(result, pair.start, pair.end);
            }
            continue;
        }

        result = result.split(fragment).join("");
    }
    return result.trim();
}

function parsePairedRule(rule) {
    const text = String(rule || "").trim();
    if (!text) {
        return null;
    }

    const separator = text.includes("=>") ? "=>" : text.includes(">>>") ? ">>>" : null;
    if (!separator) {
        return null;
    }

    const parts = text.split(separator).map((item) => item.trim()).filter(Boolean);
    if (parts.length !== 2) {
        return null;
    }

    return {
        start: parts[0],
        end: parts[1],
    };
}

function expandKeywordRule(rule) {
    const keyword = String(rule || "").trim().toLowerCase();
    if (!keyword) {
        return [];
    }

    if (keyword === "think") {
        return [
            { start: "<think>", end: "</think>" },
            { start: "<thinking>", end: "</thinking>" },
        ];
    }

    if (keyword === "comment" || keyword === "注释") {
        return [{ start: "<!--", end: "-->" }];
    }

    if (/^[a-z0-9_-]+$/i.test(keyword)) {
        return [{ start: `<${keyword}>`, end: `</${keyword}>` }];
    }

    return [];
}

function removePairedBlocks(text, startToken, endToken) {
    let result = String(text || "");
    if (!startToken || !endToken) {
        return result;
    }

    while (true) {
        const start = result.indexOf(startToken);
        if (start === -1) {
            break;
        }

        const end = result.indexOf(endToken, start + startToken.length);
        if (end === -1) {
            result = result.slice(0, start);
            break;
        }

        result = result.slice(0, start) + result.slice(end + endToken.length);
    }

    return result;
}
