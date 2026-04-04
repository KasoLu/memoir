import { MAIN_ARCHIVE_PROFILE } from "./assets/main-archive-profile.js";
import { FANFIC_PATCH_TEXT } from "./assets/fanfic-patch.js";
import { STYLE_PATCHES, STYLE_PATCH_TEXT } from "./assets/style-patches.js";
import { getSettings } from "../state/settings-store.js";

const BUILT_IN_PROMPT_PROFILES = [MAIN_ARCHIVE_PROFILE];

export { STYLE_PATCHES, STYLE_PATCH_TEXT, FANFIC_PATCH_TEXT };

export function getBuiltInPromptProfiles() {
    return BUILT_IN_PROMPT_PROFILES.map((profile) => ({
        id: profile.id,
        label: profile.label,
        builtIn: true,
    }));
}

export function getCustomPromptProfiles(settings = getSettings()) {
    return (settings.customPromptProfiles || []).map((profile) => ({
        id: profile.id,
        label: profile.label,
        builtIn: false,
    }));
}

export function getPromptProfileOptions(settings = getSettings()) {
    return [
        ...getBuiltInPromptProfiles(),
        ...getCustomPromptProfiles(settings),
    ];
}

export function getPromptProfileById(profileId, settings = getSettings()) {
    const builtIn = BUILT_IN_PROMPT_PROFILES.find((profile) => profile.id === profileId);
    if (builtIn) {
        return { ...builtIn, builtIn: true };
    }

    const custom = (settings.customPromptProfiles || []).find((profile) => profile.id === profileId);
    if (custom) {
        return { ...custom, builtIn: false };
    }

    return { ...MAIN_ARCHIVE_PROFILE, builtIn: true };
}

export function upsertCustomPromptProfile(profileInput, settings = getSettings()) {
    const label = String(profileInput?.label || "").trim();
    const systemPrompt = String(profileInput?.systemPrompt || "").trim();
    const userTemplate = String(profileInput?.userTemplate || "").trim();

    if (!label) {
        throw new Error("Prompt profile name is required.");
    }

    if (!systemPrompt || !userTemplate) {
        throw new Error("Prompt profile must include both system prompt and user template.");
    }

    settings.customPromptProfiles ||= [];

    const patchState = {
        stylePatchId: profileInput.stylePatchId ?? settings.stylePatchId ?? "none",
        fanficPatchEnabled: profileInput.fanficPatchEnabled ?? settings.fanficPatchEnabled ?? false,
    };

    const existing = settings.customPromptProfiles.find((profile) => profile.id === profileInput.id);
    if (existing) {
        existing.label = label;
        existing.systemPrompt = systemPrompt;
        existing.userTemplate = userTemplate;
        existing.stylePatchId = patchState.stylePatchId;
        existing.fanficPatchEnabled = patchState.fanficPatchEnabled;
        settings.promptProfileId = existing.id;
        return existing.id;
    }

    const profile = {
        id: `custom-prompt-${Date.now()}`,
        label,
        systemPrompt,
        userTemplate,
        ...patchState,
    };
    settings.customPromptProfiles.push(profile);
    settings.promptProfileId = profile.id;
    return profile.id;
}

export function deleteCustomPromptProfile(profileId, settings = getSettings()) {
    if (!profileId || BUILT_IN_PROMPT_PROFILES.some((profile) => profile.id === profileId)) {
        return null;
    }

    const profile = (settings.customPromptProfiles || []).find((item) => item.id === profileId) || null;
    settings.customPromptProfiles = (settings.customPromptProfiles || []).filter((item) => item.id !== profileId);

    if (settings.promptProfileId === profileId) {
        settings.promptProfileId = MAIN_ARCHIVE_PROFILE.id;
    }

    return profile;
}

/* ===== Style patch helpers ===== */

export function getAllStylePatchOptions(settings = getSettings()) {
    const builtIn = STYLE_PATCHES.map((p) => ({ id: p.id, label: p.label, builtIn: true }));
    const custom = (settings.customStylePatches || []).map((p) => ({ id: p.id, label: p.label, builtIn: false }));
    return [...builtIn, ...custom];
}

export function getStylePatchText(patchId, settings = getSettings()) {
    const custom = (settings.customStylePatches || []).find((p) => p.id === patchId);
    if (custom) {
        return custom.text || "";
    }
    return STYLE_PATCH_TEXT[patchId] || "";
}

export function upsertCustomStylePatch(input, settings = getSettings()) {
    const label = String(input?.label || "").trim();
    const text = String(input?.text || "").trim();
    if (!label) {
        throw new Error("Style patch name is required.");
    }
    settings.customStylePatches ||= [];
    const existing = settings.customStylePatches.find((p) => p.id === input.id);
    if (existing) {
        existing.label = label;
        existing.text = text;
        return existing.id;
    }
    const patch = { id: `custom-style-${Date.now()}`, label, text };
    settings.customStylePatches.push(patch);
    return patch.id;
}

export function deleteCustomStylePatch(patchId, settings = getSettings()) {
    if (!patchId || STYLE_PATCHES.some((p) => p.id === patchId)) {
        return null;
    }
    const patch = (settings.customStylePatches || []).find((p) => p.id === patchId) || null;
    settings.customStylePatches = (settings.customStylePatches || []).filter((p) => p.id !== patchId);
    if (settings.stylePatchId === patchId) {
        settings.stylePatchId = "none";
    }
    return patch;
}

export function getFanficPatchText(settings = getSettings()) {
    return settings.fanficPatchText || FANFIC_PATCH_TEXT;
}

/* ===== Prompt bundle ===== */

export function buildPromptBundle(settings, range, chatHistoryText) {
    const selectedProfile = getPromptProfileById(settings.promptProfileId, settings);
    const systemParts = [selectedProfile.systemPrompt];

    if (settings.fanficPatchEnabled) {
        systemParts.push(getFanficPatchText(settings));
    }

    const stylePatch = getStylePatchText(settings.stylePatchId, settings);
    if (stylePatch) {
        systemParts.push(stylePatch);
    }

    const userPrompt = selectedProfile.userTemplate
        .replaceAll("{{start_floor}}", String(range.startFloor))
        .replaceAll("{{end_floor}}", String(range.endFloor))
        .replaceAll("{{chat_history}}", chatHistoryText);

    return {
        profileId: selectedProfile.id,
        profileLabel: selectedProfile.label,
        systemPrompt: systemParts.join("\n\n"),
        userPrompt,
    };
}
