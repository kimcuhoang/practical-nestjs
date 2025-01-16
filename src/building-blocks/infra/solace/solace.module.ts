import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SolaceModuleSettings } from "./solace.module.settings";
import { MessagePublisherAcknowledgeMode, SessionProperties, SolclientFactory, SolclientFactoryProfiles, SolclientFactoryProperties } from "solclientjs";
import { Logger } from "testcontainers/build/common";
import { SolaceSubscriber } from "./solace.subscriber";
import { SolacePublisher } from "./solace.publisher";
import { SolaceProvider } from "./solace.provider";

@Global()
@Module({})
export class SolaceModule {
    public static register(configure: (configService: ConfigService) => SolaceModuleSettings): DynamicModule {

        const logger = new Logger(SolaceModule.name);

        const providers: Provider[] = [
            SolaceProvider,
            SolaceSubscriber,
            SolacePublisher,
            {
                provide: SolaceModuleSettings,
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    return configure(configService);
                }
            },
            {
                provide: SessionProperties,
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

                    SolclientFactory.init(factoryProps);

                    return new SessionProperties({
                        url: settings.solaceHost,
                        vpnName: settings.solaceMessageVpn,
                        userName: settings.solaceUsername,
                        password: settings.solacePassword,
                        clientName: settings.clientName,
                        applicationDescription: settings.clientName,
                        generateSendTimestamps: true,
                        generateReceiveTimestamps: true,
                        includeSenderId: true,
                        noLocal: true,
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
            ],
            exports: providers
        }
    }
}