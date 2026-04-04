import {
    appendApprovedSummary,
    clearInactiveDrafts,
    getDraft,
    getLatestActiveDraft,
    updateDraftStatus,
} from "../state/chat-segment-store.js";

export function getCurrentDraft() {
    return getLatestActiveDraft();
}

export function approveDraft(draftId = null) {
    const draft = draftId ? getDraft(draftId) : getLatestActiveDraft();
    if (!draft) {
        throw new Error("No active draft found.");
    }

    if (draft.status !== "draft") {
        throw new Error("Draft is not in approvable state.");
    }

    const cumulativeSummary = appendApprovedSummary(draft.response.archiveSummary, {
        startMes: draft.range.startMes,
        endMes: draft.range.endMes,
        sourceHash: draft.sourceHash,
    });
    updateDraftStatus(draft.id, "approved");
    clearInactiveDrafts();
    return {
        range: draft.range,
        cumulativeSummary,
        approvedAt: Date.now(),
    };
}

export function rejectDraft(draftId = null) {
    const draft = draftId ? getDraft(draftId) : getLatestActiveDraft();
    if (!draft) {
        throw new Error("No active draft found.");
    }

    updateDraftStatus(draft.id, "rejected");
    clearInactiveDrafts();
    return draft;
}
