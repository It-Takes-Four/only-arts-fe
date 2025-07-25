const getEnvData = (variableName: string) => {
    return import.meta.env[variableName];
}

const isEnvEnable = (variableName: string) => {
    const envValue = getEnvData(variableName);
    // Assuming that the environment variable is considered enabled if it exists and is truthy
    return envValue !== undefined && envValue !== null && envValue !== 'false' && envValue !== '0';
};

export {getEnvData, isEnvEnable}