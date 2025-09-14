"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/** @module Role */
const Base_1 = tslib_1.__importDefault(require("./Base"));
const Permission_1 = tslib_1.__importDefault(require("./Permission"));
const Errors_1 = require("../util/Errors");
/** Represents a role in a guild. */
class Role extends Base_1.default {
    _cachedGuild;
    /**
     * The color of this role.
     * @deprecated Use {@link Role#colors | Role#colors.primaryColor} instead.
     */
    color;
    /** The colors of this role. */
    colors;
    /** The {@link Constants~RoleFlags | flags } for this role. */
    flags;
    /** The id of the guild this role is in. */
    guildID;
    /** If this role is hoisted. */
    hoist;
    /** The icon has of this role. */
    icon;
    /** If this role is managed by an integration. */
    managed;
    /** If this role can be mentioned by anybody. */
    mentionable;
    /** The name of this role. */
    name;
    /** The permissions of this role. */
    permissions;
    /** The position of this role. */
    position;
    /** The [tags](https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure) of this role. */
    tags;
    /** The unicode emoji of this role. */
    unicodeEmoji;
    constructor(data, client, guildID) {
        super(data.id, client);
        this.color = data.color;
        this.colors = {
            primaryColor: data.colors.primary_color,
            secondaryColor: data.colors.secondary_color,
            tertiaryColor: data.colors.tertiary_color
        };
        this.flags = data.flags;
        this.guildID = guildID;
        this.hoist = !!data.hoist;
        this.icon = null;
        this.managed = !!data.managed;
        this.mentionable = !!data.mentionable;
        this.name = data.name;
        this.permissions = new Permission_1.default(data.permissions);
        this.position = data.position;
        this.unicodeEmoji = null;
        this.update(data);
    }
    update(data) {
        if (data.flags !== undefined) {
            this.flags = data.flags;
        }
        if (data.color !== undefined) {
            this.color = data.color;
        }
        if (data.colors !== undefined) {
            this.colors = {
                primaryColor: data.colors.primary_color,
                secondaryColor: data.colors.secondary_color,
                tertiaryColor: data.colors.tertiary_color
            };
        }
        if (data.hoist !== undefined) {
            this.hoist = data.hoist;
        }
        if (data.icon !== undefined) {
            this.icon = data.icon ?? null;
        }
        if (data.mentionable !== undefined) {
            this.mentionable = data.mentionable;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.permissions !== undefined) {
            this.permissions = new Permission_1.default(data.permissions);
        }
        if (data.position !== undefined) {
            this.position = data.position;
        }
        if (data.unicode_emoji !== undefined) {
            this.unicodeEmoji = data.unicode_emoji ?? null;
        }
        this.tags = {
            availableForPurchase: data.tags?.available_for_purchase === null,
            guildConnections: data.tags?.guild_connections === null,
            botID: data.tags?.bot_id,
            integrationID: data.tags?.integration_id,
            premiumSubscriber: data.tags?.premium_subscriber === null,
            subscriptionListingID: data.tags?.subscription_listing_id
        };
    }
    /** The guild this role is in. This will throw an error if the guild is not cached. */
    get guild() {
        this._cachedGuild ??= this.client.guilds.get(this.guildID);
        if (!this._cachedGuild) {
            if (this.client.options.restMode) {
                throw new Errors_1.UncachedError(`${this.constructor.name}#guild is not present when rest mode is enabled.`);
            }
            if (!this.client.shards.connected) {
                throw new Errors_1.UncachedError(`${this.constructor.name}#guild is not present without a gateway connection.`);
            }
            throw new Errors_1.UncachedError(`${this.constructor.name}#guild is not present.`);
        }
        return this._cachedGuild;
    }
    /** A string that will mention this role. */
    get mention() {
        return `<@&${this.id}>`;
    }
    /**
     * Delete this role.
     * @param reason The reason for deleting the role.
     */
    async delete(reason) {
        return this.client.rest.guilds.deleteRole(this.guildID, this.id, reason);
    }
    /**
     * Edit this role.
     * @param options The options for editing the role.
     */
    async edit(options) {
        return this.client.rest.guilds.editRole(this.guildID, this.id, options);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            color: this.color,
            colors: this.colors,
            guildID: this.guildID,
            hoist: this.hoist,
            icon: this.icon,
            managed: this.managed,
            mentionable: this.mentionable,
            name: this.name,
            permissions: this.permissions.toJSON(),
            position: this.position,
            tags: this.tags,
            unicodeEmoji: this.unicodeEmoji
        };
    }
}
exports.default = Role;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm9sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1JvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUJBQW1CO0FBQ25CLDBEQUEwQjtBQUMxQixzRUFBc0M7QUFLdEMsMkNBQStDO0FBRS9DLG9DQUFvQztBQUNwQyxNQUFxQixJQUFLLFNBQVEsY0FBSTtJQUMxQixZQUFZLENBQVM7SUFDN0I7OztPQUdHO0lBQ0gsS0FBSyxDQUFTO0lBQ2QsK0JBQStCO0lBQy9CLE1BQU0sQ0FBYTtJQUNuQiw4REFBOEQ7SUFDOUQsS0FBSyxDQUFTO0lBQ2QsMkNBQTJDO0lBQzNDLE9BQU8sQ0FBUztJQUNoQiwrQkFBK0I7SUFDL0IsS0FBSyxDQUFVO0lBQ2YsaUNBQWlDO0lBQ2pDLElBQUksQ0FBZ0I7SUFDcEIsaURBQWlEO0lBQ2pELE9BQU8sQ0FBVTtJQUNqQixnREFBZ0Q7SUFDaEQsV0FBVyxDQUFVO0lBQ3JCLDZCQUE2QjtJQUM3QixJQUFJLENBQVM7SUFDYixvQ0FBb0M7SUFDcEMsV0FBVyxDQUFhO0lBQ3hCLGlDQUFpQztJQUNqQyxRQUFRLENBQVM7SUFDakIsdUhBQXVIO0lBQ3ZILElBQUksQ0FBWTtJQUNoQixzQ0FBc0M7SUFDdEMsWUFBWSxDQUFnQjtJQUM1QixZQUFZLElBQWEsRUFBRSxNQUFjLEVBQUUsT0FBZTtRQUN0RCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRztZQUNWLFlBQVksRUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWE7WUFDekMsY0FBYyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZTtZQUMzQyxhQUFhLEVBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjO1NBQzdDLENBQUM7UUFDRixJQUFJ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