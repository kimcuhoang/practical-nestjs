import { Injectable } from "@nestjs/common";
import { LogLevel } from "solclientjs";

@Injectable()
export class SolaceQueueOptions {
    enabled: boolean;
    logLevel: string;
    clientName: string;
    solaceHost: string;
    solaceMessageVpn: string;
    solaceUsername: string;
    solacePassword: string;
    acknowledgeMessage: boolean;
    messageConsumerWindowSize?: number;

    constructor(settings: Partial<SolaceQueueOptions>){
        Object.assign(this, settings);
    }

    public getSolaceLogLevel() : LogLevel {
        return LogLevel[this.logLevel as keyof typeof LogLevel] ?? LogLevel.ERROR
    }
}