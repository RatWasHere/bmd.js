"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Routes = tslib_1.__importStar(require("../util/Routes"));
const Constants_1 = require("../Constants");
const QueryBuilder_1 = tslib_1.__importDefault(require("../util/QueryBuilder"));
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
        options = this._manager.client.util._freeze(options);
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
        const query = new QueryBuilder_1.default();
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
            files: ("data" in options && options.data && "files" in options.data && options.data.files) || undefined
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3JvdXRlcy9JbnRlcmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBU0EsK0RBQXlDO0FBQ3pDLDRDQUF3RDtBQUt4RCxnRkFBZ0Q7QUFFaEQsdUpBQXVKO0FBQ3ZKLE1BQXFCLFlBQVk7SUFDckIsUUFBUSxDQUFjO0lBQzlCLFlBQVksT0FBb0I7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILEtBQUssQ0FBQyxxQkFBcUIsQ0FBMEMsYUFBcUIsRUFBRSxnQkFBd0IsRUFBRSxPQUEyQjtRQUM3SSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBSSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsT0FBb0MsQ0FBQyxDQUFDO0lBQ3BILENBQUM7SUFZRCxLQUFLLENBQUMseUJBQXlCLENBQWlGLGFBQXFCLEVBQUUsZ0JBQXdCLEVBQUUsT0FBNEIsRUFBRSxZQUFZLEdBQUcsS0FBSztRQUMvTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRCxJQUFJLElBQWEsQ0FBQztRQUNsQixRQUFRLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNuQixLQUFLLG9DQUF3QixDQUFDLElBQUksQ0FBQztZQUNuQyxLQUFLLG9DQUF3QixDQUFDLGdCQUFnQixDQUFDO1lBQy9DLEtBQUssb0NBQXdCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsTUFBTTtZQUNWLENBQUM7WUFDRCxLQUFLLG9DQUF3QixDQUFDLDJCQUEyQixDQUFDO1lBQzFELEtBQUssb0NBQXdCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxHQUFHO29CQUNILGdCQUFnQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztvQkFDL0YsV0FBVyxFQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVztvQkFDMUMsT0FBTyxFQUFXLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTztvQkFDdEMsVUFBVSxFQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7b0JBQzFILE1BQU0sRUFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO29CQUM5RyxLQUFLLEVBQWEsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLO29CQUNwQyxJQUFJLEVBQWMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNsQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0I7d0JBQ3JELE9BQU8sRUFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFDbkQsVUFBVSxFQUFFLENBQUMsQ0FBQyxTQUFTO3lCQUMxQixDQUFDLENBQUM7d0JBQ0gsUUFBUSxFQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7d0JBQ3ZDLFdBQVcsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO3dCQUN6QyxRQUFRLEVBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtxQkFDMUMsQ0FBQyxDQUFDLENBQUMsU0FBUztpQkFDaEIsQ0FBQztnQkFDRixNQUFNO1lBQ1YsQ0FBQztZQUVELEtBQUssb0NBQXdCLENBQUMsdUNBQXVDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRSxJQUFJLEdBQUc7b0JBQ0gsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ3BDLElBQUksRUFBZ0IsQ0FBQyxDQUFDLElBQUk7d0JBQzFCLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxpQkFBaUI7d0JBQ3ZDLEtBQUssRUFBZSxDQUFDLENBQUMsS0FBSztxQkFDOUIsQ0FBQyxDQUFDO2lCQUNOLENBQUM7Z0JBQ0YsTUFBTTtZQUNWLENBQUM7WUFFRCxLQUFLLG9DQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksR0FBRztvQkFDSCxTQUFTLEVBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRO29CQUNqQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztvQkFDOUUsS0FBSyxFQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSztpQkFDakMsQ0FBQztnQkFDRixNQUFNO1lBQ1YsQ0FBQztZQUVELE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ04sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ3BCLE1BQU07WUFDVixDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sS0FBSyxHQUFHLElBQUksc0JBQVksRUFBRSxDQUFDO1FBQ2pDLElBQUksWUFBWTtZQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQWlDO1lBQzdELE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFJLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLENBQUM7WUFDcEUsS0FBSyxFQUFHLG1DQUFtQztZQUMzQyxJQUFJLEVBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7YUFDckI7WUFDRCxLQUFLO1lBQ0wsS0FBSyxFQUFFLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUztTQUMzRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1IsSUFBSSxZQUFZLEVBQUUsQ0FBQztnQkFDZixPQUFPO29CQUNILFdBQVcsRUFBRTt3QkFDVCxrQkFBa0IsRUFBUSxDQUFDLENBQUMsV0FBVyxDQUFDLG9CQUFvQjt3QkFDNUQsRUFBRSxFQUF3QixDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUU7d0JBQzFDLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsMEJBQTBCO3dCQUNsRSxpQkFBaUIsRUFBUyxDQUFDLENBQUMsV0FBVyxDQUFDLG1CQUFtQjt3QkFDM0Qsc0JBQXNCLEVBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0I7d0JBQ2hFLElBQUksRUFBc0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJO3FCQUMvQztvQkFDRCxRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQ25CLElBQUksRUFBYyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUk7d0JBQ2pDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsaUJBQWlCO3dCQUM5QyxPQUFPLEVBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztxQkFDakgsQ0FBQyxDQUFDLENBQUMsU0FBUztpQkFDaEIsQ0FBQztZQUNOLENBQUM7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMscUJBQXFCLENBQUMsYUFBcUIsRUFBRSxnQkFBd0IsRUFBRSxTQUFpQjtRQUMxRixNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLHFCQUFxQixDQUFDLGFBQXFCLEVBQUUsZ0JBQXdCO1FBQ3ZFLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILEtBQUssQ0FBQyxtQkFBbUIsQ0FBMEMsYUFBcUIsRUFBRSxnQkFBd0IsRUFBRSxTQUFpQixFQUFFLE9BQStCO1FBQ2xLLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFJLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdEcsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILEtBQUssQ0FBQyxtQkFBbUIsQ0FBMEMsYUFBcUIsRUFBRSxnQkFBd0IsRUFBRSxPQUErQjtRQUMvSSxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBSSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlGLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsa0JBQWtCLENBQTBDLGFBQXFCLEVBQUUsZ0JBQXdCLEVBQUUsU0FBaUI7UUFDaEksT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUksYUFBYSxFQUFFLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxrQkFBa0IsQ0FBMEMsYUFBcUIsRUFBRSxnQkFBd0I7UUFDN0csT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7Q0FDSjtBQXRMRCwrQkFzTEMifQ==