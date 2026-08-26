export type OperatorCacheProfile = {
    operator: string;
    cacheKeyTemplate: string;
    timeToLiveInMinutes: number;
};

export type ObjectCacheProfiles = {
    objectName: string;
    profiles: OperatorCacheProfile[];
}