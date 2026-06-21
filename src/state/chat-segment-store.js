import { saveMetadataDebounced } from "/scripts/extensions.js";
import { ensureChatStore } from "../core/context.js";

const runtimeDrafts = [];

export function listDrafts() {
    return runtimeDrafts;
}

export function getDraft(draftId) {
    return listDrafts().find((draft) => draft.id === draftId) || null;
}

export function getLatestActiveDraft() {
    return listDrafts()
        .filter((draft) => draft.status === "draft")
        .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))[0] || null;
}

export function saveDraftSegment(draft) {
    const index = runtimeDrafts.findIndex((item) => item.id === draft.id);

    if (index === -1) {
        runtimeDrafts.push(draft);
    } else {
        runtimeDrafts[index] = draft;
    }

    return draft;
}

export function updateDraftStatus(draftId, status) {
    const draft = getDraft(draftId);
    if (!draft) {
        return null;
    }

    draft.status = status;
    draft.updatedAt = Date.now();
    return draft;
}

export function clearInactiveDrafts() {
    for (let index = runtimeDrafts.length - 1; index >= 0; index--) {
        if (runtimeDrafts[index].status !== "draft") {
            runtimeDrafts.splice(index, 1);
        }
    }
}

export function getCumulativeSummary() {
    const store = ensureChatStore();
    store.cumulativeSummary ||= "";
    return store.cumulativeSummary;
}

export function getApprovedBaselineSummary() {
    const store = ensureChatStore();
    store.approvedBaselineSummary ||= "";
    return store.approvedBaselineSummary;
}

export function saveCumulativeSummary(text) {
    const store = ensureChatStore();
    store.cumulativeSummary = String(text || "").trim();
    store.updatedAt = Date.now();
    saveMetadataDebounced();
    return store.cumulativeSummary;
}

export function resetCumulativeSummaryToBaseline() {
    const store = ensureChatStore();
    store.cumulativeSummary = store.approvedBaselineSummary || "";
    store.approvedRanges = structuredClone(store.approvedBaselineRanges || []);
    store.updatedAt = Date.now();
    saveMetadataDebounced();
    return store.cumulativeSummary;
}

export function clearAllApprovedSummaries() {
    const store = ensureChatStore();
    store.cumulativeSummary = "";
    store.approvedBaselineSummary = "";
    store.approvedRanges = [];
    store.approvedBaselineRanges = [];
    store.updatedAt = Date.now();
    saveMetadataDebounced();
}

export function listApprovedRanges() {
    const store = ensureChatStore();
    store.approvedRanges ||= [];
    return store.approvedRanges;
}

export function overwriteApprovedRanges(ranges, { updateBaseline = false } = {}) {
    const store = ensureChatStore();
    store.approvedRanges = structuredClone(ranges || []);
    if (updateBaseline) {
        store.approvedBaselineRanges = structuredClone(store.approvedRanges);
    }
    store.updatedAt = Date.now();
    saveMetadataDebounced();
    return store.approvedRanges;
}

export function appendApprovedSummary(archiveSummary, rangeMeta) {
    const store = ensureChatStore();
    const block = String(archiveSummary || "").trim();
    if (!block) {
        return getCumulativeSummary();
    }

    const nextIndex = (store.approvedRanges?.length || 0) + 1;
    const title = `【第${nextIndex}次总结】(楼 ${Number(rangeMeta.startMes)}-${Number(rangeMeta.endMes)})`;
    const titledBlock = `${title}\n${block}`;
    const current = getCumulativeSummary();
    store.cumulativeSummary = current ? `${current}\n\n${titledBlock}` : titledBlock;
    store.approvedBaselineSummary = store.cumulativeSummary;
    store.approvedRanges ||= [];
    store.approvedRanges.push({
        id: `range_${Date.now()}`,
        index: nextIndex,
        title,
        startMes: rangeMeta.startMes,
        endMes: rangeMeta.endMes,
        sourceHash: rangeMeta.sourceHash,
        changed: false,
        approvedAt: Date.now(),
    });
    store.approvedBaselineRanges = structuredClone(store.approvedRanges);
    store.updatedAt = Date.now();
    saveMetadataDebounced();
    return store.cumulativeSummary;
}

export function markApprovedRangeChanged(rangeId) {
    const range = listApprovedRanges().find((item) => item.id === rangeId);
    if (!range) {
        return null;
    }

    range.changed = true;
    saveMetadataDebounced();
    return range;
}

export function clearApprovedRangeChanged(rangeId) {
    const range = listApprovedRanges().find((item) => item.id === rangeId);
    if (!range) {
        return null;
    }

    range.changed = false;
    saveMetadataDebounced();
    return range;
}
