import { getChatMessages } from "../core/context.js";
import { getPendingRanges } from "./range-state-service.js";

export function getSuggestedDraftRange(defaultRangeSize = 20) {
    const pendingRanges = getPendingRanges();
    const messages = getChatMessages();
    const safeSize = Math.max(1, Number(defaultRangeSize) || 20);

    if (pendingRanges.length) {
        const firstPending = pendingRanges[0];
        const startMes = firstPending.start;
        const endMes = Math.min(firstPending.end, startMes + safeSize - 1);
        return {
            startMes,
            endMes,
            startFloor: startMes + 1,
            endFloor: endMes + 1,
        };
    }

    if (!messages.length) {
        return {
            startMes: 0,
            endMes: 0,
            startFloor: 1,
            endFloor: 1,
        };
    }

    const startMes = Math.max(0, messages.length - safeSize);
    const endMes = messages.length - 1;
    return {
        startMes,
        endMes,
        startFloor: startMes + 1,
        endFloor: endMes + 1,
    };
}
