/** @module CommandInteraction */
import Interaction from "./Interaction";
import Member from "./Member";
import Message from "./Message";
import User from "./User";
import type Guild from "./Guild";
import Permission from "./Permission";
import type PrivateChannel from "./PrivateChannel";
import type Entitlement from "./Entitlement";
import type TestEntitlement from "./TestEntitlement";
import { ApplicationCommandTypes, type InteractionTypes, type InteractionContextTypes } from "../Constants";
import type { ApplicationCommandInteractionData, InteractionContent, ModalData, RawApplicationCommandInteraction, InteractionGuild, AuthorizingIntegrationOwners, EditInteractionContent, InteractionCallbackResponse } from "../types/interactions";
import type Client from "../Client";
import type { AnyTextableGuildChannel, AnyInteractionChannel } from "../types/channels";
import type { JSONCommandInteraction } from "../types/json";
import type { Uncached } from "../types/shared";
import MessageInteractionResponse, { type FollowupMessageInteractionResponse, type InitialMessagedInteractionResponse } from "../util/interactions/MessageInteractionResponse";
/** Represents a command interaction. */
export default class CommandInteraction<T extends AnyInteractionChannel | Uncached = AnyInteractionChannel | Uncached, C extends ApplicationCommandTypes = ApplicationCommandTypes> extends Interaction {
    private _cachedChannel;
    private _cachedGuild?;
    /** The permissions the bot has in the channel this interaction was sent from. If in a dm/group dm, this will contain `ATTACH_FILES`, `EMBED_LINKS`, and `MENTION_EVERYONE`. In addition, `USE_EXTERNAL_EMOJIS` will be included for DMs with the app's bot user. */
    appPermissions: Permission;
    /** The maximum size limit per attachment. This will be 10MiB by default, unless the user that created this interaction has a Nitro subscription or the guild it was sent from has been boosted to level 2 or above. */
    attachmentSizeLimit: number;
    /** Details about the authorizing user or server for the installation(s) relevant to the interaction. See [Discord's docs](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-authorizing-integration-owners-object) for more information. */
    authorizingIntegrationOwners: AuthorizingIntegrationOwners;
    /** The ID of the channel this interaction was sent from. */
    channelID: string;
    /** The context this interaction was sent from. */
    context?: InteractionContextTypes;
    /** The data associated with the interaction. */
    data: ApplicationCommandInteractionData<T, C>;
    /** The entitlements for the user that created this interaction, and the guild it was created in. */
    entitlements: Array<Entitlement | TestEntitlement>;
    /** The id of the guild this interaction was sent from, if applicable. */
    guildID: T extends AnyTextableGuildChannel ? string : string | null;
    /** The preferred [locale](https://discord.com/developers/docs/reference#locales) of the guild this interaction was sent from, if applicable. */
    guildLocale: T extends AnyTextableGuildChannel ? string : string | undefined;
    /** The partial guild this interaction was sent from, if applicable. */
    guildPartial?: T extends AnyTextableGuildChannel ? InteractionGuild : InteractionGuild | undefined;
    /** The [locale](https://discord.com/developers/docs/reference#locales) of the invoking user. */
    locale: string;
    /** The member associated with the invoking user, if this interaction is sent from a guild. */
    member: T extends AnyTextableGuildChannel ? Member : Member | null;
    /** The permissions of the member associated with the invoking user, if this interaction is sent from a guild. */
    memberPermissions: T extends AnyTextableGuildChannel ? Permission : Permission | null;
    type: InteractionTypes.APPLICATION_COMMAND;
    /** The user that invoked this interaction. */
    user: User;
    constructor(data: RawApplicationCommandInteraction, client: Client);
    /** The channel this interaction was sent from. */
    get channel(): T extends AnyInteractionChannel ? T : undefined;
    /** The guild this interaction was sent from, if applicable. This will throw an error if the guild is not cached. */
    get guild(): T extends AnyTextableGuildChannel ? Guild : Guild | null;
    /**
     * Create a followup message.
     * Note that the returned class is not a message. It is a wrapper around the interaction response. The {@link MessageInteractionResponse#getMessage | getMessage} function can be used to get the message.
     * @param options The options for creating the followup message.
     */
    createFollowup(options: InteractionContent): Promise<FollowupMessageInteractionResponse<this>>;
    /**
     * Create a message through this interaction. This is an initial response, and more than one initial response cannot be used. Use {@link CommandInteraction#createFollowup | createFollowup}.
     * Note that the returned class is not a message. It is a wrapper around the interaction response. The {@link MessageInteractionResponse#getMessage | getMessage} function can be used to get the message.
     * @param options The options for the message.
     */
    createMessage(options: InteractionContent): Promise<InitialMessagedInteractionResponse<this>>;
    /**
     * Respond to this interaction with a modal. This is an initial response, and more than one initial response cannot be used.
     * @param options The options for the modal.
     */
    createModal(options: ModalData): Promise<InteractionCallbackResponse<T>>;
    /**
     * Defer this interaction. This is an initial response, and more than one initial response cannot be used.
     * @param flags The [flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags) to respond with.
     */
    defer(flags?: number): Promise<InteractionCallbackResponse<T>>;
    /**
     * Delete a follow-up message.
     * @param messageID The ID of the message.
     */
    deleteFollowup(messageID: string): Promise<void>;
    /**
     * Delete the original interaction response.
     */
    deleteOriginal(): Promise<void>;
    /**
     * Edit a followup message.
     * @param messageID The ID of the message.
     * @param options The options for editing the followup message.
     */
    editFollowup(messageID: string, options: EditInteractionContent): Promise<Message<T>>;
    /**
     * Edit the original interaction response.
     * @param options The options for editing the original message.
     */
    editOriginal(options: EditInteractionContent): Promise<Message<T>>;
    /**
     * Get a followup message.
     * @param messageID The ID of the message.
     */
    getFollowup(messageID: string): Promise<Message<T>>;
    /**
     * Get the original interaction response.
     */
    getOriginal(): Promise<Message<T>>;
    /** Whether this interaction belongs to a cached guild channel. The only difference on using this method over a simple if statement is to easily update all the interaction properties typing definitions based on the channel it belongs to. */
    inCachedGuildChannel(): this is CommandInteraction<AnyTextableGuildChannel>;
    /** Whether this interaction belongs to a private channel (PrivateChannel or uncached). The only difference on using this method over a simple if statement is to easily update all the interaction properties typing definitions based on the channel it belongs to. */
    inPrivateChannel(): this is CommandInteraction<PrivateChannel | Uncached>;
    /** A type guard, checking if this command interaction is a {@link Constants~ApplicationCommandTypes.CHAT_INPUT | Chat Input} command. */
    isChatInputCommand(): this is CommandInteraction<T, ApplicationCommandTypes.CHAT_INPUT>;
    /** A type guard, checking if this command interaction is a {@link Constants~ApplicationCommandTypes.MESSAGE | Message} command. */
    isMessageCommand(): this is CommandInteraction<T, ApplicationCommandTypes.MESSAGE>;
    /** A type guard, checking if this command interaction is a {@link Constants~ApplicationCommandTypes.PRIMARY_ENTRY_POINT | Primary Entry Point} command. */
    isPrimaryEntryPointCommand(): this is CommandInteraction<T, ApplicationCommandTypes.PRIMARY_ENTRY_POINT>;
    /** A type guard, checking if this command interaction is a {@link Constants~ApplicationCommandTypes.USER | User} command. */
    isUserCommand(): this is CommandInteraction<T, ApplicationCommandTypes.USER>;
    /**
     * Launch the bot's activity. This is an initial response, and more than one initial response cannot be used.
     */
    launchActivity(): Promise<InteractionCallbackResponse<T>>;
    /**
     * Show a "premium required" response to the user. This is an initial response, and more than one initial response cannot be used.
     * @deprecated The {@link Constants~InteractionResponseTypes.PREMIUM_REQUIRED | PREMIUM_REQUIRED} interaction response type is now deprecated in favor of using {@link Types/Channels~PremiumButton | custom premium buttons}.
     */
    premiumRequired(): Promise<InteractionCallbackResponse<T>>;
    /**
     * Reply to this interaction. If the interaction hasn't been acknowledged, {@link CommandInteraction#createMessage | createMessage} is used. Else, {@link CommandInteraction#createFollowup | createFollowup} is used.
     * Note that the returned class is not a message. It is a wrapper around the interaction response. The {@link MessageInteractionResponse#getMessage | getMessage} function can be used to get the message.
     * @param options The options for the message.
     */
    reply(options: InteractionContent): Promise<MessageInteractionResponse<this>>;
    toJSON(): JSONCommandInteraction;
}
