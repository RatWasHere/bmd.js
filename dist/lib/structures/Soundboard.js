"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/** @module Soundboard */
const Base_1 = tslib_1.__importDefault(require("./Base"));
const User_1 = tslib_1.__importDefault(require("./User"));
/** Represents a soundboard. */
class Soundboard extends Base_1.default {
    /** If the soundboard sound can be used. */
    available;
    /** The emoji id of the soundboard sound. */
    emojiID;
    /** The emoji name of the soundboard sound. */
    emojiName;
    /** The guild this soundboard sound is in. */
    guildID;
    /** The name of the soundboard sound. */
    name;
    /** The id of the soundboard sound. */
    soundID;
    /** The user who created the soundboard sound. */
    user;
    /** The volume of the soundboard sound. */
    volume;
    constructor(data, client) {
        super(data.sound_id, client);
        this.available = data.available;
        this.emojiID = data.emoji_id;
        this.emojiName = data.emoji_name;
        this.guildID = data.guild_id;
        this.name = data.name;
        this.soundID = data.sound_id;
        this.user = data.user ? new User_1.default(data.user, client) : undefined;
        this.volume = data.volume;
    }
    /**
     * Delete this soundboard sound.
     * @param reason The reason for deleting the soundboard sound.
     */
    async delete(reason) {
        return this.client.rest.guilds.deleteSoundboardSound(this.guildID, this.id, reason);
    }
    /**
     * Edit this soundboard sound.
     * @param options The options for editing the soundboard sound.
     */
    async edit(options) {
        return this.client.rest.guilds.editSoundboardSound(this.guildID, this.id, options);
    }
    /**
     * Send this soundboard sound to a voice channel.
     * @param channelID The ID of the voice channel to send the soundboard sound to.
     * @param sourceGuildID The ID of the guild the soundboard sound is from.
     */
    async sendSoundboardSound(channelID, sourceGuildID) {
        return this.client.rest.channels.sendSoundboardSound(channelID, { soundID: this.soundID, sourceGuildID });
    }
    toJSON() {
        return {
            ...super.toJSON(),
            available: this.available,
            emojiID: this.emojiID,
            emojiName: this.emojiName,
            guildID: this.guildID,
            name: this.name,
            soundID: this.soundID,
            user: this.user?.toJSON(),
            volume: this.volume
        };
    }
}
exports.default = Soundboard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291bmRib2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL1NvdW5kYm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDBEQUEwQjtBQUMxQiwwREFBMEI7QUFJMUIsK0JBQStCO0FBQy9CLE1BQXFCLFVBQVcsU0FBUSxjQUFJO0lBQ3hDLDJDQUEyQztJQUMzQyxTQUFTLENBQVU7SUFDbkIsNENBQTRDO0lBQzVDLE9BQU8sQ0FBZ0I7SUFDdkIsOENBQThDO0lBQzlDLFNBQVMsQ0FBZ0I7SUFDekIsNkNBQTZDO0lBQzdDLE9BQU8sQ0FBVTtJQUNqQix3Q0FBd0M7SUFDeEMsSUFBSSxDQUFTO0lBQ2Isc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBUztJQUNoQixpREFBaUQ7SUFDakQsSUFBSSxDQUFRO0lBQ1osMENBQTBDO0lBQzFDLE1BQU0sQ0FBUztJQUNmLFlBQVksSUFBbUIsRUFBRSxNQUFjO1FBQzNDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM5QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFlO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxPQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFtQztRQUMxQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBUSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEYsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsbUJBQW1CLENBQUMsU0FBaUIsRUFBRSxhQUFzQjtRQUMvRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBQzlHLENBQUM7SUFFUSxNQUFNO1FBQ1gsT0FBTztZQUNILEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsT0FBTyxFQUFJLElBQUksQ0FBQyxPQUFPO1lBQ3ZCLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixPQUFPLEVBQUksSUFBSSxDQUFDLE9BQU87WUFDdkIsSUFBSSxFQUFPLElBQUksQ0FBQyxJQUFJO1lBQ3BCLE9BQU8sRUFBSSxJQUFJLENBQUMsT0FBTztZQUN2QixJQUFJLEVBQU8sSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDOUIsTUFBTSxFQUFLLElBQUksQ0FBQyxNQUFNO1NBQ3pCLENBQUM7SUFDTixDQUFDO0NBQ0o7QUFuRUQsNkJBbUVDIn0=