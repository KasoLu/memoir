import {
    setExtensionPrompt,
    extension_prompt_roles,
    extension_prompt_types,
} from "/script.js";
import { EXTENSION_PROMPT_KEY } from "../constants.js";
import { getSettings } from "../state/settings-store.js";
import { getCumulativeSummary } from "../state/chat-segment-store.js";

export async function syncInjectionPrompt() {
    const settings = getSettings();

    if (!settings.autoInjectApproved) {
        clearInjectionPrompt();
        return;
    }

    let text = getCumulativeSummary().trim();
    if (!text) {
        clearInjectionPrompt();
        return;
    }

    // Wrap with tag if configured
    const tag = String(settings.injectionWrapTag || "").trim();
    if (tag) {
        text = `<${tag}>\n${text}\n</${tag}>`;
    }

    const position = settings.injectionPosition ?? extension_prompt_types.IN_PROMPT;
    const depth = settings.injectionDepth ?? 1;
    const role = settings.injectionRole ?? extension_prompt_roles.SYSTEM;

    setExtensionPrompt(
        EXTENSION_PROMPT_KEY,
        text,
        position,
        depth,
        false,
        role,
    );
}

export function clearInjectionPrompt() {
    setExtensionPrompt(
        EXTENSION_PROMPT_KEY,
        "",
        extension_prompt_types.IN_PROMPT,
        1,
        false,
        extension_prompt_roles.SYSTEM,
    );
}
