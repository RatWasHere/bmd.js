"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Routes = tslib_1.__importStar(require("../util/Routes"));
const Constants_1 = require("../Constants");
/** Various methods for interacting with interactions. Located at {@link Client#rest | Client#rest}{@link RESTManager#interactions | .interactions}. */
class Interactions {
    _manager;
    constructor(manager) {
        this._manager = manager;
    }
    /**
     * Create a followup message.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param options The options for creating the followup message.
     * @caching This method **does not** cache its result.
     */
    async createFollowupMessage(applicationID, interactionToken, options) {
        return this._manager.webhooks.execute(applicationID, interactionToken, options);
    }
    async createInteractionResponse(interactionID, interactionToken, options, withResponse = false) {
        let files;
        if ("data" in options && options.data && "files" in options.data) {
            files = options.data.files;
            delete options.data.files;
        }
        let data;
        switch (options.type) {
            case Constants_1.InteractionResponseTypes.PONG:
            case Constants_1.InteractionResponseTypes.PREMIUM_REQUIRED:
            case Constants_1.InteractionResponseTypes.LAUNCH_ACTIVITY: {
                break;
            }
            case Constants_1.InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE:
            case Constants_1.InteractionResponseTypes.UPDATE_MESSAGE: {
                data = {
                    allowed_mentions: this._manager.client.util.formatAllowedMentions(options.data.allowedMentions),
                    attachments: options.data.attachments,
                    content: options.data.content,
                    components: options.data.components ? this._manager.client.util.componentsToRaw(options.data.components) : undefined,
                    embeds: options.data.embeds ? this._manager.client.util.embedsToRaw(options.data.embeds) : undefined,
                    flags: options.data.flags,
                    poll: options.data.poll ? {
                        allow_multiselect: options.data.poll.allowMultiselect,
                        answers: options.data.poll.answers.map(a => ({
                            poll_media: a.pollMedia
                        })),
                        duration: options.data.poll.duration,
                        layout_type: options.data.poll.layoutType,
                        question: options.data.poll.question
                    } : undefined
                };
                break;
            }
            case Constants_1.InteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT: {
                data = {
                    choices: options.data.choices.map(d => ({
                        name: d.name,
                        name_localizations: d.nameLocalizations,
                        value: d.value
                    }))
                };
                break;
            }
            case Constants_1.InteractionResponseTypes.MODAL: {
                data = {
                    custom_id: options.data.customID,
                    components: this._manager.client.util.componentsToRaw(options.data.components),
                    title: options.data.title
                };
                break;
            }
            default: {
                data = options.data;
                break;
            }
        }
        const query = new URLSearchParams();
        if (withResponse)
            query.set("with_response", "true");
        return this._manager.authRequest({
            method: "POST",
            path: Routes.INTERACTION_CALLBACK(interactionID, interactionToken),
            route: "/interactions/:id/:token/callback",
            json: {
                data,
                type: options.type
            },
            query,
            files
        }).then(d => {
            if (withResponse) {
                return {
                    interaction: {
                        activityInstanceID: d.interaction.activity_instance_id,
                        id: d.interaction.id,
                        responseMessageEphemeral: d.interaction.response_message_ephemeral,
                        responseMessageID: d.interaction.response_message_id,
                        responseMessageLoading: d.interaction.response_message_loading,
                        type: d.interaction.type
                    },
                    resource: d.resource ? {
                        type: d.resource.type,
                        activityInstance: d.resource.activity_instance,
                        message: d.resource.message ? this._manager.client.util.updateMessage(d.resource.message) : undefined
                    } : undefined
                };
            }
            return null;
        });
    }
    /**
     * Delete a follow-up message.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param messageID The ID of the message.
     * @caching This method **does not** cache its result.
     */
    async deleteFollowupMessage(applicationID, interactionToken, messageID) {
        await this._manager.webhooks.deleteMessage(applicationID, interactionToken, messageID);
    }
    /**
     * Delete the original interaction response.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @caching This method **does not** cache its result.
     */
    async deleteOriginalMessage(applicationID, interactionToken) {
        await this.deleteFollowupMessage(applicationID, interactionToken, "@original");
    }
    /**
     * Edit a followup message.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param messageID The ID of the message.
     * @param options The options for editing the followup message.
     * @caching This method **does not** cache its result.
     */
    async editFollowupMessage(applicationID, interactionToken, messageID, options) {
        return this._manager.webhooks.editMessage(applicationID, interactionToken, messageID, options);
    }
    /**
     * Edit an original interaction response.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param options The options for editing the original message.
     * @caching This method **does not** cache its result.
     */
    async editOriginalMessage(applicationID, interactionToken, options) {
        return this.editFollowupMessage(applicationID, interactionToken, "@original", options);
    }
    /**
     * Get a followup message.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @param messageID The ID of the message.
     * @caching This method **does not** cache its result.
     */
    async getFollowupMessage(applicationID, interactionToken, messageID) {
        return this._manager.webhooks.getMessage(applicationID, interactionToken, messageID);
    }
    /**
     * Get an original interaction response.
     * @param applicationID The ID of the application.
     * @param interactionToken The token of the interaction.
     * @caching This method **does not** cache its result.
     */
    async getOriginalMessage(applicationID, interactionToken) {
        return this.getFollowupMessage(applicationID, interactionToken, "@original");
    }
}
exports.default = Interactions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3JvdXRlcy9JbnRlcmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBU0EsK0RBQXlDO0FBQ3pDLDRDQUF3RDtBQU94RCx1SkFBdUo7QUFDdkosTUFBcUIsWUFBWTtJQUNyQixRQUFRLENBQWM7SUFDOUIsWUFBWSxPQUFvQjtRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsS0FBSyxDQUFDLHFCQUFxQixDQUEwQyxhQUFxQixFQUFFLGdCQUF3QixFQUFFLE9BQTJCO1FBQzdJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFJLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxPQUFvQyxDQUFDLENBQUM7SUFDcEgsQ0FBQztJQVlELEtBQUssQ0FBQyx5QkFBeUIsQ0FBaUYsYUFBcUIsRUFBRSxnQkFBd0IsRUFBRSxPQUE0QixFQUFFLFlBQVksR0FBRyxLQUFLO1FBQy9NLElBQUksS0FBOEIsQ0FBQztRQUNuQyxJQUFJLE1BQU0sSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQy9ELEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUMzQixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzlCLENBQUM7UUFFRCxJQUFJLElBQWEsQ0FBQztRQUNsQixRQUFRLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNuQixLQUFLLG9DQUF3QixDQUFDLElBQUksQ0FBQztZQUNuQyxLQUFLLG9DQUF3QixDQUFDLGdCQUFnQixDQUFDO1lBQy9DLEtBQUssb0NBQXdCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsTUFBTTtZ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