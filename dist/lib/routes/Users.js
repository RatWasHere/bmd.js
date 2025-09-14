"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Routes = tslib_1.__importStar(require("../util/Routes"));
const ExtendedUser_1 = tslib_1.__importDefault(require("../structures/ExtendedUser"));
/** Various methods for interacting with users. Located at {@link Client#rest | Client#rest}{@link RESTManager#users | .users}. */
class Users {
    _manager;
    constructor(manager) {
        this._manager = manager;
    }
    /** Alias for {@link REST/Channels#createDM | Channels#createDM}. */
    get createDM() {
        return this._manager.channels.createDM.bind(this._manager.channels);
    }
    /**
     * Edit the currently authenticated user.
     * @param options The options to edit with.
     * @caching This method **does not** cache its result.
     */
    async editSelf(options) {
        options = this._manager.client.util._freeze(options);
        let avatar, banner;
        if (options.avatar) {
            avatar = this._manager.client.util._convertImage(options.avatar, "avatar");
        }
        if (options.banner) {
            banner = this._manager.client.util._convertImage(options.banner, "banner");
        }
        return this._manager.authRequest({
            method: "PATCH",
            path: Routes.USER("@me"),
            json: {
                avatar,
                banner,
                username: options.username
            }
        }).then(data => new ExtendedUser_1.default(data, this._manager.client));
    }
    /**
     * Get a user.
     * @param userID the ID of the user
     * @caching This method **does** cache its result.
     * @caches {@link Client#users | Client#users}
     */
    async get(userID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.USER(userID)
        }).then(data => this._manager.client.users.update(data));
    }
    /**
     * Leave a guild.
     * @param guildID The ID of the guild to leave.
     * @caching This method **does not** cache its result.
     */
    async leaveGuild(guildID) {
        await this._manager.authRequest({
            method: "DELETE",
            path: Routes.OAUTH_GUILD(guildID)
        });
    }
}
exports.default = Users;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcm91dGVzL1VzZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLCtEQUF5QztBQUN6QyxzRkFBc0Q7QUFJdEQsa0lBQWtJO0FBQ2xJLE1BQXFCLEtBQUs7SUFDZCxRQUFRLENBQWM7SUFDOUIsWUFBWSxPQUFvQjtRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRUQsb0VBQW9FO0lBQ3BFLElBQUksUUFBUTtRQUNSLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUE0QjtRQUN2QyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRCxJQUFJLE1BQTBCLEVBQUUsTUFBMEIsQ0FBQztRQUMzRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNqQixNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9FLENBQUM7UUFFRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNqQixNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9FLENBQUM7UUFFRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFlO1lBQzNDLE1BQU0sRUFBRSxPQUFPO1lBQ2YsSUFBSSxFQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzFCLElBQUksRUFBSTtnQkFDSixNQUFNO2dCQUNOLE1BQU07Z0JBQ04sUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO2FBQzdCO1NBQ0osQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksc0JBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBYztRQUNwQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFVO1lBQ3RDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQzlCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQWU7UUFDNUIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBTztZQUNsQyxNQUFNLEVBQUUsUUFBUTtZQUNoQixJQUFJLEVBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUM7U0FDdEMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBOURELHdCQThEQyJ9