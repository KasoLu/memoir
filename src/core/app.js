import { eventSource, event_types } from "/script.js";
import { initializeI18n } from "../i18n.js";
import { loadSettings } from "../state/settings-store.js";
import { buildAndMountPanel } from "../ui/panel.js";
import { mountSettingsUi } from "../ui/settings-ui.js";
import { syncInjectionPrompt } from "../services/injection-service.js";
import { syncSegmentStaleState } from "../services/stale-detection-service.js";
import { refreshStatusPanel } from "../ui/status-panel.js";
import { refreshSegmentsPanel } from "../ui/segments-panel.js";
import { registerLauncher } from "../ui/launcher.js";
import { fillSuggestedDraftRange } from "../ui/draft-panel.js";
import { debounce } from "../utils.js";

let initialized = false;

export async function initializeApp() {
    if (initialized) {
        return;
    }

    await initializeI18n();
    loadSettings();
    buildAndMountPanel();
    await registerLauncher();
    mountSettingsUi();
    registerEventHandlers();

    await syncInjectionPrompt();
    refreshStatusPanel();
    refreshSegmentsPanel();
    fillSuggestedDraftRange();

    initialized = true;
}

function registerEventHandlers() {
    const debouncedChatChanged = debounce(handleChatChanged, 300);
    eventSource.on(event_types.CHAT_CHANGED, debouncedChatChanged);
    eventSource.on(event_types.MESSAGE_DELETED, debouncedChatChanged);
    eventSource.on(event_types.MESSAGE_UPDATED, debouncedChatChanged);
    eventSource.on(event_types.MESSAGE_SWIPED, debouncedChatChanged);
}

async function handleChatChanged() {
    try { await syncSegmentStaleState(); } catch (_) {}
    try { await syncInjectionPrompt(); } catch (_) {}
    refreshStatusPanel();
    refreshSegmentsPanel();
    fillSuggestedDraftRange();
}
