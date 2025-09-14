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
const QueryBuilder_1 = tslib_1.__importDefault(require("../util/QueryBuilder"));
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
        const opts = this._manager.client.util._freeze(options);
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
        options = this._manager.client.util._freeze(options);
        let image;
        if (options.image) {
            image = this._manager.client.util._convertImage(options.image, "image");
        }
        return this._manager.authRequest({
            method: "POST",
            path: Routes.APPLICATION_EMOJIS(applicationID),
            json: {
                name: options.name,
                image
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
        const opt = this._manager.client.util._freeze(options);
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
        const opt = this._manager.client.util._freeze(options);
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
        options = this._manager.client.util._freeze(options);
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
        options = this._manager.client.util._freeze(options);
        let coverImage, icon;
        if (options.coverImage) {
            coverImage = this._manager.client.util._convertImage(options.coverImage, "cover image");
        }
        if (options.icon) {
            icon = this._manager.client.util._convertImage(options.icon, "icon");
        }
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.APPLICATION,
            json: {
                cover_image: coverImage,
                custom_install_url: options.customInstallURL,
                description: options.description,
                event_webhooks_status: options.eventWebhooksStatus,
                event_webhooks_types: options.eventWebhooksTypes,
                event_webhooks_url: options.eventWebhooksURL,
                flags: options.flags,
                icon,
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
        options = this._manager.client.util._freeze(options);
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
        const opt = this._manager.client.util._freeze(options);
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
        const opt = this._manager.client.util._freeze(options);
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
        options = this._manager.client.util._freeze(options);
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
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder_1.default();
        query.setIfPresent("after", options.after);
        query.setIfPresent("before", options.before);
        query.setIfPresent("exclude_deleted", options.excludeDeleted);
        query.setIfPresent("exclude_ended", options.excludeEnded);
        query.setIfPresent("guild_id", options.guildID);
        query.setIfPresent("limit", options.limit);
        query.setIfPresent("sku_ids", options.skuIDs?.join(","));
        query.setIfPresent("user_id", options.userID);
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
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder_1.default();
        query.setIfPresent("with_localizations", options?.withLocalizations);
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
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder_1.default();
        query.setIfPresent("with_localizations", options?.withLocalizations);
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
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder_1.default();
        query.setIfPresent("with_localizations", options?.withLocalizations);
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
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder_1.default();
        query.setIfPresent("with_localizations", options?.withLocalizations);
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
        options = this._manager.client.util._freeze(options);
        const query = new QueryBuilder_1.default();
        query.setIfPresent("after", options.after);
        query.setIfPresent("before", options.before);
        query.setIfPresent("limit", options.limit);
        query.setIfPresent("user_id", options.userID);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwbGljYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3JvdXRlcy9BcHBsaWNhdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQXVDO0FBQ3ZDLCtEQUF5QztBQXFCekMsa0dBQWtFO0FBR2xFLG9FQUFvQztBQUNwQyxvRkFBb0Q7QUFDcEQsNEZBQTREO0FBQzVELGdHQUFnRTtBQWlCaEUsb0ZBQW9EO0FBQ3BELHNGQUFzRDtBQUN0RCxnRkFBZ0Q7QUFFaEQsK0pBQStKO0FBQy9KLE1BQXFCLFlBQVk7SUFDckIsUUFBUSxDQUFjO0lBQzlCLFlBQVksT0FBb0I7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLHNCQUFzQixDQUFDLGFBQXFCLEVBQUUsT0FBK0M7UUFDL0YsTUFBTSxJQUFJLEdBQUcsT0FBMEQsQ0FBQztRQUN4RSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUErQjtZQUMzRCxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDO1lBQ2xELElBQUksRUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDckIsUUFBUSxFQUFvQixHQUFHLENBQUMsUUFBUTtnQkFDeEMsV0FBVyxFQUFpQixHQUFHLENBQUMsV0FBVztnQkFDM0MsMEJBQTBCLEVBQUUsR0FBRyxDQUFDLHdCQUF3QjtnQkFDeEQseUJBQXlCLEVBQUcsR0FBRyxDQUFDLHdCQUF3QjtnQkFDeEQsYUFBYSxFQUFlLEdBQUcsQ0FBQyxZQUFZO2dCQUM1QyxPQUFPLEVBQXNCLEdBQW1FLENBQUMsT0FBTztnQkFDeEcsaUJBQWlCLEVBQVcsR0FBRyxDQUFDLGdCQUFnQjtnQkFDaEQsSUFBSSxFQUF3QixHQUFHLENBQUMs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