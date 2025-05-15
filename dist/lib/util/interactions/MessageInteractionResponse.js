"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageInteractionResponse {
    callback;
    message;
    type;
    constructor(interaction, message, type, callback) {
        this.interaction = interaction;
        this.message = message;
        this.type = type;
        this.callback = callback;
    }
    async deleteMessage() {
        if (this.message !== null) {
            return this.interaction.deleteFollowup(this.message.id);
        }
        return this.interaction.deleteOriginal();
    }
    async getMessage() {
        if (this.message !== null) {
            return this.message;
        }
        if (this.callback?.resource?.message) {
            return this.callback.resource.message;
        }
        return this.interaction.getOriginal();
    }
}
exports.default = MessageInteractionResponse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVzc2FnZUludGVyYWN0aW9uUmVzcG9uc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvdXRpbC9pbnRlcmFjdGlvbnMvTWVzc2FnZUludGVyYWN0aW9uUmVzcG9uc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFhQSxNQUFxQiwwQkFBMEI7SUFDM0MsUUFBUSxDQUFxQztJQUU3QyxPQUFPLENBQW9EO0lBQzNELElBQUksQ0FBeUI7SUFDN0IsWUFBWSxXQUFjLEVBQUUsT0FBMEQsRUFBRSxJQUE0QixFQUFFLFFBQTRDO1FBQzlKLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYTtRQUNmLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUN4QixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVU7UUFDWixJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDeEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3hCLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDO1lBQ25DLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBcUQsQ0FBQztRQUN4RixDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBeUQsQ0FBQztJQUNqRyxDQUFDO0NBQ0o7QUEvQkQsNkNBK0JDIn0=