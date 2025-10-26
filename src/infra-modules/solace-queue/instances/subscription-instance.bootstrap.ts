import { SolaceReplayRequest } from "./solace-replay.request";


export const SubscriptionInstanceBootstrapsSymbol = Symbol("SubscriptionInstanceBootstrap");

export interface ISubscriptionInstanceBootstrap {
    bootstrap(): Promise<void>;
    startLiveMode(): Promise<void>;
    startReplayMode(replayRequest?: SolaceReplayRequest): Promise<void>;
}