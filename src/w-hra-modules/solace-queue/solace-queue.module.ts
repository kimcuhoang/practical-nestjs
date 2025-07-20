import { DynamicModule, Module, Provider } from "@nestjs/common";
import { SolaceQueueSubscriber } from "./operators/solace-queue.subscriber";
import { SolaceQueuePublisher } from "./operators/solace-queue.publisher";
import { SolaceQueueOptions } from "./solace-queue.options";
import { ConfigService } from "@nestjs/config";
import { MessagePublisherAcknowledgeMode, Session, SessionProperties, SolclientFactory, SolclientFactoryProfiles, SolclientFactoryProperties } from "solclientjs";
import { SolaceQueueProvider } from "./solace-queue.provider";

export type SolaceQueueModuleSettings = {
    additionalProviders?: Provider[];
}

@Module({})
export class SolaceQueueModule {
    public static forRoot(settings?: SolaceQueueModuleSettings): DynamicModule {

        const providers: Provider[] = [
            ...settings?.additionalProviders || [],
            SolaceQueueProvider,
            SolaceQueueSubscriber,
            SolaceQueuePublisher,
            {
                provide: SolaceQueueOptions,
                inject: [ ConfigService ],
                useFactory: (configService: ConfigService) => {
                    const defaultWindowSize = 255;
                    const windowSize = parseInt(configService.get("SOLACE_MESSAGE_WINDOW_SIZE")) || defaultWindowSize;
                   
                    return new SolaceQueueOptions({
                        enabled: configService.get("SOLACE_ENABLED")?.toLowerCase() === "true",
                        logLevel: configService.get("SOLACE_LOG_LEVEL"),
                        clientName: configService.get("SOLACE_CLIENT_NAME"),
                        solaceHost: configService.get("SOLACE_HOST"),
                        solaceMessageVpn: configService.get("SOLACE_MESSAGE_VPN"),
                        solaceUsername: configService.get("SOLACE_USERNAME"),
                        solacePassword: configService.get("SOLACE_PASSWORD"),
                        acknowledgeMessage: configService.get("SOLACE_ACKNOWLEDGE_MESSAGE")?.toLowerCase() === "true",
                        messageConsumerWindowSize: windowSize === 0 ? defaultWindowSize : windowSize
                    });
                }
            },  
            {
                provide: Session,
                inject: [SolaceQueueOptions],
                useFactory: (solaceQueueOptions: SolaceQueueOptions) => {

                    if (!solaceQueueOptions.enabled) {
                        return null;
                    }

                    const factoryProps = new SolclientFactoryProperties({
                        profile: SolclientFactoryProfiles.version10,
                        logLevel: solaceQueueOptions.getSolaceLogLevel()
                    });

                    SolclientFactory.init(factoryProps);

                    const sessionProperties = new SessionProperties({
                        url: solaceQueueOptions.solaceHost,
                        vpnName: solaceQueueOptions.solaceMessageVpn,
                        userName: solaceQueueOptions.solaceUsername,
                        password: solaceQueueOptions.solacePassword,
                        // clientName: `${options.clientName}-${process.getgid()}`,
                        applicationDescription: solaceQueueOptions.clientName,
                        generateSendTimestamps: true,
                        generateReceiveTimestamps: true,
                        includeSenderId: true,
                        publisherProperties: {
                            enabled: true,
                            acknowledgeMode: MessagePublisherAcknowledgeMode.PER_MESSAGE,
                        }
                    });

                    return SolclientFactory.createSession(sessionProperties);
                }
            }
        ];

        return {
            module: SolaceQueueModule,
            providers: [ ...providers ]
        } as DynamicModule;
    }
}