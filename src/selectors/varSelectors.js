export const selectPositionContributions = (state) => {
    const pos = state.var.result?.attribution?.positions ?? {};

    return Object.entries(pos)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
};

export const selectFactorContributions = (state) => {
    const fac = state.var.result?.attribution?.factors ?? {};

    return Object.entries(fac)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
};

export const selectTopRiskDrivers = (state, n = 5) => {
    return selectPositionContributions(state).slice(0, n);
};