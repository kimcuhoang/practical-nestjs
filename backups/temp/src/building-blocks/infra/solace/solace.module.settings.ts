import { Injectable } from "@nestjs/common";
import { LogLevel } from "solclientjs";


@Injectable()
export class SolaceModuleSettings {
    enabled: boolean;
    logLevel: string;
    clientName: string;
    solaceHost: string;
    solaceMessageVpn: string;
    solaceUsername: string;
    solacePassword: string;
    acknowledgeMessage: boolean;

    constructor(settings: Partial<SolaceModuleSettings>){
        Object.assign(this, settings);
    }

    public getSolaceLogLevel() : LogLevel {
        return LogLevel[this.logLevel as keyof typeof LogLevel] ?? LogLevel.ERROR
    }
}