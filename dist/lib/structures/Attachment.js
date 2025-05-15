"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/** @module Attachment */
const Base_1 = tslib_1.__importDefault(require("./Base"));
const Application_1 = tslib_1.__importDefault(require("./Application"));
/** Represents a file attachment. */
class Attachment extends Base_1.default {
    /** For Clips, the application in the stream, if recognized. */
    application;
    /** For Clips, when the clip was created. */
    clipCreatedAt;
    /** For Clips, array of users who were in the stream. */
    clipParticipants;
    /** The mime type of this attachment. */
    contentType;
    /** The description of this attachment. */
    description;
    /** The duration of the attached audio file, if voice message. */
    durationSecs;
    /** If this attachment is ephemeral. Ephemeral attachments will be removed after a set period of time. */
    ephemeral;
    /** The filename of this attachment. */
    filename;
    /** The {@link Constants~AttachmentFlags | Attachment Flags } of this image. */
    flags;
    /** The height of this attachment, if an image. */
    height;
    /** A proxied url of this attachment. */
    proxyURL;
    /** The size of this attachment. */
    size;
    /** The title of this attachment. */
    title;
    /** The source url of this attachment. */
    url;
    /** Base64 encoded bytearray representing a sampled waveform for voice messages. */
    waveform;
    /** The width of this attachment, if an image. */
    width;
    constructor(data, client) {
        super(data.id, client);
        this.application = data.application ? new Application_1.default(data.application, client) : undefined;
        this.clipCreatedAt = data.clip_created_at ? new Date(data.clip_created_at) : undefined;
        this.clipParticipants = data.clip_participants ? data.clip_participants.map(user => client.users.update(user)) : undefined;
        this.contentType = data.content_type;
        this.description = data.description;
        this.durationSecs = data.duration_secs;
        this.ephemeral = data.ephemeral;
        this.filename = data.filename;
        this.flags = data.flags ?? 0;
        this.height = data.height;
        this.proxyURL = data.proxy_url;
        this.size = data.size;
        this.url = data.url;
        this.waveform = data.waveform;
        this.width = data.width;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            contentType: this.contentType,
            description: this.description,
            ephemeral: this.ephemeral,
            filename: this.filename,
            flags: this.flags,
            height: this.height,
            proxyURL: this.proxyURL,
            size: this.size,
            title: this.title,
            url: this.url,
            width: this.width
        };
    }
}
exports.default = Attachment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXR0YWNobWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zdHJ1Y3R1cmVzL0F0dGFjaG1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDBEQUEwQjtBQUUxQix3RUFBd0M7QUFLeEMsb0NBQW9DO0FBQ3BDLE1BQXFCLFVBQVcsU0FBUSxjQUFJO0lBQ3hDLCtEQUErRDtJQUMvRCxXQUFXLENBQWU7SUFDMUIsNENBQTRDO0lBQzVDLGFBQWEsQ0FBUTtJQUNyQix3REFBd0Q7SUFDeEQsZ0JBQWdCLENBQWU7SUFDL0Isd0NBQXdDO0lBQ3hDLFdBQVcsQ0FBVTtJQUNyQiwwQ0FBMEM7SUFDMUMsV0FBVyxDQUFVO0lBQ3JCLGlFQUFpRTtJQUNqRSxZQUFZLENBQVU7SUFDdEIseUdBQXlHO0lBQ3pHLFNBQVMsQ0FBVztJQUNwQix1Q0FBdUM7SUFDdkMsUUFBUSxDQUFTO0lBQ2pCLCtFQUErRTtJQUMvRSxLQUFLLENBQVM7SUFDZCxrREFBa0Q7SUFDbEQsTUFBTSxDQUFVO0lBQ2hCLHdDQUF3QztJQUN4QyxRQUFRLENBQVM7SUFDakIsbUNBQW1DO0lBQ25DLElBQUksQ0FBUztJQUNiLG9DQUFvQztJQUNwQyxLQUFLLENBQVU7SUFDZix5Q0FBeUM7SUFDekMsR0FBRyxDQUFTO0lBQ1osbUZBQW1GO0lBQ25GLFFBQVEsQ0FBaUI7SUFDekIsaURBQWlEO0lBQ2pELEtBQUssQ0FBVTtJQUNmLFlBQVksSUFBbUIsRUFBRSxNQUFjO1FBQzNDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxxQkFBVyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUM1RixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDM0gsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNwQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDdkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFFUSxNQUFNO1FBQ1gsT0FBTztZQUNILEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDN0IsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLFNBQVMsRUFBSSxJQUFJLENBQUMsU0FBUztZQUMzQixRQUFRLEVBQUssSUFBSSxDQUFDLFFBQVE7WUFDMUIsS0FBSyxFQUFRLElBQUksQ0FBQyxLQUFLO1lBQ3ZCLE1BQU0sRUFBTyxJQUFJLENBQUMsTUFBTTtZQUN4QixRQUFRLEVBQUssSUFBSSxDQUFDLFFBQVE7WUFDMUIsSUFBSSxFQUFTLElBQUksQ0FBQyxJQUFJO1lBQ3RCLEtBQUssRUFBUSxJQUFJLENBQUMsS0FBSztZQUN2QixHQUFHLEVBQVUsSUFBSSxDQUFDLEdBQUc7WUFDckIsS0FBSyxFQUFRLElBQUksQ0FBQyxLQUFLO1NBQzFCLENBQUM7SUFDTixDQUFDO0NBQ0o7QUFwRUQsNkJBb0VDIn0=