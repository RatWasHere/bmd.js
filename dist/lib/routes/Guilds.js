"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Routes = tslib_1.__importStar(require("../util/Routes"));
const GuildScheduledEvent_1 = tslib_1.__importDefault(require("../structures/GuildScheduledEvent"));
const Webhook_1 = tslib_1.__importDefault(require("../structures/Webhook"));
const GuildTemplate_1 = tslib_1.__importDefault(require("../structures/GuildTemplate"));
const GuildPreview_1 = tslib_1.__importDefault(require("../structures/GuildPreview"));
const Role_1 = tslib_1.__importDefault(require("../structures/Role"));
const Invite_1 = tslib_1.__importDefault(require("../structures/Invite"));
const Integration_1 = tslib_1.__importDefault(require("../structures/Integration"));
const AutoModerationRule_1 = tslib_1.__importDefault(require("../structures/AutoModerationRule"));
const AuditLogEntry_1 = tslib_1.__importDefault(require("../structures/AuditLogEntry"));
const Guild_1 = tslib_1.__importDefault(require("../structures/Guild"));
const ApplicationCommand_1 = tslib_1.__importDefault(require("../structures/ApplicationCommand"));
const VoiceState_1 = tslib_1.__importDefault(require("../structures/VoiceState"));
const Soundboard_1 = tslib_1.__importDefault(require("../structures/Soundboard"));
const QueryBuilder_1 = tslib_1.__importDefault(require("../util/QueryBuilder"));
const promises_1 = require("node:timers/promises");
/** Various methods for interacting with guilds. Located at {@link Client#rest | Client#rest}{@link RESTManager#guilds | .guilds}. */
class Guilds {
    _manager;
    constructor(manager) {
        this._manager = manager;
    }
    /**
     * Add a member to a guild. Requires an access token with the `guilds.join` scope.
     *
     * Returns the newly added member upon success, or void if the member is already in the guild.
     * @param guildID The ID of the guild.
     * @param userID The ID of the user to add.
     * @param options The options for adding the member.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}
     */
    async addMember(guildID, userID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "PUT",
            path: Routes.GUILD_MEMBER(guildID, userID),
            json: {
                access_token: options.accessToken,
                deaf: options.deaf,
                mute: options.mute,
                nick: options.nick,
                roles: options.roles
            }
        }).then(data => data === null ? undefined : this._manager.client.util.updateMember(guildID, userID, data));
    }
    /**
     * Add a role to a member.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the member.
     * @param roleID The ID of the role to add.
     * @param reason The reason for adding the role.
     * @caching This method **does not** cache its result.
     */
    async addMemberRole(guildID, memberID, roleID, reason) {
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.GUILD_MEMBER_ROLE(guildID, memberID, roleID),
            reason
        });
    }
    /**
     * Begin a prune.
     * @param guildID The ID of the guild.
     * @param options The options for the prune.
     * @caching This method **does not** cache its result.
     */
    async beginPrune(guildID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_PRUNE(guildID),
            json: {
                days: options?.days,
                compute_prune_count: options?.computePruneCount,
                include_roles: options?.includeRoles
            },
            reason: options?.reason
        }).then(data => data.pruned);
    }
    /**
     * Ban up to 200 members from a guild. This requires both the `BAN_MEMBERS` and `MANAGE_GUILD` permissions.
     * If no members were banned, a {@link Constants~JSONErrorCodes.FAILED_TO_BAN_USERS | FAILED_TO_BAN_USERS } will be returned.
     * The bot user is ignored.
     * @param guildID The ID of the guild.
     * @param options The options for banning.
     */
    async bulkBan(guildID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_BULK_BAN(guildID),
            json: {
                delete_message_seconds: options.deleteMessageSeconds,
                user_ids: options.userIDs
            },
            reason: options.reason
        }).then(data => ({
            bannedUsers: data.banned_users,
            failedUsers: data.failed_users
        }));
    }
    /**
     * Create an auto moderation rule for a guild.
     * @param guildID The ID of the guild.
     * @param options The options for creating the rule.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#autoModerationRules | Guild#autoModerationRules}
     */
    async createAutoModerationRule(guildID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_AUTOMOD_RULES(guildID),
            json: {
                actions: options.actions.map(a => ({
                    metadata: {
                        channel_id: a.metadata.channelID,
                        custom_message: a.metadata.customMessage,
                        duration_seconds: a.metadata.durationSeconds
                    },
                    type: a.type
                })),
                enabled: options.enabled,
                event_type: options.eventType,
                exempt_channels: options.exemptChannels,
                exempt_roles: options.exemptRoles,
                name: options.name,
                trigger_metadata: options.triggerMetadata ? {
                    allow_list: options.triggerMetadata.allowList,
                    keyword_filter: options.triggerMetadata.keywordFilter,
                    mention_raid_protection_enabled: options.triggerMetadata.mentionRaidProtectionEnabled,
                    mention_total_limit: options.triggerMetadata.mentionTotalLimit,
                    presets: options.triggerMetadata.presets,
                    regex_patterns: options.triggerMetadata.regexPatterns
                } : undefined,
                trigger_type: options.triggerType
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.autoModerationRules.update(data) ?? new AutoModerationRule_1.default(data, this._manager.client));
    }
    /**
     * Create a ban for a user.
     * @param guildID The ID of the guild.
     * @param userID The ID of the user to ban.
     * @param options The options for creating the ban.
     * @caching This method **does not** cache its result.
     */
    async createBan(guildID, userID, options) {
        options = this._manager.client.util._freeze(options);
        let deleteMessageSeconds;
        if (options?.deleteMessageDays !== undefined && !Object.hasOwn(options, "deleteMessageSeconds")) {
            deleteMessageSeconds = options.deleteMessageDays * 86400;
        }
        await this._manager.authRequest({
            method: "PUT",
            path: Routes.GUILD_BAN(guildID, userID),
            json: { delete_message_seconds: deleteMessageSeconds },
            reason: options?.reason
        });
    }
    /**
     * Create a channel in a guild.
     * @param guildID The ID of the guild.
     * @param options The options for creating the channel.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#channels | Guild#channels}
     */
    async createChannel(guildID, type, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_CHANNELS(guildID),
            json: {
                available_tags: options.availableTags ? options.availableTags.map(tag => ({
                    emoji_id: tag.emoji?.id,
                    emoji_name: tag.emoji?.name,
                    moderated: tag.moderated,
                    name: tag.name
                })) : options.availableTags,
                bitrate: options.bitrate,
                default_auto_archive_duration: options.defaultAutoArchiveDuration,
                default_forum_layout: options.defaultForumLayout,
                default_reaction_emoji: options.defaultReactionEmoji ? { emoji_id: options.defaultReactionEmoji.id, emoji_name: options.defaultReactionEmoji.name } : options.defaultReactionEmoji,
                default_sort_order: options.defaultSortOrder,
                name: options.name,
                nsfw: options.nsfw,
                parent_id: options.parentID,
                permission_overwrites: options.permissionOverwrites,
                position: options.position,
                rate_limit_per_user: options.rateLimitPerUser,
                rtc_region: options.rtcRegion,
                topic: options.topic,
                type,
                user_limit: options.userLimit,
                video_quality_mode: options.videoQualityMode
            },
            reason: options.reason
        }).then(data => this._manager.client.util.updateChannel(data));
    }
    /**
     * Create an emoji in a guild.
     * @param guildID The ID of the guild.
     * @param options The options for creating the emoji.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#emojis | Guild#emojis}<br>{@link Client#users | Client#users} (creator, if applicable)
     */
    async createEmoji(guildID, options) {
        options = this._manager.client.util._freeze(options);
        let image;
        if (options.image) {
            image = this._manager.client.util._convertImage(options.image, "image");
        }
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_EMOJIS(guildID),
            json: {
                image,
                name: options.name,
                roles: options.roles
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.emojis.update(data) ?? this._manager.client.util.convertGuildEmoji(data));
    }
    /**
     * Create a role.
     * @param guildID The ID of the guild.
     * @param options The options for creating the role.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#roles | Guild#roles}
     */
    async createRole(guildID, options) {
        options = this._manager.client.util._freeze(options);
        let icon;
        if (options?.icon) {
            icon = this._manager.client.util._convertImage(options.icon, "icon");
        }
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_ROLES(guildID),
            json: {
                color: options?.color,
                colors: {
                    primary_color: options?.colors?.primaryColor,
                    secondary_color: options?.colors?.secondaryColor,
                    tertiary_color: options?.colors?.tertiaryColor
                },
                hoist: options?.hoist,
                icon,
                mentionable: options?.mentionable,
                name: options?.name,
                permissions: options?.permissions,
                unicode_emoji: options?.unicodeEmoji
            },
            reason: options?.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.roles.update(data, guildID) ?? new Role_1.default(data, this._manager.client, guildID));
    }
    /**
     * Create a scheduled event in a guild.
     * @param guildID The ID of the guild.
     * @param options The options for creating the scheduled event.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#scheduledEvents | Guild#scheduledEvents}
     */
    async createScheduledEvent(guildID, options) {
        options = this._manager.client.util._freeze(options);
        let image;
        if (options.image) {
            image = this._manager.client.util._convertImage(options.image, "image");
        }
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_SCHEDULED_EVENTS(guildID),
            json: {
                channel_id: options.channelID,
                description: options.description,
                entity_metadata: options.entityMetadata ? { location: options.entityMetadata.location } : undefined,
                entity_type: options.entityType,
                image,
                name: options.name,
                privacy_level: options.privacyLevel,
                scheduled_end_time: options.scheduledEndTime,
                scheduled_start_time: options.scheduledStartTime
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.scheduledEvents.update(data) ?? new GuildScheduledEvent_1.default(data, this._manager.client));
    }
    /**
     * Create a soundboard sound
     * @param guildID The ID of the guild
     * @param options The options for creating the soundboard sound
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#soundboardSounds | Guild#soundboardSounds}
     */
    async createSoundboardSound(guildID, options) {
        options = this._manager.client.util._freeze(options);
        let sound;
        if (options.sound) {
            sound = this._manager.client.util._convertSound(options.sound, "sound");
        }
        return this._manager.authRequest({
            method: "POST",
            path: Routes.SOUNDBOARD_SOUNDS(guildID),
            json: {
                emoji_id: options.emojiID,
                emoji_name: options.emojiName,
                name: options.name,
                sound,
                volume: options.volume
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.soundboardSounds.update(data) ?? new Soundboard_1.default(data, this._manager.client));
    }
    /**
     * Create a sticker.
     * @param guildID The ID of the guild.
     * @param options The options for creating the sticker.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#stickers | Guild#stickers}<br>{@link Client#users | Client#users} (creator, if applicable)
     */
    async createSticker(guildID, options) {
        options = this._manager.client.util._freeze(options);
        const magic = this._manager.client.util.getMagic(options.file.contents);
        let mime;
        switch (magic) {
            // png & apng have the same magic
            case "89504E47": {
                mime = "image/png";
                break;
            }
            // lottie
            case "7B227622": {
                mime = "application/json";
                break;
            }
        }
        const form = new FormData();
        form.append("description", options.description);
        form.append("name", options.name);
        form.append("tags", options.tags);
        form.append("file", new Blob([options.file.contents], { type: mime }), options.file.name);
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_STICKERS(guildID),
            form,
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.stickers.update(data) ?? this._manager.client.util.convertSticker(data));
    }
    /**
     * Create a guild template.
     * @param guildID The ID of the guild to create a template from.
     * @param options The options for creating the template.
     */
    async createTemplate(guildID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_TEMPLATES(guildID),
            json: {
                description: options.description,
                name: options.name
            }
        }).then(data => new GuildTemplate_1.default(data, this._manager.client));
    }
    /**
     * Delete an auto moderation rule.
     * @param guildID The ID of the guild.
     * @param ruleID The ID of the rule to delete.
     * @param reason The reason for deleting the rule.
     * @caching This method **does not** cache its result.
     */
    async deleteAutoModerationRule(guildID, ruleID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_AUTOMOD_RULE(guildID, ruleID),
            reason
        });
    }
    /**
     * Delete an emoji.
     * @param guildID The ID of the guild.
     * @param emojiID The ID of the emoji.
     * @param reason The reason for deleting the emoji.
     * @caching This method **does not** cache its result.
     */
    async deleteEmoji(guildID, emojiID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_EMOJI(guildID, emojiID),
            reason
        });
    }
    /**
     * Delete an integration.
     * @param guildID The ID of the guild.
     * @param integrationID The ID of the integration.
     * @param reason The reason for deleting the integration.
     * @caching This method **does not** cache its result.
     */
    async deleteIntegration(guildID, integrationID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_INTEGRATION(guildID, integrationID),
            reason
        });
    }
    /**
     * Delete a role.
     * @param guildID The ID of the guild.
     * @param roleID The ID of the role to delete.
     * @param reason The reason for deleting the role.
     * @caching This method **does not** cache its result.
     */
    async deleteRole(guildID, roleID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_ROLE(guildID, roleID),
            reason
        });
    }
    /**
     * Delete a scheduled event.
     * @param guildID The ID of the guild.
     * @param eventID The ID of the scheduled event.
     * @param reason The reason for deleting the scheduled event. Discord's docs do not explicitly state a reason can be provided, so it may not be used.
     * @caching This method **does not** cache its result.
     */
    async deleteScheduledEvent(guildID, eventID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_SCHEDULED_EVENT(guildID, eventID),
            reason
        });
    }
    /**
     *
     * @param guildID The ID of the guild.
     * @param soundID The ID of the soundboard sound to delete.
     * @param reason The reason for deleting the soundboard sound.
     * @caching This method **does not** cache its result.
     */
    async deleteSoundboardSound(guildID, soundID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.SOUNDBOARD_SOUND(guildID, soundID),
            reason
        });
    }
    /**
     * Delete a sticker.
     * @param guildID The ID of the guild.
     * @param stickerID The ID of the sticker to delete.
     * @param reason The reason for deleting the sticker.
     * @caching This method **does not** cache its result.
     */
    async deleteSticker(guildID, stickerID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_STICKER(guildID, stickerID),
            reason
        });
    }
    /**
     * Delete a template.
     * @param guildID The ID of the guild.
     * @param code The code of the template.
     * @caching This method **does not** cache its result.
     */
    async deleteTemplate(guildID, code) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_TEMPLATE(guildID, code)
        });
    }
    /**
     * Edit a guild.
     * @param guildID The ID of the guild.
     * @param options The options for editing the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not already cached.
     * @caches {@link Client#guilds | Client#guilds}
     */
    async edit(guildID, options) {
        options = this._manager.client.util._freeze(options);
        let banner, discoverySplash, icon, splash;
        if (options.banner) {
            banner = this._manager.client.util._convertImage(options.banner, "banner");
        }
        if (options.discoverySplash) {
            discoverySplash = this._manager.client.util._convertImage(options.discoverySplash, "discovery splash");
        }
        if (options.icon) {
            icon = this._manager.client.util._convertImage(options.icon, "icon");
        }
        if (options.splash) {
            splash = this._manager.client.util._convertImage(options.splash, "splash");
        }
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD(guildID),
            json: {
                afk_channel_id: options.afkChannelID,
                afk_timeout: options.afkTimeout,
                banner,
                default_message_notifications: options.defaultMessageNotifications,
                description: options.description,
                discovery_splash: discoverySplash,
                explicit_content_filter: options.explicitContentFilter,
                features: options.features,
                icon,
                name: options.name,
                preferred_locale: options.preferredLocale,
                premium_progress_bar_enabled: options.premiumProgressBarEnabled,
                public_updates_channel_id: options.publicUpdatesChannelID,
                region: options.region,
                rules_channel_id: options.rulesChannelID,
                safety_alerts_channel_id: options.safetyAlertsChannelID,
                splash,
                system_channel_flags: options.systemChannelFlags,
                system_channel_id: options.systemChannelID,
                verification_level: options.verificationLevel
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.has(guildID) ? this._manager.client.guilds.update(data, true) : new Guild_1.default(data, this._manager.client, true));
    }
    /**
     * Edit an existing auto moderation rule.
     * @param guildID The ID of the guild.
     * @param ruleID The ID of the rule to edit.
     * @param options The options for editing the rule.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#autoModerationRules | Guild#autoModerationRules}
     */
    async editAutoModerationRule(guildID, ruleID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_AUTOMOD_RULE(guildID, ruleID),
            json: {
                actions: options.actions?.map(a => ({
                    metadata: {
                        channel_id: a.metadata.channelID,
                        custom_message: a.metadata.customMessage,
                        duration_seconds: a.metadata.durationSeconds
                    },
                    type: a.type
                })),
                enabled: options.enabled,
                event_type: options.eventType,
                exempt_channels: options.exemptChannels,
                exempt_roles: options.exemptRoles,
                name: options.name,
                trigger_metadata: options.triggerMetadata ? {
                    allow_list: options.triggerMetadata.allowList,
                    keyword_filter: options.triggerMetadata.keywordFilter,
                    mention_raid_protection_enabled: options.triggerMetadata.mentionRaidProtectionEnabled,
                    mention_total_limit: options.triggerMetadata.mentionTotalLimit,
                    presets: options.triggerMetadata.presets,
                    regex_patterns: options.triggerMetadata.regexPatterns
                } : undefined
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.autoModerationRules.update(data) ?? new AutoModerationRule_1.default(data, this._manager.client));
    }
    /**
     * Edit the positions of channels in a guild.
     * @param guildID The ID of the guild.
     * @param options The channels to move. Unedited channels do not need to be specified.
     * @caching This method **does not** cache its result.
     */
    async editChannelPositions(guildID, options) {
        options = this._manager.client.util._freeze(options);
        await this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_CHANNELS(guildID),
            json: options.map(o => ({
                id: o.id,
                // lock_permissions: o.lockPermissions ?? null,
                // parent_id:        o.parentID ?? null,
                position: o.position ?? null
            }))
        });
    }
    /**
     * Modify the current member in a guild.
     * @param guildID The ID of the guild.
     * @param options The options for editing the member.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}<br>{@link Guild#clientMember | Guild#clientMember}
     */
    async editCurrentMember(guildID, options) {
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_MEMBER(guildID, "@me"),
            json: { nick: options.nick },
            reason: options.reason
        }).then(data => this._manager.client.util.updateMember(guildID, data.user.id, data));
    }
    /**
     * Edit the current member's voice state in a guild. `channelID` is required, and the current member must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-current-user-voice-state-caveats) for more information.
     * @param guildID The ID of the guild.
     * @param options The options for editing the voice state.
     * @caching This method **does not** cache its result.
     */
    async editCurrentUserVoiceState(guildID, options) {
        options = this._manager.client.util._freeze(options);
        await this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_VOICE_STATE(guildID, "@me"),
            json: {
                channel_id: options.channelID,
                suppress: options.suppress,
                request_to_speak_timestamp: options.requestToSpeakTimestamp
            }
        });
    }
    /**
     * Edit an existing emoji.
     * @param guildID The ID of the guild the emoji is in.
     * @param options The options for editing the emoji.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#emojis | Guild#emojis}
     */
    async editEmoji(guildID, emojiID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_EMOJI(guildID, emojiID),
            json: {
                name: options.name,
                roles: options.roles
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.emojis.update(data) ?? this._manager.client.util.convertGuildEmoji(data));
    }
    /**
     * Edit the incident actions for a guild.
     * @param guildID The ID of the guild.
     * @param options The options for editing the incident actions.
     * @caching This method **does not** cache its result.
     */
    async editIncidentActions(guildID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "PUT",
            path: Routes.GUILD_INCIDENT_ACTIONS(guildID),
            json: {
                dms_disabled_until: options.dmsDisabledUntil,
                invites_disabled_until: options.invitesDisabledUntil
            },
            reason: options.reason
        }).then(data => ({
            dmsDisabledUntil: data.dms_disabled_until,
            invitesDisabledUntil: data.invites_disabled_until
        }));
    }
    /**
     * Edit a guild member. Use editCurrentMember if you wish to update the nick of this client using the `CHANGE_NICKNAME` permission.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the member.
     * @param options The options for editing the member.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}
     */
    async editMember(guildID, memberID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_MEMBER(guildID, memberID),
            json: {
                channel_id: options.channelID,
                communication_disabled_until: options.communicationDisabledUntil,
                deaf: options.deaf,
                flags: options.flags,
                mute: options.mute,
                nick: options.nick,
                roles: options.roles
            },
            reason: options.reason
        }).then(data => this._manager.client.util.updateMember(guildID, memberID, data));
    }
    /**
     * Edit a guild's onboarding configuration.
     * @param guildID The ID of the guild.
     * @param options The options for editing the onboarding configuration.
     * @caching This method **does not** cache its result.
     */
    async editOnboarding(guildID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_ONBOARDING(guildID),
            json: {
                enabled: options.enabled,
                default_channel_ids: options.defaultChannelIDs,
                prompts: options.prompts?.map(p => ({
                    id: p.id,
                    in_oboarding: p.inOnboarding,
                    options: p.options.map(o => ({
                        channel_ids: o.channelIDs,
                        description: o.description,
                        emoji: o.emoji,
                        id: o.id,
                        role_ids: o.roleIDs,
                        title: o.title
                    })),
                    required: p.required,
                    single_select: p.singleSelect,
                    title: p.title
                })),
                mode: options.mode
            },
            reason: options.reason
        }).then(data => ({
            defaultChannelIDs: data.default_channel_ids,
            enabled: data.enabled,
            guildID: data.guild_id,
            mode: data.mode,
            prompts: data.prompts.map(p => ({
                id: p.id,
                inOnboarding: p.in_onboarding,
                options: p.options.map(o => ({
                    channelIDs: o.channel_ids,
                    description: o.description,
                    emoji: o.emoji,
                    id: o.id,
                    roleIDs: o.role_ids,
                    title: o.title
                })),
                required: p.required,
                singleSelect: p.single_select,
                title: p.title
            }))
        }));
    }
    /**
     * Edit an existing role.
     * @param guildID The ID of the guild.
     * @param options The options for editing the role.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#roles | Guild#roles}
     */
    async editRole(guildID, roleID, options) {
        options = this._manager.client.util._freeze(options);
        let icon;
        if (options.icon) {
            icon = this._manager.client.util._convertImage(options.icon, "icon");
        }
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_ROLE(guildID, roleID),
            json: {
                color: options.color,
                colors: {
                    primary_color: options.colors?.primaryColor,
                    secondary_color: options.colors?.secondaryColor,
                    tertiary_color: options.colors?.tertiaryColor
                },
                hoist: options.hoist,
                icon,
                mentionable: options.mentionable,
                name: options.name,
                permissions: options.permissions,
                unicode_emoji: options.unicodeEmoji
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.roles.update(data, guildID) ?? new Role_1.default(data, this._manager.client, guildID));
    }
    /**
     * Edit the position of roles in a guild.
     * @param guildID The ID of the guild.
     * @param options The roles to move.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#roles | Guild#roles}
     */
    async editRolePositions(guildID, options, reason) {
        options = this._manager.client.util._freeze(options);
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_ROLES(guildID),
            json: options.map(o => ({
                id: o.id,
                position: o.position
            })),
            reason
        }).then(data => data.map(role => guild?.roles.update(role, guildID) ?? new Role_1.default(role, this._manager.client, guildID)));
    }
    /**
     * Edit an existing scheduled event in a guild.
     * @param guildID The ID of the guild.
     * @param scheduledEventID The ID of the scheduled event.
     * @param options The options for editing the scheduled event.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#scheduledEvents | Guild#scheduledEvents}
     */
    async editScheduledEvent(guildID, scheduledEventID, options) {
        options = this._manager.client.util._freeze(options);
        let image;
        if (options.image) {
            image = this._manager.client.util._convertImage(options.image, "image");
        }
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_SCHEDULED_EVENT(guildID, scheduledEventID),
            json: {
                channel_id: options.channelID,
                description: options.description,
                entity_metadata: options.entityMetadata ? { location: options.entityMetadata.location } : undefined,
                entity_type: options.entityType,
                image,
                name: options.name,
                privacy_level: options.privacyLevel,
                status: options.status,
                scheduled_end_time: options.scheduledEndTime,
                scheduled_start_time: options.scheduledStartTime
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.scheduledEvents.update(data) ?? new GuildScheduledEvent_1.default(data, this._manager.client));
    }
    /**
     * Edit a soundboard sound.
     * @param guildID The ID of the guild.
     * @param soundID The ID of the soundboard sound to edit.
     * @param options The options for editing the soundboard sound.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#soundboardSounds | Guild#soundboardSounds}
     */
    async editSoundboardSound(guildID, soundID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.SOUNDBOARD_SOUND(guildID, soundID),
            json: {
                emoji_id: options.emojiID,
                emoji_name: options.emojiName,
                name: options.name,
                volume: options.volume
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.soundboardSounds.update(data) ?? new Soundboard_1.default(data, this._manager.client));
    }
    /**
     * Edit a sticker.
     * @param guildID The ID of the guild.
     * @param options The options for editing the sticker.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#stickers | Guild#stickers}
     */
    async editSticker(guildID, stickerID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_STICKER(guildID, stickerID),
            json: {
                description: options.description,
                name: options.name,
                tags: options.tags
            },
            reason: options.reason
        }).then(data => this._manager.client.guilds.get(guildID)?.stickers.update(data) ?? this._manager.client.util.convertSticker(data));
    }
    /**
     * Edit a guild template.
     * @param guildID The ID of the guild.
     * @param code The code of the template.
     * @param options The options for editing the template.
     * @caching This method **does not** cache its result.
     */
    async editTemplate(guildID, code, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_TEMPLATE(guildID, code),
            json: {
                code,
                description: options.description,
                name: options.name
            }
        }).then(data => new GuildTemplate_1.default(data, this._manager.client));
    }
    /**
     * Edit a guild member's voice state. `channelID` is required, and the user must already be in that channel. See [Discord's docs](https://discord.com/developers/docs/resources/guild#modify-user-voice-state) for more information.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the member.
     * @param options The options for editing the voice state.
     * @caching This method **does not** cache its result.
     */
    async editUserVoiceState(guildID, memberID, options) {
        options = this._manager.client.util._freeze(options);
        await this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_VOICE_STATE(guildID, memberID),
            json: {
                channel_id: options.channelID,
                suppress: options.suppress
            }
        });
    }
    /**
     * Edit the welcome screen in a guild.
     * @param guildID The ID of the guild.
     * @param options The options for editing the welcome screen.
     * @caching This method **does not** cache its result.
     */
    async editWelcomeScreen(guildID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_WELCOME_SCREEN(guildID),
            json: {
                description: options.description,
                enabled: options.enabled,
                welcome_channels: options.welcomeChannels.map(ch => ({
                    channel_id: ch.channelID,
                    description: ch.description,
                    emoji_id: ch.emojiID,
                    emoji_name: ch.emojiName
                }))
            },
            reason: options.reason
        }).then(data => ({
            description: data.description,
            welcomeChannels: data.welcome_channels.map(channel => ({
                channelID: channel.channel_id,
                description: channel.description,
                emojiID: channel.emoji_id,
                emojiName: channel.emoji_name
            }))
        }));
    }
    /**
     * Edit the widget of a guild.
     * @param guildID The ID of the guild.
     * @param options The options for editing the widget.
     * @caching This method **does not** cache its result.
     */
    async editWidget(guildID, options) {
        options = this._manager.client.util._freeze(options);
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_WIDGET(guildID),
            json: {
                channel_id: options.channelID,
                enabled: options.enabled
            }
        }).then(data => ({
            channels: data.channels,
            id: data.id,
            instantInvite: data.instant_invite,
            members: data.members.map(m => ({
                activity: m.activity,
                avatar: m.avatar,
                avatarURL: m.avatar_url,
                discriminator: m.discriminator,
                id: m.id,
                status: m.status,
                tag: m.username,
                username: m.username
            })),
            name: data.name,
            presenceCount: data.presence_count
        }));
    }
    /**
     * Get a guild.
     * @param guildID The ID of the guild.
     * @param withCounts If the approximate number of members and online members should be included.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not already cached.
     * @caches {@link Client#guilds | Client#guilds}
     */
    async get(guildID, withCounts) {
        const query = new QueryBuilder_1.default();
        query.setIfPresent("with_counts", withCounts);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD(guildID),
            query
        }).then(data => this._manager.client.guilds.has(guildID) ? this._manager.client.guilds.update(data, true) : new Guild_1.default(data, this._manager.client, true));
    }
    /**
     * Get the active threads in a guild.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#threads | Guild#threads}
     */
    async getActiveThreads(guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_ACTIVE_THREADS(guildID)
        }).then(data => ({
            members: data.members.map(member => ({
                flags: member.flags,
                id: member.id,
                joinTimestamp: new Date(member.join_timestamp),
                userID: member.user_id
            })),
            threads: data.threads.map(rawThread => this._manager.client.util.updateThread(rawThread))
        }));
    }
    /**
     * Get a guild's audit log.
     * @param guildID The ID of the guild.
     * @param options The options for getting the audit logs.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#autoModerationRules | Guild#autoModerationRules}<br>{@link Guild#scheduledEvents | Guild#scheduledEvents}<br>{@link Guild#integrations | Guild#integrations}<br>{@link Guild#threads | Guild#threads}<br>{@link Client#users | Client#users}
     */
    async getAuditLog(guildID, options) {
        const guild = this._manager.client.guilds.get(guildID);
        const query = new QueryBuilder_1.default();
        query.setIfPresent("action_type", options?.actionType);
        query.setIfPresent("before", options?.before);
        query.setIfPresent("limit", options?.limit);
        query.setIfPresent("user_id", options?.userID);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_AUDIT_LOG(guildID),
            query
        }).then(data => ({
            applicationCommands: data.application_commands.map(command => new ApplicationCommand_1.default(command, this._manager.client)),
            autoModerationRules: data.auto_moderation_rules.map(rule => guild?.autoModerationRules.update(rule) ?? new AutoModerationRule_1.default(rule, this._manager.client)),
            entries: data.audit_log_entries.map(entry => new AuditLogEntry_1.default(entry, this._manager.client)),
            guildScheduledEvents: data.guild_scheduled_events.map(event => guild?.scheduledEvents.update(event) ?? new GuildScheduledEvent_1.default(event, this._manager.client)),
            integrations: data.integrations.map(integration => guild?.integrations.update(integration, guildID) ?? new Integration_1.default(integration, this._manager.client, guildID)),
            threads: data.threads.map(rawThread => this._manager.client.util.updateThread(rawThread)),
            users: data.users.map(user => this._manager.client.users.update(user)),
            webhooks: data.webhooks.map(webhook => new Webhook_1.default(webhook, this._manager.client))
        }));
    }
    /**
     * Get an auto moderation rule for a guild.
     * @param guildID The ID of the guild.
     * @param ruleID The ID of the rule to get.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#autoModerationRules | Guild#autoModerationRules}
     */
    async getAutoModerationRule(guildID, ruleID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_AUTOMOD_RULE(guildID, ruleID)
        }).then(data => this._manager.client.guilds.get(guildID)?.autoModerationRules.update(data) ?? new AutoModerationRule_1.default(data, this._manager.client));
    }
    /**
     * Get the auto moderation rules for a guild.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#autoModerationRules | Guild#autoModerationRules}
     */
    async getAutoModerationRules(guildID) {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_AUTOMOD_RULES(guildID)
        }).then(data => data.map(rule => guild?.autoModerationRules.update(rule) ?? new AutoModerationRule_1.default(rule, this._manager.client)));
    }
    /**
     * Get a ban.
     * @param guildID The ID of the guild.
     * @param userID The ID of the user to get the ban of.
     * @caching This method **does** cache part of its result.
     * @caches {@link Client#users | Client#users}
     */
    async getBan(guildID, userID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_BAN(guildID, userID)
        }).then(data => ({
            reason: data.reason,
            user: this._manager.client.users.update(data.user)
        }));
    }
    /**
     * Get the bans in a guild.
     * @param guildID The ID of the guild.
     * @param options The options for getting the bans.
     * @caching This method **does** cache part of its result.
     * @caches {@link Client#users | Client#users}
     */
    async getBans(guildID, options) {
        const _getBans = async (_options) => {
            const query = new QueryBuilder_1.default();
            query.setIfPresent("after", _options?.after);
            query.setIfPresent("before", _options?.before);
            query.setIfPresent("limit", _options?.limit);
            return this._manager.authRequest({
                method: "GET",
                path: Routes.GUILD_BANS(guildID),
                query
            }).then(data => data.map(ban => ({
                reason: ban.reason,
                user: this._manager.client.users.update(ban.user)
            })));
        };
        const limit = options?.limit ?? 1000;
        let chosenOption;
        if (options?.after) {
            chosenOption = "after";
        }
        else if (options?.before) {
            chosenOption = "before";
        }
        else {
            chosenOption = "after";
        }
        let optionValue = options?.[chosenOption] ?? undefined;
        let bans = [];
        while (bans.length < limit) {
            const limitLeft = limit - bans.length;
            const limitToFetch = Math.min(limitLeft, 1000);
            this._manager.client.emit("debug", `Getting ${limitLeft} more ban${limitLeft === 1 ? "" : "s"} for ${guildID}: ${optionValue ?? ""}`);
            const bansChunk = await _getBans({
                limit: limitToFetch,
                [chosenOption]: optionValue
            });
            if (bansChunk.length === 0) {
                break;
            }
            bans = bans.concat(bansChunk);
            optionValue = bansChunk.at(-1).user.id;
            if (bansChunk.length < 1000) {
                break;
            }
        }
        return bans;
    }
    /**
     * Get the channels in a guild. Does not include threads.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#channels | Guild#channels}
     */
    async getChannels(guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_CHANNELS(guildID)
        }).then(data => data.map(d => this._manager.client.util.updateChannel(d)));
    }
    /**
     * Get an emoji in a guild.
     * @param guildID The ID of the guild.
     * @param emojiID The ID of the emoji to get.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#emojis | Guild#emojis}
     */
    async getEmoji(guildID, emojiID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_EMOJI(guildID, emojiID)
        }).then(data => this._manager.client.guilds.get(guildID)?.emojis.update(data) ?? this._manager.client.util.convertGuildEmoji(data));
    }
    /**
     * Get the emojis in a guild.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#emojis | Guild#emojis} (will be completely cleared and refilled)
     */
    async getEmojis(guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_EMOJIS(guildID)
        }).then(data => {
            const guild = this._manager.client.guilds.get(guildID);
            guild?.emojis.clear();
            return data.map(emoji => guild?.emojis.update(emoji) ?? this._manager.client.util.convertGuildEmoji(emoji));
        });
    }
    /**
     * Get the integrations in a guild.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#integrations | Guild#integrations}
     */
    async getIntegrations(guildID) {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_INTEGRATIONS(guildID)
        }).then(data => data.map(integration => guild?.integrations.update(integration, guildID) ?? new Integration_1.default(integration, this._manager.client, guildID)));
    }
    /**
     * Get the invites of a guild.
     * @param guildID The ID of the guild to get the invites of.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#invites | Guild#invites}
     */
    async getInvites(guildID) {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_INVITES(guildID)
        }).then(data => data.map(invite => guild?.invites.update(invite) ?? new Invite_1.default(invite, this._manager.client)));
    }
    /**
     * Get a guild member.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the member.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}
     */
    async getMember(guildID, memberID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_MEMBER(guildID, memberID)
        }).then(data => this._manager.client.util.updateMember(guildID, memberID, data));
    }
    /**
     * Get a guild's members. This requires the `GUILD_MEMBERS` intent.
     * @param guildID The ID of the guild.
     * @param options The options for getting the members.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}}
     */
    async getMembers(guildID, options) {
        const query = new QueryBuilder_1.default();
        query.setIfPresent("after", options?.after);
        query.setIfPresent("limit", options?.limit);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_MEMBERS(guildID),
            query
        }).then(data => data.map(d => this._manager.client.util.updateMember(guildID, d.user.id, d)));
    }
    /**
     * Get a guild's onboarding info.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getOnboarding(guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_ONBOARDING(guildID)
        }).then(data => ({
            defaultChannelIDs: data.default_channel_ids,
            enabled: data.enabled,
            guildID: data.guild_id,
            mode: data.mode,
            prompts: data.prompts.map(p => ({
                id: p.id,
                inOnboarding: p.in_onboarding,
                options: p.options.map(o => ({
                    channelIDs: o.channel_ids,
                    description: o.description,
                    emoji: o.emoji,
                    id: o.id,
                    roleIDs: o.role_ids,
                    title: o.title
                })),
                required: p.required,
                singleSelect: p.single_select,
                title: p.title
            }))
        }));
    }
    /**
     * Get a preview of a guild. If the client is not already in this guild, the guild must be lurkable.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getPreview(guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_PREVIEW(guildID)
        }).then(data => new GuildPreview_1.default(data, this._manager.client));
    }
    /**
     * Get the prune count of a guild.
     * @param guildID The ID of the guild.
     * @param options The options for getting the prune count.
     * @caching This method **does not** cache its result.
     */
    async getPruneCount(guildID, options) {
        const query = new QueryBuilder_1.default();
        query.setIfPresent("days", options?.days);
        query.setIfPresent("include_roles", options?.includeRoles?.join(","));
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_PRUNE(guildID),
            query
        }).then(data => data.pruned);
    }
    /**
     * Get a role in a guild.
     * @param guildID The ID of the guild.
     * @param roleID The ID of the role to get.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#roles | Guild#roles}
     */
    async getRole(guildID, roleID) {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_ROLE(guildID, roleID)
        }).then(data => guild?.roles.update(data, guildID) ?? new Role_1.default(data, this._manager.client, guildID));
    }
    /**
     * Get the roles in a guild.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#roles | Guild#roles}
     */
    async getRoles(guildID) {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_ROLES(guildID)
        }).then(data => data.map(role => guild?.roles.update(role, guildID) ?? new Role_1.default(role, this._manager.client, guildID)));
    }
    /**
     * Get a scheduled event.
     * @param guildID The ID of the guild.
     * @param eventID The ID of the scheduled event to get.
     * @param withUserCount If the number of users subscribed to the event should be included.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#scheduledEvents | Guild#scheduledEvents}
     */
    async getScheduledEvent(guildID, eventID, withUserCount) {
        const guild = this._manager.client.guilds.get(guildID);
        const query = new QueryBuilder_1.default();
        query.setIfPresent("with_user_count", withUserCount);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_SCHEDULED_EVENT(guildID, eventID),
            query
        }).then(data => guild?.scheduledEvents.update(data) ?? new GuildScheduledEvent_1.default(data, this._manager.client));
    }
    /**
     * Get the users subscribed to a scheduled event.
     * @param guildID The ID of the guild.
     * @param eventID The ID of the scheduled event.
     * @param options The options for getting the users.
     * @caching This method **does** cache part its result. Members will not be cached if the guild is not cached.
     * @caches {@link Client#users | Client#users}<br>{@link Guild#members | Guild#members}
     */
    async getScheduledEventUsers(guildID, eventID, options) {
        const guild = this._manager.client.guilds.get(guildID);
        const query = new QueryBuilder_1.default();
        query.setIfPresent("after", options?.after);
        query.setIfPresent("before", options?.before);
        query.setIfPresent("limit", options?.limit);
        query.setIfPresent("with_member", options?.withMember);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_SCHEDULED_EVENT_USERS(guildID, eventID)
        }).then(data => data.map(d => ({
            guildScheduledEvent: guild?.scheduledEvents.get(d.guild_scheduled_event_id),
            guildScheduledEventID: d.guild_scheduled_event_id,
            user: this._manager.client.users.update(d.user),
            member: d.member ? this._manager.client.util.updateMember(guildID, d.member.user.id, d.member) : undefined
        })));
    }
    /**
     * Get a guild's scheduled events.
     * @param guildID The ID of the guild.
     * @param withUserCount If the number of users subscribed to the event should be included.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#scheduledEvents | Guild#scheduledEvents}
     */
    async getScheduledEvents(guildID, withUserCount) {
        const guild = this._manager.client.guilds.get(guildID);
        const query = new QueryBuilder_1.default();
        query.setIfPresent("with_user_count", withUserCount);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_SCHEDULED_EVENTS(guildID),
            query
        }).then(data => data.map(d => guild?.scheduledEvents.update(d) ?? new GuildScheduledEvent_1.default(d, this._manager.client)));
    }
    /**
     * Get a soundboard sound.
     * @param guildID The ID of the guild.
     * @param soundID The ID of the soundboard sound to get.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#soundboardSounds | Guild#soundboardSounds}
     */
    async getSoundboardSound(guildID, soundID) {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.SOUNDBOARD_SOUND(guildID, soundID)
        }).then(data => guild?.soundboardSounds.update(data) ?? new Soundboard_1.default(data, this._manager.client));
    }
    /**
     * Get a guild's soundboard sounds.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#soundboardSounds | Guild#soundboardSounds}
     */
    async getSoundboardSounds(guildID) {
        const guild = this._manager.client.guilds.get(guildID);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.SOUNDBOARD_SOUNDS(guildID)
        }).then(data => data.items.map(d => guild?.soundboardSounds.update(d) ?? new Soundboard_1.default(d, this._manager.client)));
    }
    /**
     * Get a sticker. Response will include a user if the client has the `MANAGE_EMOJIS_AND_STICKERS` permissions.
     * @param guildID The ID of the guild.
     * @param stickerID The ID of the sticker to get.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#stickers | Guild#stickers}
     */
    async getSticker(guildID, stickerID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_STICKER(guildID, stickerID)
        }).then(data => this._manager.client.guilds.get(guildID)?.stickers.update(data) ?? this._manager.client.util.convertSticker(data));
    }
    /**
     * Get a guild's stickers. Stickers will include a user if the client has the `MANAGE_EMOJIS_AND_STICKERS` permissions.
     * @param guildID The ID of the guild.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#stickers | Guild#stickers} (will be completely cleared and refilled)
     */
    async getStickers(guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_STICKERS(guildID)
        }).then(data => {
            const guild = this._manager.client.guilds.get(guildID);
            guild?.stickers.clear();
            return data.map(sticker => guild?.stickers.update(sticker) ?? this._manager.client.util.convertSticker(sticker));
        });
    }
    /**
     * Get a guild template.
     * @param code The code of the template to get.
     * @caching This method **does not** cache its result.
     */
    async getTemplate(code) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_TEMPLATE_CODE(code)
        }).then(data => new GuildTemplate_1.default(data, this._manager.client));
    }
    /**
     * Get a guild's templates.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getTemplates(guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_TEMPLATES(guildID)
        }).then(data => data.map(d => new GuildTemplate_1.default(d, this._manager.client)));
    }
    /**
     * Get the vanity url of a guild.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getVanityURL(guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_VANITY_URL(guildID)
        });
    }
    /**
     * Get the list of usable voice regions for a guild. This will return VIP servers when the guild is VIP-enabled.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getVoiceRegions(guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_VOICE_REGIONS(guildID)
        });
    }
    /**
     * Get the voice state of a member.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the member. Use `@me` for the bot user.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#voiceStates | Guild#voiceStates}
     */
    async getVoiceState(guildID, memberID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_VOICE_STATE(guildID, memberID)
        }).then(data => this._manager.client.guilds.get(guildID)?.voiceStates.update(data) ?? new VoiceState_1.default(data, this._manager.client));
    }
    /**
     * Get the welcome screen for a guild.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getWelcomeScreen(guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_WELCOME_SCREEN(guildID)
        }).then(data => ({
            description: data.description,
            welcomeChannels: data.welcome_channels.map(channel => ({
                channelID: channel.channel_id,
                description: channel.description,
                emojiID: channel.emoji_id,
                emojiName: channel.emoji_name
            }))
        }));
    }
    /**
     * Get the widget of a guild.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getWidget(guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_WIDGET(guildID)
        }).then(data => ({
            channels: data.channels,
            id: data.id,
            instantInvite: data.instant_invite,
            members: data.members.map(m => ({
                activity: m.activity,
                avatar: m.avatar,
                avatarURL: m.avatar_url,
                discriminator: m.discriminator,
                id: m.id,
                status: m.status,
                tag: m.username,
                username: m.username
            })),
            name: data.name,
            presenceCount: data.presence_count
        }));
    }
    /**
     * Get the widget image of a guild.
     * @param guildID The ID of the guild.
     * @param style The style of the image.
     * @caching This method **does not** cache its result.
     */
    async getWidgetImage(guildID, style) {
        const query = new QueryBuilder_1.default();
        query.setIfPresent("style", style);
        return this._manager.request({
            method: "GET",
            path: Routes.GUILD_WIDGET_IMAGE(guildID),
            query
        });
    }
    /**
     * Get the raw JSON widget of a guild.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getWidgetJSON(guildID) {
        return this._manager.request({
            method: "GET",
            path: Routes.GUILD_WIDGET_JSON(guildID)
        });
    }
    /**
     * Get a guild's widget settings.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getWidgetSettings(guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_WIDGET(guildID)
        }).then(data => ({
            channelID: data.channel_id,
            enabled: data.enabled
        }));
    }
    /**
     * Search a guild's members.
     * @param guildID The ID of the guild.
     * @param options The options to search with.
     * @param retryOnIndexNotAvailable If the search should be retried if Discord replies with an index unavailable response. This will retry at most one time, waiting for `retry_after` or 15-45 seconds.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}
     */
    async memberSearch(guildID, options, retryOnIndexNotAvailable = true) {
        /* eslint-disable @typescript-eslint/explicit-function-return-type, unicorn/consistent-function-scoping */
        const formatRange = (data) => ({
            range: data.range === undefined ? undefined : {
                gte: data.range.gte,
                lte: data.range.lte
            }
        });
        const formatOrQuery = (data) => ({
            or_query: data.orQuery
        });
        const formatOrQueryRange = (data) => ({
            or_query: data.orQuery,
            range: data.range === undefined ? undefined : {
                gte: data.range.gte,
                lte: data.range.lte
            }
        });
        const formatAndOrQuery = (data) => ({
            and_query: data.andQuery,
            or_query: data.orQuery
        });
        const formatSearchFilter = (data) => ({
            did_rejoin: data.didRejoin,
            guild_joined_at: data.guildJoinedAt === undefined ? undefined : formatRange(data.guildJoinedAt),
            is_pending: data.isPending,
            join_source_type: data.joinSourceType === undefined ? undefined : formatOrQuery(data.joinSourceType),
            role_ids: data.roleIDs === undefined ? undefined : formatAndOrQuery(data.roleIDs),
            safety_signals: data.safetySignals === undefined ? undefined : {
                automod_quarantined_username: data.safetySignals.automodQuarantinedUsername,
                communication_disabled_until: data.safetySignals.communicationDisabledUntil === undefined ? undefined : formatRange(data.safetySignals.communicationDisabledUntil),
                unusual_account_activity: data.safetySignals.unusualAccountActivity,
                unusual_dm_activity_until: data.safetySignals.unusualDmActivityUntil === undefined ? undefined : formatRange(data.safetySignals.unusualDmActivityUntil)
            },
            source_invite_code: data.sourceInviteCode === undefined ? undefined : formatOrQuery(data.sourceInviteCode),
            user_id: data.userID === undefined ? undefined : formatOrQueryRange(data.userID),
            usernames: data.usernames === undefined ? undefined : formatOrQuery(data.usernames)
        });
        const formatPaginationFilter = (data) => ({
            guild_joined_at: data.guildJoinedAt,
            user_id: data.userID
        });
        /* eslint-enable @typescript-eslint/explicit-function-return-type, unicorn/consistent-function-scoping */
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_MEMBERS_SEARCH(guildID),
            json: {
                after: options?.after === undefined ? undefined : formatPaginationFilter(options.after),
                and_query: options?.andQuery === undefined ? undefined : formatSearchFilter(options.andQuery),
                before: options?.before === undefined ? undefined : formatPaginationFilter(options.before),
                limit: options?.limit,
                or_query: options?.orQuery === undefined ? undefined : formatSearchFilter(options.orQuery),
                sort: options?.sort
            }
        }).then(async (data) => {
            if ("retry_after" in data) {
                if (!retryOnIndexNotAvailable) {
                    throw new Error(`Member search for guild ${guildID} failed due to the index not being available.`);
                }
                let retryAfter = data.retry_after;
                if (retryAfter === 0) {
                    retryAfter = Math.floor(Math.random() * 30) + 15;
                }
                this._manager.client.emit("debug", `Retrying member search for ${guildID} in ${retryAfter} seconds...`);
                await (0, promises_1.setTimeout)(retryAfter * 1000);
                return this.memberSearch(guildID, options, false);
            }
            return {
                guildID: data.guild_id,
                members: data.members.map(m => ({
                    integrationType: m.integration_type,
                    inviterID: m.inviter_id,
                    joinSourceType: m.join_source_type,
                    member: this._manager.client.util.updateMember(guildID, m.member.user.id, m.member),
                    sourceInviteCode: m.source_invite_code
                })),
                pageResultCount: data.page_result_count,
                totalResultCount: data.total_result_count
            };
        });
    }
    /**
     * Remove a ban.
     * @param guildID The ID of the guild.
     * @param userID The ID of the user to remove the ban from.
     * @param reason The reason for removing the ban.
     * @caching This method **does not** cache its result.
     */
    async removeBan(guildID, userID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_BAN(guildID, userID),
            reason
        });
    }
    /**
     * Remove a member from a guild.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the user to remove.
     * @param reason The reason for the removal.
     * @caching This method **does not** cache its result.
     */
    async removeMember(guildID, memberID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_MEMBER(guildID, memberID),
            reason
        });
    }
    /**
     * Remove a role from a member.
     * @param guildID The ID of the guild.
     * @param memberID The ID of the member.
     * @param roleID The ID of the role to remove.
     * @param reason The reason for removing the role.
     * @caching This method **does not** cache its result.
     */
    async removeMemberRole(guildID, memberID, roleID, reason) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_MEMBER_ROLE(guildID, memberID, roleID),
            reason
        });
    }
    /**
     * Search the username & nicknames of members in a guild. See {@link REST/Guilds#memberSearch | memberSearch} for a more detailed search.
     * @param guildID The ID of the guild.
     * @param options The options to search with.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached.
     * @caches {@link Guild#members | Guild#members}
     */
    async searchMembers(guildID, options) {
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder_1.default();
        query.set("query", options.query);
        query.setIfPresent("limit", options.limit);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_SEARCH_MEMBERS(guildID),
            query
        }).then(data => data.map(d => this._manager.client.util.updateMember(guildID, d.user.id, d)));
    }
    /**
     * Sync a guild template.
     * @param guildID The ID of the guild.
     * @param code The code of the template to sync.
     * @caching This method **does not** cache its result.
     */
    async syncTemplate(guildID, code) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_TEMPLATE(guildID, code)
        }).then(data => new GuildTemplate_1.default(data, this._manager.client));
    }
}
exports.default = Guilds;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VpbGRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3JvdXRlcy9HdWlsZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBa0VBLCtEQUF5QztBQUl6QyxvR0FBb0U7QUFDcEUsNEVBQTRDO0FBUzVDLHdGQUF3RDtBQUV4RCxzRkFBc0Q7QUFZdEQsc0VBQXNDO0FBRXRDLDBFQUEwQztBQUMxQyxvRkFBb0Q7QUFDcEQsa0dBQWtFO0FBQ2xFLHdGQUF3RDtBQUV4RCx3RUFBd0M7QUFHeEMsa0dBQWtFO0FBQ2xFLGtGQUFrRDtBQUNsRCxrRkFBa0Q7QUFDbEQsZ0ZBQWdEO0FBQ2hELG1EQUFrRDtBQUVsRCxxSUFBcUk7QUFDckksTUFBcUIsTUFBTTtJQUNmLFFBQVEsQ0FBYztJQUM5QixZQUFZLE9BQW9CO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQWUsRUFBRSxNQUFjLEVBQUUsT0FBeUI7UUFDdEUsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBb0I7WUFDaEQsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQzVDLElBQUksRUFBSTtnQkFDSixZQUFZLEVBQUUsT0FBTyxDQUFDLFdBQVc7Z0JBQ2pDLElBQUksRUFBVSxPQUFPLENBQUMsSUFBSTtnQkFDMUIsSUFBSSxFQUFVLE9BQU8sQ0FBQyxJQUFJO2dCQUMxQixJQUFJLEVBQVUsT0FBTyxDQUFDLElBQUk7Z0JBQzFCLEtBQUssRUFBUyxPQUFPLENBQUMsS0FBSzthQUM5QjtTQUNKLENBQUMsQ0FBQyxJ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