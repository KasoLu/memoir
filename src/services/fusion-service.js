import { getSettings } from "../state/settings-store.js";
import { DEFAULT_SETTINGS } from "../state/defaults.js";
import {
    getCumulativeSummary,
    overwriteApprovedRanges,
    saveCumulativeSummary,
} from "../state/chat-segment-store.js";
import { runSummaryProvider } from "./provider-router.js";

export async function runFusionCompression({ startIndex = null, endIndex = null } = {}) {
    const current = getCumulativeSummary().trim();
    if (!current) {
        throw new Error("当前没有可融合压缩的累计总结正文。");
    }

    const blocks = splitSummaryBlocks(current);
    if (!blocks.length) {
        throw new Error("当前累计总结正文里没有可识别的总结块。");
    }

    const start = normalizeIndex(startIndex, 1);
    const end = normalizeIndex(endIndex, blocks.length);

    if (start > end) {
        throw new Error("融合范围无效：起始总结序号不能大于结束总结序号。");
    }

    const targetBlocks = blocks.slice(start - 1, end);
    const before = blocks.slice(0, start - 1);
    const after = blocks.slice(end);

    const settings = getSettings();
    const systemPrompt = settings.fusionSystemPrompt || DEFAULT_SETTINGS.fusionSystemPrompt;
    const userPrompt = (settings.fusionUserTemplate || DEFAULT_SETTINGS.fusionUserTemplate).replaceAll(
        "{{selected_blocks}}",
        targetBlocks.map((block) => block.fullText).join("\n\n"),
    );

    const providerRequest = {
        promptBundle: { systemPrompt, userPrompt },
        maxTokens: Number(settings.fusionResponseLength) > 0 ? Number(settings.fusionResponseLength) : 0,
    };

    const response = await runSummaryProvider(providerRequest, settings);
    const finalBody = String(response.archiveSummary || "").trim();

    if (!finalBody) {
        throw new Error("融合压缩返回为空。");
    }

    const mergedRange = {
        startFloor: Math.min(...targetBlocks.map((block) => block.startFloor ?? Number.MAX_SAFE_INTEGER)),
        endFloor: Math.max(...targetBlocks.map((block) => block.endFloor ?? 0)),
    };

    const rebuilt = [
        ...before,
        {
            fullText: "",
            startFloor: mergedRange.startFloor,
            endFloor: mergedRange.endFloor,
            body: finalBody,
        },
        ...after,
    ];

    const renumbered = rebuilt.map((block, index) => buildNumberedBlock(index + 1, block.startFloor, block.endFloor, block.body));
    const finalText = renumbered.join("\n\n").trim();
    const rebuiltRanges = rebuilt.map((block, index) => ({
        id: `range_rebuilt_${Date.now()}_${index}`,
        index: index + 1,
        title: `【第${index + 1}次总结】(楼 ${block.startFloor}-${block.endFloor})`,
        startMes: Math.max(0, (block.startFloor || 1) - 1),
        endMes: Math.max(0, (block.endFloor || 1) - 1),
        sourceHash: "",
        changed: false,
        approvedAt: Date.now(),
    }));

    saveCumulativeSummary(finalText);
    overwriteApprovedRanges(rebuiltRanges, { updateBaseline: false });
    return finalText;
}

function splitSummaryBlocks(text) {
    const lines = String(text || "").trim().split("\n");
    const blocks = [];
    let current = null;

    for (const rawLine of lines) {
        const line = rawLine ?? "";
        const match = line.match(/^【(?:第(\d+)次总结|融合总结)】\(楼\s*(\d+)-(\d+)(?:[^)]*)\)$/);
        if (match) {
            if (current) {
                current.fullText = [current.title, current.body].filter(Boolean).join("\n").trim();
                blocks.push(current);
            }
            current = {
                title: line.trim(),
                startFloor: Number(match[2]),
                endFloor: Number(match[3]),
                body: "",
                fullText: "",
            };
            continue;
        }

        if (!current) {
            current = {
                title: "",
                startFloor: 1,
                endFloor: 1,
                body: line,
                fullText: "",
            };
        } else {
            current.body = current.body ? `${current.body}\n${line}` : line;
        }
    }

    if (current) {
        current.fullText = [current.title, current.body].filter(Boolean).join("\n").trim();
        blocks.push(current);
    }

    return blocks.filter((block) => block.fullText.trim());
}

function buildNumberedBlock(index, startFloor, endFloor, body) {
    return `【第${index}次总结】(楼 ${startFloor}-${endFloor})\n${String(body || "").trim()}`.trim();
}

function normalizeIndex(value, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
        return fallback;
    }
    return Math.floor(numeric);
}
