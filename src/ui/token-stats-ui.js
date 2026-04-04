const integerFormatter = new Intl.NumberFormat();
const percentFormatter = new Intl.NumberFormat(undefined, {
    style: "percent",
    maximumFractionDigits: 1,
});

export function formatTokenValue(value, t) {
    return Number.isFinite(value)
        ? integerFormatter.format(value)
        : t("token.notAvailable");
}

export function formatBudgetValue(value, t) {
    return value > 0
        ? integerFormatter.format(value)
        : t("token.budgetOff");
}

export function formatContextValue(value, t) {
    return value > 0
        ? integerFormatter.format(value)
        : t("token.notAvailable");
}

export function describeTokenStats(stats, t) {
    if (!stats.available) {
        return {
            text: t("token.counterUnavailable"),
            warning: false,
        };
    }

    const details = [];

    if (stats.contextUsageRatio !== null) {
        details.push(t("token.contextUsage", {
            percent: percentFormatter.format(stats.contextUsageRatio),
        }));
    }

    if (stats.budgetTokens > 0 && stats.budgetUsageRatio !== null) {
        details.push(t("token.budgetUsage", {
            percent: percentFormatter.format(stats.budgetUsageRatio),
        }));
    }

    if (stats.overBudget) {
        details.push(t("token.overBudgetShort", {
            overflow: integerFormatter.format(stats.overflowTokens),
        }));
    } else if (stats.budgetTokens > 0 && Number.isFinite(stats.injectedTokens)) {
        details.push(t("token.withinBudgetShort", {
            remaining: integerFormatter.format(Math.max(0, stats.budgetTokens - stats.injectedTokens)),
        }));
    }

    return {
        text: details.join(" · ") || t("token.counterReady"),
        warning: stats.overBudget,
    };
}
