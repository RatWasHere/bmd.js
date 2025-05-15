/** @module MessageInteractionResponse */
import type CommandInteraction from "../../structures/CommandInteraction";
import type Message from "../../structures/Message";
import type ComponentInteraction from "../../structures/ComponentInteraction";
import type ModalSubmitInteraction from "../../structures/ModalSubmitInteraction";
import type { InteractionCallbackResponse } from "../../types";
export type AnyResponseInteraction = CommandInteraction | ComponentInteraction | ModalSubmitInteraction;
export type ResponseInteractionChannelType<I extends AnyResponseInteraction> = I extends CommandInteraction<infer T> ? T : I extends ModalSubmitInteraction<infer T> ? T : I extends ComponentInteraction<never, infer T> ? T : never;
export default class MessageInteractionResponse<I extends AnyResponseInteraction> {
    callback: InteractionCallbackResponse | null;
    interaction: I;
    message: Message<ResponseInteractionChannelType<I>> | null;
    type: "initial" | "followup";
    constructor(interaction: I, message: Message<ResponseInteractionChannelType<I>> | null, type: "initial" | "followup", callback: InteractionCallbackResponse | null);
    deleteMessage(): Promise<void>;
    getMessage(): Promise<Message<ResponseInteractionChannelType<I>>>;
}
export interface InitialMessagedInteractionResponse<I extends AnyResponseInteraction> extends MessageInteractionResponse<I> {
    callback: InteractionCallbackResponse;
    message: null;
    type: "initial";
}
export interface FollowupMessageInteractionResponse<I extends AnyResponseInteraction> extends MessageInteractionResponse<I> {
    callback: null;
    message: Message<ResponseInteractionChannelType<I>>;
    type: "followup";
}
