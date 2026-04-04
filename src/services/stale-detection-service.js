import { getChatRange } from "../core/context.js";
import {
    clearApprovedRangeChanged,
    listApprovedRanges,
    markApprovedRangeChanged,
} from "../state/chat-segment-store.js";
import { hashMessageRange } from "./segment-hash-service.js";

export async function syncSegmentStaleState() {
    const ranges = listApprovedRanges();

    for (const range of ranges) {
        const currentMessages = getChatRange(range.startMes, range.endMes);
        if (!currentMessages.length) {
            markApprovedRangeChanged(range.id);
            continue;
        }

        const currentHash = await hashMessageRange(currentMessages);
        if (currentHash !== range.sourceHash) {
            markApprovedRangeChanged(range.id);
            continue;
        }

        if (range.changed) {
            clearApprovedRangeChanged(range.id);
        }
    }
}
