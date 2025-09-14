"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/** @module Client */
const RESTManager_1 = tslib_1.__importDefault(require("./rest/RESTManager"));
const TypedCollection_1 = tslib_1.__importDefault(require("./util/TypedCollection"));
const PrivateChannel_1 = tslib_1.__importDefault(require("./structures/PrivateChannel"));
const GroupChannel_1 = tslib_1.__importDefault(require("./structures/GroupChannel"));
const User_1 = tslib_1.__importDefault(require("./structures/User"));
const Guild_1 = tslib_1.__importDefault(require("./structures/Guild"));
const TypedEmitter_1 = tslib_1.__importDefault(require("./util/TypedEmitter"));
const ShardManager_1 = tslib_1.__importDefault(require("./gateway/ShardManager"));
const UnavailableGuild_1 = tslib_1.__importDefault(require("./structures/UnavailableGuild"));
const Util_1 = tslib_1.__importDefault(require("./util/Util"));
const Errors_1 = require("./util/Errors");
const node_util_1 = require("node:util");
// @ts-ignore
let DiscordJSVoice;
try {
    DiscordJSVoice = require("@discordjs/voice");
}
catch { }
/* eslint-enable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, unicorn/prefer-module */
/** The primary class for interfacing with Discord. See {@link ClientEvents | Client Events} for a list of events. */
class Client extends TypedEmitter_1.default {
    _application;
    _user;
    /** A key-value mapping of channel IDs to guild IDs. In most cases, every channel listed here should be cached in their respective guild's {@link Guild#channels | channels collection}. */
    channelGuildMap = new Map();
    groupChannels;
    guildShardMap = new Map();
    guilds;
    options;
    privateChannels;
    ready;
    rest;
    shards;
    startTime = 0;
    /** A key-value mapping of thread IDs to guild IDs. In most cases, every channel listed here should be cached in their respective guild's {@link Guild#threads | threads collection}. */
    threadGuildMap = new Map();
    unavailableGuilds;
    users;
    util;
    voiceAdapters = new Map();
    /**
     * @constructor
     * @param options The options to create the client with.
     */
    constructor(options) {
        super();
        this.util = new Util_1.default(this);
        const disableCache = options?.disableCache === true || options?.disableCache === "no-warning";
        const colZero = {
            auditLogEntries: 0,
            autoModerationRules: 0,
            channels: 0,
            emojis: 0,
            groupChannels: 0,
            guilds: 0,
            guildThreads: 0,
            integrations: 0,
            invites: 0,
            members: 0,
            messages: 0,
            privateChannels: 0,
            roles: 0,
            scheduledEvents: 0,
            soundboardSounds: 0,
            stageInstances: 0,
            stickers: 0,
            unavailableGuilds: 0,
            users: 0,
            voiceMembers: 0,
            voiceStates: 0
        };
        this.options = {
            allowedMentions: options?.allowedMentions ?? {
                everyone: false,
                repliedUser: false,
                users: true,
                roles: true
            },
            auth: options?.auth ?? null,
            collectionLimits: disableCache ? colZero : {
                auditLogEntries: this.util._setLimit(options?.collectionLimits?.auditLogEntries, 50),
                autoModerationRules: this.util._setLimit(options?.collectionLimits?.autoModerationRules, Infinity),
                channels: this.util._setLimit(options?.collectionLimits?.channels, Infinity),
                emojis: this.util._setLimit(options?.collectionLimits?.emojis, Infinity),
                groupChannels: options?.collectionLimits?.groupChannels ?? 10,
                guilds: options?.collectionLimits?.guilds ?? Infinity,
                guildThreads: this.util._setLimit(options?.collectionLimits?.guildThreads, Infinity),
                integrations: this.util._setLimit(options?.collectionLimits?.integrations, Infinity),
                invites: this.util._setLimit(options?.collectionLimits?.invites, Infinity),
                members: this.util._setLimit(options?.collectionLimits?.members, Infinity),
                messages: this.util._setLimit(options?.collectionLimits?.messages, 100),
                privateChannels: options?.collectionLimits?.privateChannels ?? 25,
                roles: this.util._setLimit(options?.collectionLimits?.roles, Infinity),
                scheduledEvents: this.util._setLimit(options?.collectionLimits?.scheduledEvents, Infinity),
                soundboardSounds: this.util._setLimit(options?.collectionLimits?.soundboardSounds, Infinity),
                stageInstances: this.util._setLimit(options?.collectionLimits?.stageInstances, Infinity),
                stickers: this.util._setLimit(options?.collectionLimits?.stickers, Infinity),
                unavailableGuilds: options?.collectionLimits?.unavailableGuilds ?? Infinity,
                users: options?.collectionLimits?.users ?? Infinity,
                voiceMembers: this.util._setLimit(options?.collectionLimits?.voiceMembers, Infinity),
                voiceStates: this.util._setLimit(options?.collectionLimits?.voiceStates, Infinity)
            },
            defaultImageFormat: options?.defaultImageFormat ?? "png",
            defaultImageSize: options?.defaultImageSize ?? 4096,
            disableMemberLimitScaling: options?.disableMemberLimitScaling ?? false,
            restMode: false,
            disableCache
        };
        if (options?.disableCache === true) {
            process.emitWarning("Enabling the disableCache option is not recommended. This will break many aspects of the library, as it is not designed to function without cache.", {
                code: "OCEANIC_CACHE_DISABLED",
                detail: "Set the disableCache option to the literal string \"no-warning\" to disable this warning."
            });
        }
        if (disableCache && options?.collectionLimits !== undefined && !(0, node_util_1.isDeepStrictEqual)(options.collectionLimits, colZero)) {
            process.emitWarning("Providing the collectionsLimit option when the disableCache option has been enabled is redundant. Any provided values will be ignored.", {
                code: "OCEANIC_COLLECTIONS_LIMIT_WITH_CACHE_DISABLED",
                detail: "Remove the collectionsLimit option, or zero out all of the possible options to disable this warning."
            });
        }
        this.groupChannels = new TypedCollection_1.default(GroupChannel_1.default, this, this.options.collectionLimits.groupChannels);
        this.guilds = new TypedCollection_1.default(Guild_1.default, this, this.options.collectionLimits.guilds);
        this.privateChannels = new TypedCollection_1.default(PrivateChannel_1.default, this, this.options.collectionLimits.privateChannels);
        this.ready = false;
        this.rest = new RESTManager_1.default(this, options?.rest);
        this.shards = new ShardManager_1.default(this, options?.gateway);
        this.unavailableGuilds = new TypedCollection_1.default(UnavailableGuild_1.default, this, this.options.collectionLimits.unavailableGuilds);
        this.users = new TypedCollection_1.default(User_1.default, this, this.options.collectionLimits.users);
    }
    /** The client's partial application. This will throw an error if not using a gateway connection or no shard is READY. If using a client for rest only, consider enabling rest mode. */
    get application() {
        if (this._application) {
            return this._application;
        }
        else {
            throw new Errors_1.UncachedError(`${this.constructor.name}#application is not present if not using a gateway connection or no shard is READY. Consider making sure you have connected your client, or enable rest mode.`);
        }
    }
    get uptime() {
        return this.startTime ? Date.now() - this.startTime : 0;
    }
    /** The client's user. This will throw an error if not using a gateway connection or no shard is READY. If using a client for rest only, consider enabling rest mode. */
    get user() {
        if (this._user) {
            return this._user;
        }
        else {
            throw new Errors_1.UncachedError(`${this.constructor.name}#user is not present if not using a gateway connection or no shard is READY. Consider making sure you have connected your client, or enable rest mode.`);
        }
    }
    /** The active voice connections of this client. */
    get voiceConnections() {
        if (!DiscordJSVoice) {
            throw new Errors_1.DependencyError("Voice is only supported with @discordjs/voice installed.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return DiscordJSVoice.getVoiceConnections();
    }
    /** Connect the client to Discord. */
    async connect() {
        if (this.options.restMode) {
            throw new TypeError("Rest mode has been enabled on this client. You cannot connect to the gateway.");
        }
        if (!this.options.auth || !this.options.auth.startsWith("Bot ")) {
            throw new TypeError("You must provide a bot token to connect. Make sure it has been prefixed with `Bot `.");
        }
        await this.shards.connect();
    }
    /**
     * Disconnect all shards.
     * @param reconnect If shards should be reconnected. Defaults to {@link Types/Gateway~GatewayOptions#autoReconnect | GatewayOptions#autoReconnect}
     */
    disconnect(reconnect = this.shards.options.autoReconnect) {
        return this.shards.disconnect(reconnect);
    }
    /**
     * Edit the client's status across all shards.
     * @param status The status.
     * @param activities An array of activities.
     */
    async editStatus(status, activities = []) {
        for (const [, shard] of this.shards)
            await shard.editStatus(status, activities);
    }
    /**
     * Get a channel from an ID. This will return undefined if the channel is not cached.
     * @param channelID The id of the channel.
     */
    getChannel(channelID) {
        if (this.channelGuildMap.has(channelID)) {
            return this.guilds.get(this.channelGuildMap.get(channelID))?.channels.get(channelID);
        }
        else if (this.threadGuildMap.has(channelID)) {
            return this.guilds.get(this.threadGuildMap.get(channelID))?.threads.get(channelID);
        }
        return (this.privateChannels.get(channelID) ?? this.groupChannels.get(channelID));
    }
    /**
     * Get a helper instance that can be used with a specific access token.
     * @param accessToken The access token. Must be prefixed with `Bearer `.
     */
    getOAuthHelper(accessToken) {
        return this.rest.oauth.getHelper(accessToken);
    }
    /**
     * Get a voice connection.
     * @param guildID The ID of the guild the voice channel belongs to.
     */
    getVoiceConnection(guildID) {
        if (!DiscordJSVoice) {
            throw new Errors_1.DependencyError("Voice is only supported with @discordjs/voice installed.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        return DiscordJSVoice.getVoiceConnection(guildID);
    }
    /**
     * Join a voice channel.
     * @param options The options to join the channel with.
     * */
    joinVoiceChannel(options) {
        if (!DiscordJSVoice) {
            throw new Errors_1.DependencyError("Voice is only supported with @discordjs/voice installed.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return DiscordJSVoice.joinVoiceChannel({
            channelId: options.channelID,
            guildId: options.guildID,
            debug: options.debug,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            adapterCreator: options.voiceAdapterCreator,
            selfDeaf: options.selfDeaf,
            selfMute: options.selfMute
        });
    }
    /**
     * Leave a voice channel.
     * @param guildID The ID of the guild the voice channel belongs to.
     */
    leaveVoiceChannel(guildID) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return this.getVoiceConnection(guildID)?.destroy();
    }
    /**
     * Initialize this client for rest only use. Currently, this sets both the `application` and `user` properties (if not already present), as would happen with a gateway connection.
     * @param fakeReady If the client should emit a ready event. Defaults to true.
     */
    async restMode(fakeReady = true) {
        this._application ??= await this.rest.applications.getCurrent();
        this._user ??= await this.rest.oauth.getCurrentUser();
        this.options.restMode = true;
        if (fakeReady) {
            this.emit("ready");
        }
        return this;
    }
}
exports.default = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vbGliL0NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQkFBcUI7QUFDckIsNkVBQTZDO0FBQzdDLHFGQUFxRDtBQUNyRCx5RkFBeUQ7QUFDekQscUZBQXFEO0FBQ3JELHFFQUFxQztBQUNyQyx1RUFBdUM7QUFLdkMsK0VBQStDO0FBRS9DLGtGQUFrRDtBQUVsRCw2RkFBNkQ7QUFFN0QsK0RBQStCO0FBRy9CLDBDQUErRDtBQU0vRCx5Q0FBOEM7QUFFOUMsYUFBYTtBQUNiLElBQUksY0FBNkQsQ0FBQztBQUNsRSxJQUFJLENBQUM7SUFDRCxjQUFjLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDakQsQ0FBQztBQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUM7QUFDViw0TUFBNE07QUFFNU0scUhBQXFIO0FBQ3JILE1BQXFCLE1BQThDLFNBQVEsc0JBQWU7SUFDOUUsWUFBWSxDQUFxQjtJQUNqQyxLQUFLLENBQWdCO0lBQzdCLDJMQUEyTDtJQUMzTCxlQUFlLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFDNUMsYUFBYSxDQUFpRDtJQUM5RCxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFDMUMsTUFBTSxDQUFxRDtJQUMzRCxPQUFPLENBQXdCO0lBQy9CLGVBQWUsQ0FBcUQ7SUFDcEUsS0FBSyxDQUFVO0lBQ2YsSUFBSSxDQUFjO0lBQ2xCLE1BQU0sQ0FBZTtJQUNyQixTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2Qsd0xBQXdMO0lBQ3hMLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztJQUMzQyxpQkFBaUIsQ0FBeUQ7SUFDMUUsS0FBSyxDQUFpQztJQUN0QyxJQUFJLENBQU87SUFDWCxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQStDLENBQUM7SUFDdkU7OztPQUdHO0lBQ0gsWUFBWSxPQUF1QjtRQUMvQixLQUFLLEVBQUUs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