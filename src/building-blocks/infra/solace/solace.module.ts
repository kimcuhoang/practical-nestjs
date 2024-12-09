import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SolaceModuleSettings } from "./solace.module.settings";
import { MessagePublisherAcknowledgeMode, Session, SolclientFactory, SolclientFactoryProfiles, SolclientFactoryProperties } from "solclientjs";
import { Logger } from "testcontainers/build/common";
import { SolaceProvider } from "./solace.provider";
import { SolaceSubscriber } from "./solace.subscriber";
import { SolacePublisher } from "./solace.publisher";

type SolaceModuleOptions = {
    getSolaceModuleSettings(configService: ConfigService): SolaceModuleSettings;
};

@Global()
@Module({})
export class SolaceModule {
    public static register(options: SolaceModuleOptions): DynamicModule {
        const logger = new Logger(SolaceModule.name);

        const providers: Provider[] = [
            SolaceSubscriber,
            SolacePublisher,
            {
                provide: SolaceModuleSettings,
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    return options.getSolaceModuleSettings(configService);
                }
            },
            {
                provide: Session,
                inject: [SolaceModuleSettings],
                useFactory: (settings: SolaceModuleSettings) => {
                    if (!settings.enabled) {
                        logger.warn("Solace is disabled");
                        return null;
                    }

                    const factoryProps = new SolclientFactoryProperties({
                        profile: SolclientFactoryProfiles.version10,
                        logLevel: settings.getSolaceLogLevel()
                    });

                    return SolclientFactory.init(factoryProps).createSession({
                        url: settings.solaceHost,
                        vpnName: settings.solaceMessageVpn,
                        userName: settings.solaceUsername,
                        password: settings.solacePassword,
                        clientName: settings.clientName,
                        publisherProperties: {
                            enabled: true,
                            acknowledgeMode: MessagePublisherAcknowledgeMode.PER_MESSAGE,
                        }
                    });
                }
            }
        ];


        return {
            module: SolaceModule,
            providers: [
                ...providers,
                SolaceProvider
            ],
            exports: providers
        }
    }
}