"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Routes = tslib_1.__importStar(require("../util/Routes"));
const OAuthApplication_1 = tslib_1.__importDefault(require("../structures/OAuthApplication"));
const PartialApplication_1 = tslib_1.__importDefault(require("../structures/PartialApplication"));
const Member_1 = tslib_1.__importDefault(require("../structures/Member"));
const Webhook_1 = tslib_1.__importDefault(require("../structures/Webhook"));
const Integration_1 = tslib_1.__importDefault(require("../structures/Integration"));
const OAuthHelper_1 = tslib_1.__importDefault(require("../rest/OAuthHelper"));
const OAuthGuild_1 = tslib_1.__importDefault(require("../structures/OAuthGuild"));
const ExtendedUser_1 = tslib_1.__importDefault(require("../structures/ExtendedUser"));
const QueryBuilder_1 = tslib_1.__importDefault(require("../util/QueryBuilder"));
/** Various methods for interacting with oauth. Located at {@link Client#rest | Client#rest}{@link RESTManager#oauth | .oauth}. */
class OAuth {
    _manager;
    constructor(manager) {
        this._manager = manager;
    }
    /**
     * Get an access token for the application owner. If the application is owned by a team, this is restricted to `identify` & `applications.commands.update`.
     * @param options The options to for the client credentials grant.
     * @caching This method **does not** cache its result.
     */
    async clientCredentialsGrant(options) {
        options = this._manager.client.util._freeze(options);
        const form = new FormData();
        form.append("grant_type", "client_credentials");
        form.append("scope", options.scopes.join(" "));
        return this._manager.request({
            method: "POST",
            path: Routes.OAUTH_TOKEN,
            form,
            auth: (options.clientID ?? this._manager.client["_application"]) && options.clientSecret ? `Basic ${Buffer.from(`${options.clientID ?? this._manager.client["_application"].id}:${options.clientSecret}`).toString("base64")}` : true
        }).then(data => ({
            accessToken: data.access_token,
            expiresIn: data.expires_in,
            scopes: data.scope.split(" "),
            tokenType: data.token_type,
            webhook: data.webhook ? new Webhook_1.default(data.webhook, this._manager.client) : null
        }));
    }
    /**
     * Exchange a code for an access token.
     * @param options The options for exchanging the code.
     * @caching This method **does not** cache its result.
     */
    async exchangeCode(options) {
        options = this._manager.client.util._freeze(options);
        const form = new FormData();
        form.append("client_id", options.clientID);
        form.append("client_secret", options.clientSecret);
        form.append("code", options.code);
        form.append("grant_type", "authorization_code");
        form.append("redirect_uri", options.redirectURI);
        return this._manager.authRequest({
            method: "POST",
            path: Routes.OAUTH_TOKEN,
            form
        }).then(data => ({
            accessToken: data.access_token,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            scopes: data.scope.split(" "),
            tokenType: data.token_type,
            webhook: data.webhook ? new Webhook_1.default(data.webhook, this._manager.client) : null
        }));
    }
    /**
     * Get the current OAuth2 application's information.
     * @caching This method **does not** cache its result.
     */
    async getApplication() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_APPLICATION
        }).then(data => new OAuthApplication_1.default(data, this._manager.client));
    }
    /**
     * Get information about the current authorization.
     *
     * Note: OAuth only. Bots cannot use this.
     * @caching This method **does** cache part of its result.
     * @caches {@link Client#users | Client#users}
     */
    async getCurrentAuthorizationInformation() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_INFO
        }).then(data => ({
            application: new PartialApplication_1.default(data.application, this._manager.client),
            expires: new Date(data.expires),
            scopes: data.scopes,
            user: this._manager.client.users.update(data.user)
        }));
    }
    /**
     * Get the connections of the currently authenticated user.
     *
     * Note: Requires the `connections` scope when using oauth.
     * @caching This method **does not** cache its result.
     */
    async getCurrentConnections() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_CONNECTIONS
        }).then(data => data.map(connection => ({
            friendSync: connection.friend_sync,
            id: connection.id,
            integrations: connection.integrations?.map(integration => new Integration_1.default(integration, this._manager.client)),
            name: connection.name,
            revoked: connection.revoked,
            showActivity: connection.show_activity,
            twoWayLink: connection.two_way_link,
            type: connection.type,
            verified: connection.verified,
            visibility: connection.visibility
        })));
    }
    /**
     * Get the guild member information about the currently authenticated user.
     *
     * Note: OAuth only. Requires the `guilds.members.read` scope. Bots cannot use this.
     * @param guild the ID of the guild
     * @caching This method **does not** cache its result.
     */
    async getCurrentGuildMember(guild) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_GUILD_MEMBER(guild)
        }).then(data => new Member_1.default(data, this._manager.client, guild));
    }
    /**
     * Get the currently authenticated user's guilds. Note these are missing several properties gateway guilds have.
     * @param options The options for getting the current user's guilds.
     * @caching This method **does not** cache its result.
     */
    async getCurrentGuilds(options) {
        const query = new QueryBuilder_1.default();
        query.setIfPresent("after", options?.after);
        query.setIfPresent("before", options?.before);
        query.setIfPresent("limit", options?.limit);
        query.setIfPresent("with_counts", options?.withCounts);
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_GUILDS,
            query
        }).then(data => data.map(d => new OAuthGuild_1.default(d, this._manager.client)));
    }
    /**
     * Get the currently authenticated user's information.
     * @caching This method **does not** cache its result.
     */
    async getCurrentUser() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_CURRENT_USER
        }).then(data => new ExtendedUser_1.default(data, this._manager.client));
    }
    /**
     * Get a helper instance that can be used with a specific access token.
     * @param accessToken The access token. Must be prefixed with `Bearer `.
     */
    getHelper(accessToken) {
        return new OAuthHelper_1.default(this._manager, accessToken);
    }
    /**
     * Get an application's role connection metadata records.
     * @param applicationID The ID of the application.
     * @caching This method **does not** cache its result.
     */
    async getRoleConnectionsMetadata(applicationID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.ROLE_CONNECTIONS_METADATA(applicationID)
        }).then(data => data.map(d => ({
            description: d.description,
            descriptionLocalizations: d.description_localizations,
            key: d.key,
            name: d.name,
            nameLocalizations: d.name_localizations,
            type: d.type
        })));
    }
    /**
     * Get the authenticated user's role connection object for an application. This requires the `role_connections.write` scope.
     * @param applicationID The ID of the application.
     * @caching This method **does not** cache its result.
     */
    async getUserRoleConnection(applicationID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.OAUTH_ROLE_CONNECTION(applicationID)
        }).then(data => ({
            metadata: Object.entries(data.metadata).map(([key, value]) => ({
                [key]: {
                    description: value.description,
                    descriptionLocalizations: value.description_localizations,
                    key: value.key,
                    name: value.name,
                    nameLocalizations: value.name_localizations,
                    type: value.type
                }
            })).reduce((a, b) => ({ ...a, ...b })),
            platformName: data.platform_name,
            platformUsername: data.platform_username
        }));
    }
    /**
     * Refresh an existing access token.
     * @param options The options for refreshing the token.
     * @caching This method **does not** cache its result.
     */
    async refreshToken(options) {
        options = this._manager.client.util._freeze(options);
        const form = new FormData();
        form.append("client_id", options.clientID);
        form.append("client_secret", options.clientSecret);
        form.append("grant_type", "refresh_token");
        form.append("refresh_token", options.refreshToken);
        return this._manager.authRequest({
            method: "POST",
            path: Routes.OAUTH_TOKEN,
            form
        }).then(data => ({
            accessToken: data.access_token,
            expiresIn: data.expires_in,
            refreshToken: data.refresh_token,
            scopes: data.scope.split(" "),
            tokenType: data.token_type
        }));
    }
    /**
     * Revoke an access token.
     * @param options The options for revoking the token.
     * @caching This method **does not** cache its result.
     */
    async revokeToken(options) {
        options = this._manager.client.util._freeze(options);
        const form = new FormData();
        form.append("client_id", options.clientID);
        form.append("client_secret", options.clientSecret);
        form.append("token", options.token);
        await this._manager.authRequest({
            method: "POST",
            path: Routes.OAUTH_TOKEN_REVOKE,
            form
        });
    }
    /**
     * Update an application's role connections metadata.
     * @param applicationID The ID of the application.
     * @param metadata The metadata records.
     * @caching This method **does not** cache its result.
     */
    async updateRoleConnectionsMetadata(applicationID, metadata) {
        return this._manager.authRequest({
            method: "PUT",
            path: Routes.ROLE_CONNECTIONS_METADATA(applicationID),
            json: metadata.map(d => ({
                description: d.description,
                description_localizations: d.descriptionLocalizations,
                key: d.key,
                name: d.name,
                name_localizations: d.nameLocalizations,
                type: d.type
            }))
        }).then(data => data.map(d => ({
            description: d.description,
            descriptionLocalizations: d.description_localizations,
            key: d.key,
            name: d.name,
            nameLocalizations: d.name_localizations,
            type: d.type
        })));
    }
    /**
     * Update the authenticated user's role connection object for an application. This requires the `role_connections.write` scope.
     * @param applicationID The ID of the application.
     * @param data The metadata to update.
     * @caching This method **does not** cache its result.
     */
    async updateUserRoleConnection(applicationID, data) {
        return this._manager.authRequest({
            method: "PUT",
            path: Routes.OAUTH_ROLE_CONNECTION(applicationID),
            json: {
                metadata: data.metadata,
                platform_name: data.platformName,
                platform_username: data.platformUsername
            }
        }).then(d => ({
            metadata: Object.entries(d.metadata).map(([key, value]) => ({
                [key]: {
                    description: value.description,
                    descriptionLocalizations: value.description_localizations,
                    key: value.key,
                    name: value.name,
                    nameLocalizations: value.name_localizations,
                    type: value.type
                }
            })).reduce((a, b) => ({ ...a, ...b })),
            platformName: d.platform_name,
            platformUsername: d.platform_username
        }));
    }
}
exports.default = OAuth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT0F1dGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcm91dGVzL09BdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQXVCQSwrREFBeUM7QUFDekMsOEZBQThEO0FBQzlELGtHQUFrRTtBQUNsRSwwRUFBMEM7QUFDMUMsNEVBQTRDO0FBQzVDLG9GQUFvRDtBQUVwRCw4RUFBOEM7QUFDOUMsa0ZBQWtEO0FBQ2xELHNGQUFzRDtBQUV0RCxnRkFBZ0Q7QUFFaEQsa0lBQWtJO0FBQ2xJLE1BQXFCLEtBQUs7SUFDZCxRQUFRLENBQWM7SUFDOUIsWUFBWSxPQUFvQjtRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxPQUFzQztRQUMvRCxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRCxNQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFvQztZQUM1RCxNQUFNLEVBQUUsTUFBTTtZQUNkLElBQUksRUFBSSxNQUFNLENBQUMsV0FBVztZQUMxQixJQUFJO1lBQ0osSUFBSSxFQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFFLENBQUMsRUFBRSxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJO1NBQzNPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2IsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQzlCLFNBQVMsRUFBSSxJQUFJLENBQUMsVUFBVTtZQUM1QixNQUFNLEVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQ2xDLFNBQVMsRUFBSSxJQUFJLENBQUMsVUFBVTtZQUM1QixPQUFPLEVBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtTQUNyRixDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUE0QjtRQUMzQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRCxNQUFNLElBQUksR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQTBCO1lBQ3RELE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFJLE1BQU0sQ0FBQyxXQUFXO1lBQzFCLElBQUk7U0FDUCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNiLFdBQVcsRUFBRyxJQUFJLENBQUMsWUFBWTtZQUMvQixTQUFTLEVBQUssSUFBSSxDQUFDLFVBQVU7WUFDN0IsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ2hDLE1BQU0sRUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDbkMsU0FBUyxFQUFLLElBQUksQ0FBQyxVQUFVO1lBQzdCLE9BQU8sRUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1NBQ3RGLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQXVCO1lBQ25ELE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFJLE1BQU0sQ0FBQyxpQkFBaUI7U0FDbkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksMEJBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsS0FBSyxDQUFDLGtDQUFrQztRQUNwQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUE4QjtZQUMxRCxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMsVUFBVTtTQUM1QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNiLFdBQVcsRUFBRSxJQUFJLDRCQUFrQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDM0UsT0FBTyxFQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDbkMsTUFBTSxFQUFPLElBQUksQ0FBQyxNQUFNO1lBQ3hCLElBQUksRUFBUyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDNUQsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMscUJBQXFCO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQXVCO1lBQ25ELE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFJLE1BQU0sQ0FBQyxpQkFBaUI7U0FDbkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLFVBQVUsRUFBSSxVQUFVLENBQUMsV0FBVztZQUNwQyxFQUFFLEVBQVksVUFBVSxDQUFDLEVBQUU7WUFDM0IsWUFBWSxFQUFFLFVBQVUsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxxQkFBVyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdHLElBQUksRUFBVSxVQUFVLENBQUMsSUFBSTtZQUM3QixPQUFPLEVBQU8sVUFBVSxDQUFDLE9BQU87WUFDaEMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxhQUFhO1lBQ3RDLFVBQVUsRUFBSSxVQUFVLENBQUMsWUFBWTtZQUNyQyxJQUFJLEVBQVUsVUFBVSxDQUFDLElBQUk7WUFDN0IsUUFBUSxFQUFNLFVBQVUsQ0FBQyxRQUFRO1lBQ2pDLFVBQVUsRUFBSSxVQUFVLENBQUMsVUFBVTtTQUN0QyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxLQUFhO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQWE7WUFDekMsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQztTQUMzQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxnQkFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQWlDO1FBQ3BELE1BQU0sS0FBSyxHQUFHLElBQUksc0JBQVksRUFBRSxDQUFDO1FBQ2pDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QyxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLEtBQUssQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN2RCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUF1QjtZQUNuRCxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMsWUFBWTtZQUMzQixLQUFLO1NBQ1IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLG9CQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFlO1lBQzNDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFJLE1BQU0sQ0FBQyxrQkFBa0I7U0FDcEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksc0JBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLENBQUMsV0FBbUI7UUFDekIsT0FBTyxJQUFJLHFCQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxhQUFxQjtRQUNsRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFtQztZQUMvRCxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMseUJBQXlCLENBQUMsYUFBYSxDQUFDO1NBQzFELENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMzQixXQUFXLEVBQWUsQ0FBQyxDQUFDLFdBQVc7WUFDdkMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QjtZQUNyRCxHQUFHLEVBQXVCLENBQUMsQ0FBQyxHQUFHO1lBQy9CLElBQUksRUFBc0IsQ0FBQyxDQUFDLElBQUk7WUFDaEMsaUJBQWlCLEVBQVMsQ0FBQyxDQUFDLGtCQUFrQjtZQUM5QyxJQUFJLEVBQXNCLENBQUMsQ0FBQyxJQUFJO1NBQ25DLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxhQUFxQjtRQUM3QyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFvQjtZQUNoRCxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDO1NBQ3RELENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2IsUUFBUSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUMzRCxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNILFdBQVcsRUFBZSxLQUFLLENBQUMsV0FBVztvQkFDM0Msd0JBQXdCLEVBQUUsS0FBSyxDQUFDLHlCQUF5QjtvQkFDekQsR0FBRyxFQUF1QixLQUFLLENBQUMsR0FBRztvQkFDbkMsSUFBSSxFQUFzQixLQUFLLENBQUMsSUFBSTtvQkFDcEMsaUJBQWlCLEVBQVMsS0FBSyxDQUFDLGtCQUFrQjtvQkFDbEQsSUFBSSxFQUFzQixLQUFLLENBQUMsSUFBSTtpQkFDdkM7YUFDSixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLFlBQVksRUFBTSxJQUFJLENBQUMsYUFBYTtZQUNwQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsaUJBQWlCO1NBQzNDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztJQUNEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQTRCO1FBQzNDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JELE1BQU0sSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBMEI7WUFDdEQsTUFBTSxFQUFFLE1BQU07WUFDZCxJQUFJLEVBQUksTUFBTSxDQUFDLFdBQVc7WUFDMUIsSUFBSTtTQUNQLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2IsV0FBVyxFQUFHLElBQUksQ0FBQyxZQUFZO1lBQy9CLFNBQVMsRUFBSyxJQUFJLENBQUMsVUFBVTtZQUM3QixZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWE7WUFDaEMsTUFBTSxFQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUNuQyxTQUFTLEVBQUssSUFBSSxDQUFDLFVBQVU7U0FDaEMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO0lBR0Q7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBMkI7UUFDekMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckQsTUFBTSxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFPO1lBQ2xDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFJLE1BQU0sQ0FBQyxrQkFBa0I7WUFDakMsSUFBSTtTQUNQLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxhQUFxQixFQUFFLFFBQXVDO1FBQzlGLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQW1DO1lBQy9ELE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFJLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxhQUFhLENBQUM7WUFDdkQsSUFBSSxFQUFJLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN2QixXQUFXLEVBQWdCLENBQUMsQ0FBQyxXQUFXO2dCQUN4Qyx5QkFBeUIsRUFBRSxDQUFDLENBQUMsd0JBQXdCO2dCQUNyRCxHQUFHLEVBQXdCLENBQUMsQ0FBQyxHQUFHO2dCQUNoQyxJQUFJLEVBQXVCLENBQUMsQ0FBQyxJQUFJO2dCQUNqQyxrQkFBa0IsRUFBUyxDQUFDLENBQUMsaUJBQWlCO2dCQUM5QyxJQUFJLEVBQXVCLENBQUMsQ0FBQyxJQUFJO2FBQ3BDLENBQUMsQ0FBQztTQUNOLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMzQixXQUFXLEVBQWUsQ0FBQyxDQUFDLFdBQVc7WUFDdkMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QjtZQUNyRCxHQUFHLEVBQXVCLENBQUMsQ0FBQyxHQUFHO1lBQy9CLElBQUksRUFBc0IsQ0FBQyxDQUFDLElBQUk7WUFDaEMsaUJBQWlCLEVBQVMsQ0FBQyxDQUFDLGtCQUFrQjtZQUM5QyxJQUFJLEVBQXNCLENBQUMsQ0FBQyxJQUFJO1NBQ25DLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsd0JBQXdCLENBQUMsYUFBcUIsRUFBRSxJQUFnRDtRQUNsRyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFvQjtZQUNoRCxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDO1lBQ25ELElBQUksRUFBSTtnQkFDSixRQUFRLEVBQVcsSUFBSSxDQUFDLFFBQVE7Z0JBQ2hDLGFBQWEsRUFBTSxJQUFJLENBQUMsWUFBWTtnQkFDcEMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQjthQUMzQztTQUNKLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ1YsUUFBUSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUN4RCxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNILFdBQVcsRUFBZSxLQUFLLENBQUMsV0FBVztvQkFDM0Msd0JBQXdCLEVBQUUsS0FBSyxDQUFDLHlCQUF5QjtvQkFDekQsR0FBRyxFQUF1QixLQUFLLENBQUMsR0FBRztvQkFDbkMsSUFBSSxFQUFzQixLQUFLLENBQUMsSUFBSTtvQkFDcEMsaUJBQWlCLEVBQVMsS0FBSyxDQUFDLGtCQUFrQjtvQkFDbEQsSUFBSSxFQUFzQixLQUFLLENBQUMsSUFBSTtpQkFDdkM7YUFDSixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLFlBQVksRUFBTSxDQUFDLENBQUMsYUFBYTtZQUNqQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsaUJBQWlCO1NBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQztDQUNKO0FBblRELHdCQW1UQyJ9