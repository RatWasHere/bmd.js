"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/** @module REST/Miscellaneous */
const Routes = tslib_1.__importStar(require("../util/Routes"));
const Soundboard_1 = tslib_1.__importDefault(require("../structures/Soundboard"));
/** Methods that don't fit anywhere else. Located at {@link Client#rest | Client#rest}{@link RESTManager#misc | .misc}. */
class Miscellaneous {
    _manager;
    constructor(manager) {
        this._manager = manager;
    }
    /**
     * Get the default soundboard sounds.
     * @caching This method **does not** cache its result.
     */
    async getDefaultSoundboardSounds() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.SOUNDBOARD_DEFAULT_SOUNDS
        }).then(data => data.map(d => new Soundboard_1.default(d, this._manager.client)));
    }
    /**
     * Get a sticker.
     * @param stickerID The ID of the sticker to get.
     * @caching This method **may** cache its result. The result will not be cached if the guild is not cached, or if the sticker is not a guild sticker.
     * @caches {@link Guild#stickers | Guild#stickers}
     */
    async getSticker(stickerID) {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.STICKER(stickerID)
        }).then(data => data.guild_id === undefined ? this._manager.client.util.convertSticker(data) : this._manager.client.guilds.get(data.guild_id)?.stickers.update(data) ?? this._manager.client.util.convertSticker(data));
    }
    /**
     * Get the default sticker packs.
     * @caching This method **does not** cache its result.
     */
    async getStickerPacks() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.STICKER_PACKS
        }).then(data => data.sticker_packs.map(pack => ({
            bannerAssetID: pack.banner_asset_id,
            coverStickerID: pack.cover_sticker_id,
            description: pack.description,
            id: pack.id,
            name: pack.name,
            skuID: pack.sku_id,
            stickers: pack.stickers.map(sticker => this._manager.client.util.convertSticker(sticker))
        })));
    }
    /**
     * Get the list of usable voice regions.
     * @caching This method **does not** cache its result.
     */
    async getVoiceRegions() {
        return this._manager.authRequest({
            method: "GET",
            path: Routes.VOICE_REGIONS
        });
    }
    /**
     * Refresh expired attachment URLs.
     * @param urls The CDN urls to refresh.
     */
    async refreshAttachmentURLs(urls) {
        return this._manager.authRequest({
            method: "POST",
            path: Routes.REFRESH_ATTACHMENT_URLS,
            json: {
                attachment_urls: urls
            }
        }).then(data => ({
            refreshedURLs: data.refreshed_urls
        }));
    }
}
exports.default = Miscellaneous;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlzY2VsbGFuZW91cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9yb3V0ZXMvTWlzY2VsbGFuZW91cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBaUM7QUFDakMsK0RBQXlDO0FBS3pDLGtGQUFrRDtBQUdsRCwwSEFBMEg7QUFDMUgsTUFBcUIsYUFBYTtJQUN0QixRQUFRLENBQWM7SUFDOUIsWUFBWSxPQUFvQjtRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLDBCQUEwQjtRQUM1QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUF1QjtZQUNuRCxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMseUJBQXlCO1NBQzNDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxvQkFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQWlCO1FBQzlCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQWE7WUFDekMsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7U0FDcEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM1TixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGVBQWU7UUFDakIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBNEM7WUFDeEUsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUksTUFBTSxDQUFDLGFBQWE7U0FDL0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QyxhQUFhLEVBQUcsSUFBSSxDQUFDLGVBQWU7WUFDcEMsY0FBYyxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7WUFDckMsV0FBVyxFQUFLLElBQUksQ0FBQyxXQUFXO1lBQ2hDLEVBQUUsRUFBYyxJQUFJLENBQUMsRUFBRTtZQUN2QixJQUFJLEVBQVksSUFBSSxDQUFDLElBQUk7WUFDekIsS0FBSyxFQUFXLElBQUksQ0FBQyxNQUFNO1lBQzNCLFFBQVEsRUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbEcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNULENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsZUFBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFxQjtZQUNqRCxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBSSxNQUFNLENBQUMsYUFBYTtTQUMvQixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQW1CO1FBQzNDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQW1DO1lBQy9ELE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFJLE1BQU0sQ0FBQyx1QkFBdUI7WUFDdEMsSUFBSSxFQUFJO2dCQUNKLGVBQWUsRUFBRSxJQUFJO2FBQ3hCO1NBQ0osQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDYixhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWM7U0FDckMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO0NBQ0o7QUEzRUQsZ0NBMkVDIn0=