"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/** @module REST/ApplicationCommands */
const Routes = tslib_1.__importStar(require("../util/Routes"));
const ApplicationCommand_1 = tslib_1.__importDefault(require("../structures/ApplicationCommand"));
const SKU_1 = tslib_1.__importDefault(require("../structures/SKU"));
const Entitlement_1 = tslib_1.__importDefault(require("../structures/Entitlement"));
const TestEntitlement_1 = tslib_1.__importDefault(require("../structures/TestEntitlement"));
const ClientApplication_1 = tslib_1.__importDefault(require("../structures/ClientApplication"));
const Application_1 = tslib_1.__importDefault(require("../structures/Application"));
const Subscription_1 = tslib_1.__importDefault(require("../structures/Subscription"));
/** Various methods for interacting with application commands. Located at {@link Client#rest | Client#rest}{@link RESTManager#applications | .applications}. */
class Applications {
    _manager;
    constructor(manager) {
        this._manager = manager;
    }
    /**
     * Overwrite all existing global application commands.
     * @param applicationID The ID of the application.
     * @param options The commands.
     * @caching This method **does not** cache its result.
     */
    async bulkEditGlobalCommands(applicationID, options) {
        const opts = options;
        return this._manager.authRequest({
            method: "PUT",
            path: Routes.APPLICATION_COMMANDS(applicationID),
            json: opts.map(opt => ({
                contexts: opt.contexts,
                description: opt.description,
                default_member_permissions: opt.defaultMemberPermissions,
                description_localizations: opt.descriptionLocalizations,
                dm_permission: opt.dmPermission,
                handler: opt.handler,
                integration_types: opt.integrationTypes,
                name: opt.name,
                name_localizations: opt.nameLocalizations,
                nsfw: opt.nsfw,
                options: opt.options?.map(o => this._manager.client.util.optionToRaw(o)),
                type: opt.type
            }))
        }).then(data => data.map(d => new ApplicationCommand_1.default(d, this._manager.client)));
    }
    /**
     * Overwrite all existing application commands in a guild.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param options The commands.
     * @caching This method **does not** cache its result.
     */
    async bulkEditGuildCommands(applicationID, guildID, options) {
        const opts = options;
        return this._manager.authRequest({
            method: "PUT",
            path: Routes.GUILD_APPLICATION_COMMANDS(applicationID, guildID),
            json: opts.map(opt => ({
                id: opt.id,
                default_member_permissions: opt.defaultMemberPermissions,
                description: opt.description,
                description_localizations: opt.descriptionLocalizations,
                dm_permission: opt.dmPermission,
                name: opt.name,
                name_localizations: opt.nameLocalizations,
                nsfw: opt.nsfw,
                options: opt.options?.map(o => this._manager.client.util.optionToRaw(o)),
                type: opt.type
            }))
        }).then(data => data.map(d => new ApplicationCommand_1.default(d, this._manager.client)));
    }
    /**
     * Mark an entitlement as consumed.
     * @param applicationID The ID of the application to the entitlement is for.
     * @param entitlementID The ID of the entitlement to consume.
     */
    async consumeEntitlement(applicationID, entitlementID) {
        await this._manager.authRequest({
            method: "POST",
            path: Routes.CONSUME_ENTITLEMENT(applicationID, entitlementID)
        });
    }
    /**
     * Create an emoji for an application.
     * @param applicationID The ID of the application.
     * @param options The options for creating the emoji.
     * @caching This method **does not** cache its result.
     */
    async createEmoji(applicationID, options) {
        if (options.image) {
            options.image = this._manager.client.util._convertImage(options.image, "image");
        }
        return this._manager.authRequest({
            method: "POST",
            path: Routes.APPLICATION_EMOJIS(applicationID),
            json: {
                name: options.name,
                image: options.image
            }
        }).then(emoji => this._manager.client.util.convertApplicationEmoji(emoji));
    }
    /**
     * Create a global application command.
     * @param applicationID The ID of the application.
     * @param options The options for the command.
     * @caching This method **does not** cache its result.
     */
    async createGlobalCommand(applicationID, options) {
        const opt = options;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.APPLICATION_COMMANDS(applicationID),
            json: {
                contexts: opt.contexts,
                default_member_permissions: opt.defaultMemberPermissions,
                description_localizations: opt.descriptionLocalizations,
                description: opt.description,
                dm_permission: opt.dmPermission,
                handler: opt.handler,
                integration_types: opt.integrationTypes,
                name_localizations: opt.nameLocalizations,
                name: opt.name,
                nsfw: opt.nsfw,
                options: opt.options?.map(o => this._manager.client.util.optionToRaw(o)),
                type: opt.type
            }
        }).then(data => new ApplicationCommand_1.default(data, this._manager.client));
    }
    /**
     * Create a guild application command.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param options The options for the command.
     * @caching This method **does not** cache its result.
     */
    async createGuildCommand(applicationID, guildID, options) {
        const opt = options;
        return this._manager.authRequest({
            method: "POST",
            path: Routes.GUILD_APPLICATION_COMMANDS(applicationID, guildID),
            json: {
                default_member_permissions: opt.defaultMemberPermissions,
                description: opt.description,
                description_localizations: opt.descriptionLocalizations,
                dm_permission: opt.dmPermission,
                name: opt.name,
                name_localizations: opt.nameLocalizations,
                nsfw: opt.nsfw,
                options: opt.options?.map(o => this._manager.client.util.optionToRaw(o)),
                type: opt.type
            }
        }).then(data => new ApplicationCommand_1.default(data, this._manager.client));
    }
    /**
     * Create a test entitlement.
     * @param applicationID The ID of the application to create the entitlement for.
     * @param options The options for creating the test entitlement.
     */
    async createTestEntitlement(applicationID, options) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.ENTITLEMENTS(applicationID),
            json: {
                owner_id: options.ownerID,
                owner_type: options.ownerType,
                sku_id: options.skuID
            }
        }).then(data => new TestEntitlement_1.default(data, this._manager.client));
    }
    /**
     * Delete an emoji for an application.
     * @param applicationID The ID of the application.
     * @param emojiID The ID of the emoji to be deleted.
     * @caching This method **does not** cache its result.
     */
    async deleteEmoji(applicationID, emojiID) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.APPLICATION_EMOJI(applicationID, emojiID)
        });
    }
    /**
     * Delete a global application command.
     * @param applicationID The ID of the application.
     * @param commandID The ID the command to delete.
     * @caching This method **does not** cache its result.
     */
    async deleteGlobalCommand(applicationID, commandID) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.APPLICATION_COMMAND(applicationID, commandID)
        });
    }
    /**
     * Delete a guild application command.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command to delete.
     * @caching This method **does not** cache its result.
     */
    async deleteGuildCommand(applicationID, guildID, commandID) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.GUILD_APPLICATION_COMMAND(applicationID, guildID, commandID)
        });
    }
    /**
     * Delete an entitlement.
     * @param applicationID The ID of the application to delete the entitlement from.
     * @param entitlementID The ID of the entitlement to delete.
     */
    async deleteTestEntitlement(applicationID, entitlementID) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.ENTITLEMENT(applicationID, entitlementID)
        });
    }
    /**
     * Edit the currently authenticated bot's application info.
     * @param options The options for editing the application.
     * @caching This method **does not** cache its result.
     */
    async editCurrent(options) {
        if (options.coverImage) {
            options.coverImage = this._manager.client.util._convertImage(options.coverImage, "cover image");
        }
        if (options.icon) {
            options.icon = this._manager.client.util._convertImage(options.icon, "cover image");
        }
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.APPLICATION,
            json: {
                cover_image: options.coverImage,
                custom_install_url: options.customInstallURL,
                description: options.description,
                event_webhooks_status: options.eventWebhooksStatus,
                event_webhooks_types: options.eventWebhooksTypes,
                event_webhooks_url: options.eventWebhooksURL,
                flags: options.flags,
                icon: options.icon,
                install_params: options.installParams,
                integration_types_config: options.integrationTypesConfig,
                interactions_endpoint_url: options.interactionsEndpointURL,
                role_connections_verification_url: options.roleConnectionsVerificationURL,
                tags: options.tags
            }
        }).then(data => new Application_1.default(data, this._manager.client));
    }
    /**
     * Edit an existing emoji for an application.
     * @param applicationID The ID of the application.
     * @param emojiID The ID of the emoji to be edited.
     * @param options The options for editing the emoji.
     * @caching This method **does not** cache its result.
     */
    async editEmoji(applicationID, emojiID, options) {
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.APPLICATION_EMOJI(applicationID, emojiID),
            json: { name: options.name }
        }).then(emoji => this._manager.client.util.convertApplicationEmoji(emoji));
    }
    /**
     * Edit a global application command.
     * @param applicationID The ID of the application.
     * @param commandID The ID of the command to edit.
     * @param options The options for editing the command.
     * @caching This method **does not** cache its result.
     */
    async editGlobalCommand(applicationID, commandID, options) {
        const opt = options;
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.APPLICATION_COMMAND(applicationID, commandID),
            json: {
                contexts: opt.contexts,
                default_member_permissions: opt.defaultMemberPermissions,
                description: opt.description,
                description_localizations: opt.descriptionLocalizations,
                dm_permission: opt.dmPermission,
                integration_types: opt.integrationTypes,
                name: opt.name,
                name_localizations: opt.nameLocalizations,
                nsfw: opt.nsfw,
                options: opt.options?.map(o => this._manager.client.util.optionToRaw(o))
            }
        }).then(data => new ApplicationCommand_1.default(data, this._manager.client));
    }
    /**
     * Edit a guild application command.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command to edit.
     * @param options The options for editing the command.
     * @caching This method **does not** cache its result.
     */
    async editGuildCommand(applicationID, guildID, commandID, options) {
        const opt = options;
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.GUILD_APPLICATION_COMMAND(applicationID, guildID, commandID),
            json: {
                default_member_permissions: opt.defaultMemberPermissions,
                description: opt.description,
                description_localizations: opt.descriptionLocalizations,
                dm_permission: opt.dmPermission,
                name: opt.name,
                name_localizations: opt.nameLocalizations,
                nsfw: opt.nsfw,
                options: opt.options?.map(o => this._manager.client.util.optionToRaw(o))
            }
        }).then(data => new ApplicationCommand_1.default(data, this._manager.client));
    }
    /**
     * Edit a guild application command's permissions. This requires a bearer token with the `applications.commands.permissions.update` scope.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for editing the permissions.
     * @caching This method **does not** cache its result.
     */
    async editGuildCommandPermissions(applicationID, guildID, commandID, options) {
        return (options.accessToken ? this._manager.request.bind(this._manager) : this._manager.authRequest.bind(this._manager))({
            method: "PATCH",
            path: Routes.GUILD_APPLICATION_COMMAND_PERMISSION(applicationID, guildID, commandID),
            json: { permissions: options.permissions },
            auth: options.accessToken
        }).then(data => {
            const d = data;
            return {
                applicationID: d.application_id,
                guildID: d.guild_id,
                id: d.id,
                permissions: d.permissions
            };
        });
    }
    /**
     * Get an activity instance.
     * @param applicationID The ID of the application.
     * @param instanceID The ID of the instance.
     */
    async getActivityInstance(applicationID, instanceID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.APPLICATION_ACTIVITY_INSTANCE(applicationID, instanceID)
        }).then(data => ({
            applicationID: data.application_id,
            instanceID: data.instance_id,
            launchID: data.launch_id,
            location: {
                channelID: data.location.channel_id,
                guildID: data.location.guild_id,
                id: data.location.id,
                kind: data.location.kind
            },
            users: data.users
        }));
    }
    /**
     * Get the currently authenticated bot's application info as a bare {@link ClientApplication | ClientApplication}.
     * @caching This method **does not** cache its result.
     */
    async getClient() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.APPLICATION
        }).then(data => new ClientApplication_1.default(data, this._manager.client));
    }
    /**
     * Get the currently authenticated bot's application info.
     * @caching This method **does not** cache its result.
     */
    async getCurrent() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.APPLICATION
        }).then(data => new Application_1.default(data, this._manager.client));
    }
    /**
     * Get an emoji for an application.
     * @param applicationID The ID of the application to get the emojis of.
     * @param emojiID The ID of the emoji to get.
     * @caching This method **does not** cache its result.
     */
    async getEmoji(applicationID, emojiID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.APPLICATION_EMOJI(applicationID, emojiID)
        }).then(emoji => this._manager.client.util.convertApplicationEmoji(emoji));
    }
    /**
     * Get the emojis for an application.
     * @param applicationID The ID of the application to get the emojis of.
     * @caching This method **does not** cache its result.
     */
    async getEmojis(applicationID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.APPLICATION_EMOJIS(applicationID)
        }).then(({ items }) => ({
            items: items.map(item => this._manager.client.util.convertApplicationEmoji(item))
        }));
    }
    /**
     * Get the entitlements for an application.
     * @param applicationID The ID of the application to get the entitlements of.
     * @param options The options for getting the entitlements.
     */
    async getEntitlements(applicationID, options = {}) {
        const query = new URLSearchParams();
        if (options.after !== undefined)
            query.set("after", options.after);
        if (options.before !== undefined)
            query.set("before", options.before);
        if (options.excludeDeleted !== undefined)
            query.set("exclude_deleted", String(options.excludeDeleted));
        if (options.excludeEnded !== undefined)
            query.set("exclude_ended", String(options.excludeEnded));
        if (options.guildID !== undefined)
            query.set("guild_id", options.guildID);
        if (options.limit !== undefined)
            query.set("limit", String(options.limit));
        if (options.skuIDs !== undefined)
            query.set("sku_ids", options.skuIDs.join(","));
        if (options.userID !== undefined)
            query.set("user_id", options.userID);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.ENTITLEMENTS(applicationID),
            query
        }).then(data => data.map(d => "subscription_id" in d && d.subscription_id ? new Entitlement_1.default(d, this._manager.client) : new TestEntitlement_1.default(d, this._manager.client)));
    }
    /**
     * Get a global application command.
     * @param applicationID The ID of the application.
     * @param commandID The ID of the command.
     * @param options The options for getting the command.
     * @caching This method **does not** cache its result.
     */
    async getGlobalCommand(applicationID, commandID, options) {
        const query = new URLSearchParams();
        if (options?.withLocalizations !== undefined) {
            query.set("with_localizations", options.withLocalizations.toString());
        }
        return this._manager.authRequest({
            method: "GET",
            path: Routes.APPLICATION_COMMAND(applicationID, commandID),
            query,
            headers: options?.locale === undefined ? undefined : { "X-Discord-Locale": options.locale }
        }).then(data => new ApplicationCommand_1.default(data, this._manager.client));
    }
    /**
     * Get an application's global commands.
     * @param applicationID The ID of the application.
     * @param options The options for getting the command.
     * @caching This method **does not** cache its result.
     */
    async getGlobalCommands(applicationID, options) {
        const query = new URLSearchParams();
        if (options?.withLocalizations !== undefined) {
            query.set("with_localizations", options.withLocalizations.toString());
        }
        return this._manager.authRequest({
            method: "GET",
            path: Routes.APPLICATION_COMMANDS(applicationID),
            query,
            headers: options?.locale === undefined ? undefined : { "X-Discord-Locale": options.locale }
        }).then(data => data.map(d => new ApplicationCommand_1.default(d, this._manager.client)));
    }
    /**
     * Get a global application command.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @param options The options for getting the command.
     * @caching This method **does not** cache its result.
     */
    async getGuildCommand(applicationID, guildID, commandID, options) {
        const query = new URLSearchParams();
        if (options?.withLocalizations !== undefined) {
            query.set("with_localizations", options.withLocalizations.toString());
        }
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_APPLICATION_COMMAND(applicationID, commandID, guildID),
            query,
            headers: options?.locale === undefined ? undefined : { "X-Discord-Locale": options.locale }
        }).then(data => new ApplicationCommand_1.default(data, this._manager.client));
    }
    /**
     * Get an application's application commands in a specific guild.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param options The options for getting the command.
     * @caching This method **does not** cache its result.
     */
    async getGuildCommands(applicationID, guildID, options) {
        const query = new URLSearchParams();
        if (options?.withLocalizations !== undefined) {
            query.set("with_localizations", options.withLocalizations.toString());
        }
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_APPLICATION_COMMANDS(applicationID, guildID),
            query,
            headers: options?.locale === undefined ? undefined : { "X-Discord-Locale": options.locale }
        }).then(data => data.map(d => new ApplicationCommand_1.default(d, this._manager.client)));
    }
    /**
     * Get an application command's permissions in a guild.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @param commandID The ID of the command.
     * @caching This method **does not** cache its result.
     */
    async getGuildPermission(applicationID, guildID, commandID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_APPLICATION_COMMAND_PERMISSION(applicationID, guildID, commandID)
        }).then(data => ({
            applicationID: data.application_id,
            guildID: data.guild_id,
            id: data.id,
            permissions: data.permissions
        }));
    }
    /**
     * Get the permissions for all application commands in a guild.
     * @param applicationID The ID of the application.
     * @param guildID The ID of the guild.
     * @caching This method **does not** cache its result.
     */
    async getGuildPermissions(applicationID, guildID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.GUILD_APPLICATION_COMMAND_PERMISSIONS(applicationID, guildID)
        }).then(data => data.map(d => ({
            applicationID: d.application_id,
            guildID: d.guild_id,
            id: d.id,
            permissions: d.permissions
        })));
    }
    /**
     * Get the subscription for an SKU.
     * @param skuID The ID of the SKU to get the subscription of.
     * @param subscriptionID The ID of the subscription to get.
     */
    async getSKUSubscription(skuID, subscriptionID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.SKU_SUBSCRIPTION(skuID, subscriptionID)
        }).then(data => new Subscription_1.default(data, this._manager.client));
    }
    /**
     * Get the subscriptions for an SKU.
     * @param skuID The ID of the SKU to get the subscriptions of.
     * @param options The options for getting the subscriptions.
     */
    async getSKUSubscriptions(skuID, options) {
        const query = new URLSearchParams();
        if (options.after !== undefined)
            query.set("after", options.after);
        if (options.before !== undefined)
            query.set("before", options.before);
        if (options.limit !== undefined)
            query.set("limit", String(options.limit));
        if (options.userID !== undefined)
            query.set("user_id", options.userID);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.SKU_SUBSCRIPTIONS(skuID),
            query
        }).then(data => data.map(d => new Subscription_1.default(d, this._manager.client)));
    }
    /**
     * Get the SKUs for an application.
     * @param applicationID The ID of the application to get the SKUs of.
     */
    async getSKUs(applicationID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.SKUS(applicationID)
        }).then(data => data.map(d => new SKU_1.default(d, this._manager.client)));
    }
}
exports.default = Applications;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwbGljYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3JvdXRlcy9BcHBsaWNhdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQXVDO0FBQ3ZDLCtEQUF5QztBQXFCekMsa0dBQWtFO0FBR2xFLG9FQUFvQztBQUNwQyxvRkFBb0Q7QUFDcEQsNEZBQTREO0FBQzVELGdHQUFnRTtBQWlCaEUsb0ZBQW9EO0FBQ3BELHNGQUFzRDtBQUV0RCwrSkFBK0o7QUFDL0osTUFBcUIsWUFBWTtJQUNyQixRQUFRLENBQWM7SUFDOUIsWUFBWSxPQUFvQjtRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsc0JBQXNCLENBQUMsYUFBcUIsRUFBRSxPQUErQztRQUMvRixNQUFNLElBQUksR0FBRyxPQUEwRCxDQUFDO1FBQ3hFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQStCO1lBQzNELE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFJLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUM7WUFDbEQsSUFBSSxFQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQixRQUFRLEVBQW9CLEdBQUcsQ0FBQyxRQUFRO2dCQUN4QyxXQUFXLEVBQWlCLEdBQUcsQ0FBQyxXQUFXO2dCQUMzQywwQkFBMEIsRUFBRSxHQUFHLENBQUMsd0JBQXdCO2dCQUN4RCx5QkFBeUIsRUFBRyxHQUFHLENBQUMsd0JBQXdCO2dCQUN4RCxhQUFhLEVBQWUsR0FBRyxDQUFDLFlBQVk7Z0JBQzVDLE9BQU8sRUFBc0IsR0FBbUUsQ0FBQyxPQUFPO2dCQUN4RyxpQkFBaUIsRUFBVyxHQUFHLENBQUMsZ0JBQWdCO2dCQUNoRCxJQUFJLEVBQXdCLEdBQUcsQ0FBQyxJQUFJO2dCQUNwQyxr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