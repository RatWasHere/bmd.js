/// <reference types="node" />
/// <reference types="node" />
import type Client from "../Client";
import { type ImageFormat, type PrivilegedIntentNames } from "../Constants";
import type { AllowedMentions, AnyChannel, AnyThreadChannel, Component, Embed, EmbedOptions, RawAllowedMentions, RawChannel, RawComponent, RawEmbed, RawEmbedOptions, RawThreadChannel, ToComponentFromRaw, ToRawFromComponent } from "../types/channels";
import type { RawMember, RawSticker, RESTMember, Sticker } from "../types/guilds";
import type { ApplicationCommandOptions, RawApplicationCommandOption } from "../types/applications";
import Member from "../structures/Member";
import type { AnyTextableChannel, CollectionLimitsOptions, GuildEmoji, ModalSubmitComponentsActionRow, RawGuildEmoji, RawMessage, RawModalSubmitComponents, RawModalSubmitComponentsActionRow, ToModalSubmitComponentFromRaw, Uncached, RawBaseEntitlement, ApplicationEmoji, RawApplicationEmoji, MessageComponent, ModalComponent, RawMessageComponent, RawModalComponent, RawModalSubmitComponentsLabel, ModalSubmitComponentsLabel } from "../types";
import Message from "../structures/Message";
import Entitlement from "../structures/Entitlement";
import TestEntitlement from "../structures/TestEntitlement";
import type Poll from "../structures/Poll";
/** A general set of utilities. These are intentionally poorly documented, as they serve almost no usefulness to outside developers. */
export default class Util {
    private _client;
    constructor(client: Client);
    static rawEmbeds(embeds: RawEmbed): Embed;
    static rawEmbeds(embeds: Array<RawEmbed>): Array<Embed>;
    static rawMessageComponents(components: RawMessageComponent): MessageComponent;
    static rawMessageComponents(components: Array<RawMessageComponent>): Array<MessageComponent>;
    static rawModalComponents(components: RawModalComponent): ModalComponent;
    static rawModalComponents(components: Array<RawModalComponent>): Array<ModalComponent>;
    /** @hidden intentionally not documented - this is an internal function */
    _convertImage(image: Buffer | string, name: string): string;
    /** @hidden intended for internal use only */
    _convertSound(sound: Buffer | string, name: string): string;
    /** @internal */
    _freeze<T>(obj: T, detail?: string): T;
    /** @hidden intended for internal use only */
    _getLimit(name: Exclude<keyof CollectionLimitsOptions, "users">, id?: string): number;
    /** @hidden intended for internal use only */
    _isModuleInstalled(name: string): boolean;
    _setLimit(values?: Record<string, number> | number, defaultValue?: number): Record<string, number> | number;
    componentToParsed<T extends RawComponent>(component: T): ToComponentFromRaw<T>;
    componentToRaw<T extends Component>(component: T): ToRawFromComponent<T>;
    componentsToParsed<T extends RawMessageComponent | RawModalComponent>(components: Array<T>): Array<T extends RawMessageComponent ? MessageComponent : T extends RawModalComponent ? ModalComponent : never>;
    componentsToRaw<T extends MessageComponent | ModalComponent>(components: Array<T>): Array<T extends MessageComponent ? RawMessageComponent : T extends ModalComponent ? RawModalComponent : never>;
    convertApplicationEmoji(raw: RawApplicationEmoji): ApplicationEmoji;
    convertGuildEmoji(raw: RawGuildEmoji): GuildEmoji;
    convertImage(img: Buffer | string): string;
    convertSound(audio: Buffer | string): string;
    convertSticker(raw: RawSticker): Sticker;
    detectMissingPrivilegedIntents(intents?: number): Promise<Array<PrivilegedIntentNames>>;
    embedsToParsed(embeds: Array<RawEmbed>): Array<Embed>;
    embedsToRaw(embeds: Array<EmbedOptions>): Array<RawEmbedOptions>;
    formatAllowedMentions(allowed?: AllowedMentions | null): RawAllowedMentions;
    formatImage(url: string, format?: ImageFormat, size?: number): string;
    getMagic(file: Buffer, len?: number): string;
    modalSubmitComponentToParsed<T extends RawModalSubmitComponents>(component: T): ToModalSubmitComponentFromRaw<T>;
    modalSubmitComponentsToParsed<T extends RawModalSubmitComponentsActionRow | RawModalSubmitComponentsLabel>(components: Array<T>): Array<ModalSubmitComponentsActionRow | ModalSubmitComponentsLabel>;
    optionToParsed(option: RawApplicationCommandOption): ApplicationCommandOptions;
    optionToRaw(option: ApplicationCommandOptions): RawApplicationCommandOption;
    /** @internal */
    replacePollAnswer(poll: Poll, answerID: number, count: number, users?: Array<string>): void;
    updateChannel<T extends AnyChannel>(channelData: RawChannel): T;
    /** @internal */
    updateEntitlement<T extends Entitlement | TestEntitlement = Entitlement | TestEntitlement>(data: RawBaseEntitlement): T;
    /** @internal */
    updateMember(guildID: string, memberID: string, member: RawMember | RESTMember): Member;
    /** @internal */
    updateMessage<T extends AnyTextableChannel | Uncached>(data: RawMessage): Message<T>;
    /** @internal */
    updatePollAnswer(poll: Poll, answerID: number, count: number, user?: string): void;
    /** @internal */
    updateThread<T extends AnyThreadChannel>(threadData: RawThreadChannel): T;
}
