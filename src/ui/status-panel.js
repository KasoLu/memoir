import { t } from "../i18n.js";
import { getCurrentChatId, getChatMessages } from "../core/context.js";
import { getSettings, isIndependentApiConfigured } from "../state/settings-store.js";
import {
    getLatestActiveDraft,
    listApprovedRanges,
    listDrafts,
} from "../state/chat-segment-store.js";
import {
    formatRanges,
    getChangedRanges,
    getHiddenRanges,
    getPendingRanges,
    getSummarizedRanges,
} from "../services/range-state-service.js";

export function refreshStatusPanel() {
    const box = document.getElementById("cc-status-box");
    if (!box) {
        return;
    }

    const settings = getSettings();
    const ranges = listApprovedRanges();
    const drafts = listDrafts();
    const activeDraft = getLatestActiveDraft();
    const approved = ranges.length;
    const changed = ranges.filter((r) => r.changed).length;
    const ready = isIndependentApiConfigured(settings);

    const chatId = getCurrentChatId() || t("status.chatIdNone");
    const msgCount = getChatMessages().length;

    const summarized = formatRanges(getSummarizedRanges());
    const hidden = formatRanges(getHiddenRanges());
    const pending = formatRanges(getPendingRanges());
    const changedFloors = formatRanges(getChangedRanges());

    box.innerHTML = `
      <div class="cc-status-grid">
        <div class="cc-status-section">
          <div class="cc-status-heading">${t("status.chatId")}</div>
          <div class="cc-status-row"><span>${t("status.chatId")}</span><strong>${esc(chatId)}</strong></div>
          <div class="cc-status-row"><span>${t("status.messageCount")}</span><strong>${msgCount}</strong></div>
          <div class="cc-status-row"><span>${t("status.draftCount")}</span><strong>${drafts.length}</strong></div>
          <div class="cc-status-row"><span>${t("status.activeDraft")}</span><strong>${esc(activeDraft ? activeDraft.id.slice(-8) : t("status.activeDraftNone"))}</strong></div>
        </div>
        <div class="cc-status-section">
          <div class="cc-status-heading">${t("status.approvedCount")}</div>
          <div class="cc-status-row"><span>${t("status.approvedCount")}</span><strong>${approved}</strong></div>
          <div class="cc-status-row"><span>${t("status.changedCount")}</span><strong>${changed}</strong></div>
          <div class="cc-status-row"><span>${t("status.autoInject")}</span><strong class="${settings.autoInjectApproved ? "cc-status-on" : ""}">${settings.autoInjectApproved ? t("status.on") : t("status.off")}</strong></div>
        </div>
        <div class="cc-status-section">
          <div class="cc-status-heading">${t("status.providerMode")}</div>
          <div class="cc-status-row"><span>${t("status.providerMode")}</span><strong>${settings.summaryGenerationMode}</strong></div>
          <div class="cc-status-row"><span>${t("status.independentReady")}</span><strong class="${ready ? "cc-status-on" : ""}">${ready ? t("status.yes") : t("status.no")}</strong></div>
          <div class="cc-status-row"><span>${t("status.promptProfile")}</span><strong>${esc(settings.promptProfileId)}</strong></div>
          <div class="cc-status-row"><span>${t("status.stylePatch")}</span><strong>${esc(settings.stylePatchId)}</strong></div>
          <div class="cc-status-row"><span>${t("status.contentCompatibilityPatch")}</span><strong class="${settings.contentCompatibilityPatchEnabled ? "cc-status-on" : ""}">${settings.contentCompatibilityPatchEnabled ? t("status.on") : t("status.off")}</strong></div>
        </div>
      </div>
      <div class="cc-status-floors">
        ${floorStatusItem(t("status.summarizedFloors"), summarized)}
        ${floorStatusItem(t("status.hiddenFloors"), hidden)}
        ${floorStatusItem(t("status.pendingFloors"), pending)}
        ${floorStatusItem(t("status.changedFloors"), changedFloors, { danger: changedFloors !== "(none)" })}
      </div>`;
}

function floorStatusItem(label, value, { danger = false } = {}) {
    const empty = value === "(none)";
    const valueClass = [
        "cc-status-floor-value",
        empty ? "cc-status-floor-empty" : "cc-status-floor-range",
        danger ? "cc-status-floor-danger" : "",
    ].filter(Boolean).join(" ");
    return `<div class="cc-status-floor-item"><span>${esc(label)}</span><span class="${valueClass}">${esc(value)}</span></div>`;
}

function esc(s) {
    return String(s || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
