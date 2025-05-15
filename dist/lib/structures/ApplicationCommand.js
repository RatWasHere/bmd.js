"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/** @module ApplicationCommand */
const Base_1 = tslib_1.__importDefault(require("./Base"));
const Permission_1 = tslib_1.__importDefault(require("./Permission"));
const Constants_1 = require("../Constants");
const Errors_1 = require("../util/Errors");
/** Represents an application command. */
class ApplicationCommand extends Base_1.default {
    _cachedGuild;
    /** The application this command is for. */
    application;
    /** The ID of application this command is for. */
    applicationID;
    /** The contexts in which this application command can be used in. */
    contexts;
    /** The default permissions for this command. */
    defaultMemberPermissions;
    /** The description of this command. Empty string for non `CHAT_INPUT` commands. */
    description;
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized descriptions. */
    descriptionLocalizations;
    /** The description of this application command in the requested locale. */
    descriptionLocalized;
    /** If this command can be used in direct messages (global commands only). */
    dmPermission;
    /** The id of the guild this command is in (guild commands only). */
    guildID;
    /** The handler of this command. Only valid for `PRIMARY_ENTRY_POINT` commands. */
    handler;
    /** The installation contexts in which this command is available. */
    integrationTypes;
    /** The name of this command. */
    name;
    /** A dictionary of [locales](https://discord.com/developers/docs/reference#locales) to localized names. */
    nameLocalizations;
    /** The description of this application command in the requested locale. */
    nameLocalized;
    /** Whether the command is age restricted. */
    nsfw;
    /** The options on this command. Only valid for `CHAT_INPUT`. */
    options;
    /** The [type](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types) of this command. */
    type;
    /** Autoincrementing version identifier updated during substantial record changes. */
    version;
    constructor(data, client) {
        super(data.id, client);
        this.application = client["_application"] && client.application.id === data.application_id ? client.application : undefined;
        this.applicationID = data.application_id;
        this.contexts = data.contexts;
        this.defaultMemberPermissions = data.default_member_permissions ? new Permission_1.default(data.default_member_permissions) : null;
        this.description = data.description;
        this.descriptionLocalizations = data.description_localizations;
        this.descriptionLocalized = data.description_localized;
        this.dmPermission = data.dm_permission;
        this.guildID = data.guild_id ?? null;
        this.handler = data.handler;
        this.integrationTypes = data.integration_types;
        this.name = data.name;
        this.nameLocalizations = data.name_localizations;
        this.nameLocalized = data.name_localized;
        this.nsfw = data.nsfw;
        this.options = data.options?.map(o => client.util.optionToParsed(o));
        this.type = (data.type ?? Constants_1.ApplicationCommandTypes.CHAT_INPUT);
        this.version = data.version;
    }
    /** The guild this command is in (guild commands only). This will throw an error if the guild is not cached. */
    get guild() {
        if (this.guildID !== null && this._cachedGuild !== null) {
            this._cachedGuild ??= this.client.guilds.get(this.guildID);
            if (!this._cachedGuild) {
                throw new Errors_1.UncachedError(this, "guild", "GUILDS", this.client);
            }
            return this._cachedGuild;
        }
        return this._cachedGuild === null ? this._cachedGuild : (this._cachedGuild = null);
    }
    /**
     * Delete this command.
     */
    async delete() {
        return this.guildID ? this.client.rest.applications.deleteGuildCommand(this.applicationID, this.guildID, this.id) : this.client.rest.applications.deleteGlobalCommand(this.applicationID, this.id);
    }
    /**
     * Edit this command.
     * @param options The options for editing the command.
     */
    async edit(options) {
        return this.guildID ? this.client.rest.applications.editGuildCommand(this.applicationID, this.guildID, this.id, options) : this.client.rest.applications.editGlobalCommand(this.applicationID, this.id, options);
    }
    /**
     * Edit this command's permissions (guild commands only). This requires a bearer token with the `applications.commands.permissions.update` scope.
     * @param options The options for editing the permissions.
     */
    async editGuildCommandPermissions(options) {
        if (!this.guildID) {
            throw new TypeError("editGuildCommandPermissions cannot be used on global commands.");
        }
        return this.client.rest.applications.editGuildCommandPermissions(this.applicationID, this.guildID, this.id, options);
    }
    /**
     * Get this command's permissions (guild commands only).
     */
    async getGuildPermission() {
        if (!this.guildID) {
            throw new TypeError("getGuildPermission cannot be used on global commands.");
        }
        return this.client.rest.applications.getGuildPermission(this.applicationID, this.guildID, this.id);
    }
    /**
     * Get a mention for this command.
     * @param sub The subcommand group and/or subcommand to include (["subcommand"] or ["subcommand-group", "subcommand"]).
     */
    mention(sub) {
        let text = `${this.name}`;
        if (sub?.length) {
            text += ` ${sub.slice(0, 2).join(" ")}`;
        }
        return `</${text}:${this.id}>`;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            applicationID: this.applicationID,
            contexts: this.contexts,
            defaultMemberPermissions: this.defaultMemberPermissions?.toJSON(),
            description: this.description,
            descriptionLocalizations: this.descriptionLocalizations,
            dmPermission: this.dmPermission,
            guildID: this.guildID ?? undefined,
            handler: this.handler,
            integrationTypes: this.integrationTypes,
            name: this.name,
            nameLocalizations: this.nameLocalizations,
            nsfw: this.nsfw,
            options: this.options,
            type: this.type,
            version: this.version
        };
    }
}
exports.default = ApplicationCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwbGljYXRpb25Db21tYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvQXBwbGljYXRpb25Db21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFpQztBQUNqQywwREFBMEI7QUFDMUIsc0VBQXNDO0FBSXRDLDRDQUEySjtBQVczSiwyQ0FBK0M7QUFFL0MseUNBQXlDO0FBQ3pDLE1BQXFCLGtCQUFnRixTQUFRLGNBQUk7SUFDckcsWUFBWSxDQUFnQjtJQUNwQywyQ0FBMkM7SUFDM0MsV0FBVyxDQUFxQjtJQUNoQyxpREFBaUQ7SUFDakQsYUFBYSxDQUFTO0lBQ3RCLHFFQUFxRTtJQUNyRSxRQUFRLENBQWlDO0lBQ3pDLGdEQUFnRDtJQUNoRCx3QkFBd0IsQ0FBb0I7SUFDNUMsbUZBQW1GO0lBQ25GLFdBQVcsQ0FBNkQ7SUFDeEUsa0hBQWtIO0lBQ2xILHdCQUF3QixDQUFvQjtJQUM1QywyRUFBMkU7SUFDM0Usb0JBQW9CLENBQVU7SUFDOUIsNkVBQTZFO0lBQzdFLFlBQVksQ0FBVztJQUN2QixvRUFBb0U7SUFDcEUsT0FBTyxDQUFnQjtJQUN2QixrRkFBa0Y7SUFDbEYsT0FBTyxDQUFpQztJQUN4QyxvRUFBb0U7SUFDcEUsZ0JBQWdCLENBQXFDO0lBQ3JELGdDQUFnQztJQUNoQyxJQUFJLENBQVM7SUFDYiwyR0FBMkc7SUFDM0csaUJBQWlCLENBQW9CO0lBQ3JDLDJFQUEyRTtJQUMzRSxhQUFhLENBQVU7SUFDdkIsNkNBQTZDO0lBQzdDLElBQUksQ0FBVztJQUNmLGdFQUFnRTtJQUNoRSxPQUFPLENBQW9DO0lBQzNDLDhKQUE4SjtJQUM5SixJQUFJLENBQUk7SUFDUixxRkFBcUY7SUFDckYsT0FBTyxDQUFTO0lBQ2hCLFlBQVksSUFBMkIsRUFBRSxNQUFjO1FBQ25ELEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FB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