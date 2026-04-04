const integerFormatter = new Intl.NumberFormat();

export function formatTokenValue(value, t) {
    return Number.isFinite(value)
        ? integerFormatter.format(value)
        : t("token.notAvailable");
}

export function describeTokenStats(stats, t) {
    if (!stats.available || !Number.isFinite(stats.summaryTokens)) {
        return t("token.counterUnavailable");
    }

    return t("token.counterReady");
}
