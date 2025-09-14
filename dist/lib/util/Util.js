"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/** @module Util */
const Routes_1 = require("./Routes");
const Errors_1 = require("./Errors");
const Constants_1 = require("../Constants");
const Member_1 = tslib_1.__importDefault(require("../structures/Member"));
const Channel_1 = tslib_1.__importDefault(require("../structures/Channel"));
const Message_1 = tslib_1.__importDefault(require("../structures/Message"));
const Entitlement_1 = tslib_1.__importDefault(require("../structures/Entitlement"));
const TestEntitlement_1 = tslib_1.__importDefault(require("../structures/TestEntitlement"));
const node_util_1 = require("node:util");
/** A general set of utilities. These are intentionally poorly documented, as they serve almost no usefulness to outside developers. */
class Util {
    _client;
    constructor(client) {
        this._client = client;
    }
    static rawEmbeds(embeds) {
        const data = Util.prototype.embedsToParsed(Array.isArray(embeds) ? embeds : [embeds]);
        return Array.isArray(embeds) ? data : data[0];
    }
    static rawMessageComponents(components) {
        const data = Util.prototype.componentsToParsed(Array.isArray(components) ? components : [components]);
        return Array.isArray(components) ? data : data[0];
    }
    static rawModalComponents(components) {
        const data = Util.prototype.componentsToParsed(Array.isArray(components) ? components : [components]);
        return Array.isArray(components) ? data : data[0];
    }
    /** @hidden intentionally not documented - this is an internal function */
    _convertImage(image, name) {
        try {
            return this.convertImage(image);
        }
        catch (err) {
            throw new TypeError(`Invalid ${name} provided. Ensure you are providing a valid, fully-qualified base64 url.`, { cause: err });
        }
    }
    /** @hidden intended for internal use only */
    _convertSound(sound, name) {
        try {
            return this.convertSound(sound);
        }
        catch (err) {
            throw new TypeError(`Invalid ${name} provided. Ensure you are providing a valid, fully-qualified base64 url.`, { cause: err });
        }
    }
    /** @internal */
    _freeze(obj, detail) {
        let message = "This is an error in the library and should be reported.";
        if (detail) {
            message += `Detail: ${detail}`;
        }
        if (typeof obj !== "object" || obj === null || node_util_1.types.isProxy(obj)) {
            return obj;
        }
        return new Proxy(obj, {
            set: (target, prop, value, receiver) => {
                this._client.emit("error", new Errors_1.FrozenModificationError(message, prop));
                return Reflect.set(target, prop, value, receiver);
            }
        });
    }
    /** @hidden intended for internal use only */
    _getLimit(name, id) {
        const opt = this._client.options.collectionLimits[name];
        if (typeof opt === "number") {
            return opt;
        }
        return (id === undefined ? undefined : opt[id]) ?? opt.default ?? Infinity;
    }
    /** @hidden intended for internal use only */
    _isModuleInstalled(name) {
        try {
            // eslint-disable-next-line unicorn/prefer-module
            require(name);
            return true;
        }
        catch {
            return false;
        }
    }
    _setLimit(values, defaultValue = Infinity) {
        if (values === undefined) {
            return defaultValue;
        }
        if (typeof values === "object") {
            return { default: defaultValue, ...values };
        }
        return values;
    }
    componentToParsed(component) {
        switch (component.type) {
            case Constants_1.ComponentTypes.ACTION_ROW: {
                return {
                    components: component.components.map(c => this.componentToParsed(c)),
                    type: component.type
                };
            }
            case Constants_1.ComponentTypes.BUTTON: {
                if (component.style === Constants_1.ButtonStyles.LINK)
                    return component;
                if (component.style === Constants_1.ButtonStyles.PREMIUM) {
                    return {
                        disabled: component.disabled,
                        skuID: component.sku_id,
                        style: component.style,
                        type: component.type
                    };
                }
                return {
                    customID: component.custom_id,
                    disabled: component.disabled,
                    emoji: component.emoji,
                    label: component.label,
                    style: component.style,
                    type: component.type
                };
            }
            case Constants_1.ComponentTypes.TEXT_INPUT: {
                return {
                    customID: component.custom_id,
                    label: component.label,
                    maxLength: component.max_length,
                    minLength: component.min_length,
                    placeholder: component.placeholder,
                    required: component.required,
                    style: component.style,
                    type: component.type,
                    value: component.value
                };
            }
            case Constants_1.ComponentTypes.STRING_SELECT:
            case Constants_1.ComponentTypes.USER_SELECT:
            case Constants_1.ComponentTypes.ROLE_SELECT:
            case Constants_1.ComponentTypes.MENTIONABLE_SELECT:
            case Constants_1.ComponentTypes.CHANNEL_SELECT: {
                const parsedComponent = {
                    customID: component.custom_id,
                    disabled: component.disabled,
                    maxValues: component.max_values,
                    minValues: component.min_values,
                    placeholder: component.placeholder,
                    type: component.type
                };
                if (component.type !== Constants_1.ComponentTypes.STRING_SELECT && component.default_values !== undefined) {
                    parsedComponent.defaultValues = component.default_values;
                }
                if (component.type === Constants_1.ComponentTypes.STRING_SELECT) {
                    return { ...parsedComponent, options: component.options };
                }
                else if (component.type === Constants_1.ComponentTypes.CHANNEL_SELECT) {
                    return { ...parsedComponent, channelTypes: component.channel_types };
                }
                else {
                    return parsedComponent;
                }
            }
            case Constants_1.ComponentTypes.TEXT_DISPLAY:
            case Constants_1.ComponentTypes.THUMBNAIL:
            case Constants_1.ComponentTypes.MEDIA_GALLERY:
            case Constants_1.ComponentTypes.FILE:
            case Constants_1.ComponentTypes.SEPARATOR: {
                return component;
            }
            case Constants_1.ComponentTypes.CONTAINER: {
                return {
                    accentColor: component.accent_color,
                    components: component.components.map(c => this.componentToParsed(c)),
                    spoiler: component.spoiler,
                    type: component.type
                };
            }
            case Constants_1.ComponentTypes.SECTION: {
                return {
                    type: component.type,
                    accessory: component.accessory ? this.componentToParsed(component.accessory) : undefined,
                    components: component.components.map(c => this.componentToParsed(c))
                };
            }
            case Constants_1.ComponentTypes.LABEL: {
                return {
                    type: component.type,
                    label: component.label,
                    description: component.description,
                    component: this.componentToParsed(component.component)
                };
            }
            default: {
                return component;
            }
        }
    }
    componentToRaw(component) {
        switch (component.type) {
            case Constants_1.ComponentTypes.ACTION_ROW: {
                return {
                    type: component.type,
                    components: component.components.map(c => this.componentToRaw(c))
                };
            }
            case Constants_1.ComponentTypes.BUTTON: {
                if (component.style === Constants_1.ButtonStyles.LINK)
                    return component;
                if (component.style === Constants_1.ButtonStyles.PREMIUM) {
                    return {
                        disabled: component.disabled,
                        sku_id: component.skuID,
                        style: component.style,
                        type: component.type
                    };
                }
                return {
                    custom_id: component.customID,
                    disabled: component.disabled,
                    emoji: component.emoji,
                    label: component.label,
                    style: component.style,
                    type: component.type
                };
            }
            case Constants_1.ComponentTypes.TEXT_INPUT: {
                return {
                    custom_id: component.customID,
                    label: component.label,
                    max_length: component.maxLength,
                    min_length: component.minLength,
                    placeholder: component.placeholder,
                    required: component.required,
                    style: component.style,
                    type: component.type,
                    value: component.value
                };
            }
            case Constants_1.ComponentTypes.STRING_SELECT:
            case Constants_1.ComponentTypes.USER_SELECT:
            case Constants_1.ComponentTypes.ROLE_SELECT:
            case Constants_1.ComponentTypes.MENTIONABLE_SELECT:
            case Constants_1.ComponentTypes.CHANNEL_SELECT: {
                const rawComponent = {
                    custom_id: component.customID,
                    disabled: component.disabled,
                    max_values: component.maxValues,
                    min_values: component.minValues,
                    placeholder: component.placeholder,
                    type: component.type
                };
                if (component.type !== Constants_1.ComponentTypes.STRING_SELECT && component.defaultValues !== undefined) {
                    rawComponent.default_values = component.defaultValues;
                }
                if (component.type === Constants_1.ComponentTypes.STRING_SELECT) {
                    return { ...rawComponent, options: component.options, required: component.required };
                }
                else if (component.type === Constants_1.ComponentTypes.CHANNEL_SELECT) {
                    return { ...rawComponent, channel_types: component.channelTypes };
                }
                else {
                    return rawComponent;
                }
            }
            case Constants_1.ComponentTypes.TEXT_DISPLAY:
            case Constants_1.ComponentTypes.THUMBNAIL:
            case Constants_1.ComponentTypes.MEDIA_GALLERY:
            case Constants_1.ComponentTypes.FILE:
            case Constants_1.ComponentTypes.SEPARATOR: {
                return component;
            }
            case Constants_1.ComponentTypes.CONTAINER: {
                return {
                    accent_color: component.accentColor,
                    components: component.components.map(c => this.componentToRaw(c)),
                    spoiler: component.spoiler,
                    type: component.type
                };
            }
            case Constants_1.ComponentTypes.SECTION: {
                return {
                    type: component.type,
                    accessory: component.accessory ? this.componentToRaw(component.accessory) : undefined,
                    components: component.components.map(c => this.componentToRaw(c))
                };
            }
            case Constants_1.ComponentTypes.LABEL: {
                return {
                    type: component.type,
                    label: component.label,
                    description: component.description,
                    component: this.componentToRaw(component.component)
                };
            }
            default: {
                return component;
            }
        }
    }
    componentsToParsed(components) {
        return components.map(component => this.componentToParsed(component));
    }
    componentsToRaw(components) {
        return components.map(component => this.componentToRaw(component));
    }
    convertApplicationEmoji(raw) {
        return this.convertGuildEmoji(raw);
    }
    convertGuildEmoji(raw) {
        return {
            animated: raw.animated,
            available: raw.available,
            id: raw.id,
            managed: raw.managed,
            name: raw.name,
            requireColons: raw.require_colons,
            roles: raw.roles,
            user: raw.user ? this._client.users.update(raw.user) : undefined
        };
    }
    convertImage(img) {
        if (Buffer.isBuffer(img)) {
            const b64 = img.toString("base64");
            let mime;
            const magicMap = [
                // 47 49 46 38
                ["image/gif", /^47494638/],
                // 89 50 4E 47
                ["image/png", /^89504E47/],
                // FF D8 FF
                ["image/jpeg", /^FFD8FF/],
                // 52 49 46 46 ?? ?? ?? ?? 57 45 42 50
                ["image/webp", /^52494646\d{8}57454250/],
                // 02 27 62 20 22 0 - lottie JSON (assuming all files will start with {"v":")
                ["application/json", /^02276220220/]
            ];
            for (const format of magicMap) {
                if (format[1].test(this.getMagic(img, 16))) {
                    mime = format[0];
                    break;
                }
            }
            if (!mime) {
                throw new TypeError(`Failed to determine image format. (magic: ${this.getMagic(img, 16)})`);
            }
            img = `data:${mime};base64,${b64}`;
        }
        return img;
    }
    convertSound(audio) {
        if (Buffer.isBuffer(audio)) {
            const b64 = audio.toString("base64");
            let mime;
            const magicMap = [
                // 49 44 33
                ["audio/mpeg", /^494433/],
                // FF FB
                ["audio/mpeg", /^FFFB/],
                // 4F 67 67 53
                ["audio/ogg", /^4F676753/]
            ];
            for (const format of magicMap) {
                if (format[1].test(this.getMagic(audio, 16))) {
                    mime = format[0];
                    break;
                }
            }
            if (!mime) {
                throw new TypeError(`Failed to determine sound format. (magic: ${this.getMagic(audio, 16)})`);
            }
            audio = `data:${mime};base64,${b64}`;
        }
        return audio;
    }
    convertSticker(raw) {
        return {
            asset: raw.asset,
            available: raw.available,
            description: raw.description,
            formatType: raw.format_type,
            guildID: raw.guild_id,
            id: raw.id,
            name: raw.name,
            packID: raw.pack_id,
            sortValue: raw.sort_value,
            tags: raw.tags,
            type: raw.type,
            user: raw.user ? this._client.users.update(raw.user) : undefined
        };
    }
    async detectMissingPrivilegedIntents(intents) {
        const application = this._client["_application"] || await this._client.rest.applications.getClient();
        intents ??= this._client.shards.options.intents;
        this._client["_application"] ??= application;
        const missing = [];
        const check = (intent, allowed) => {
            if ((intents & intent) === intent && !allowed.some(flag => (application.flags & flag) === flag)) {
                missing.push(Constants_1.Intents[intent]);
            }
        };
        for (const [intent, allowed] of Constants_1.PrivilegedIntentMapping) {
            check(intent, allowed);
        }
        return missing;
    }
    embedsToParsed(embeds) {
        return embeds.map(embed => ({
            author: embed.author === undefined ? undefined : {
                name: embed.author.name,
                iconURL: embed.author.icon_url,
                proxyIconURL: embed.author.proxy_icon_url
            },
            color: embed.color,
            description: embed.description,
            fields: embed.fields?.map(field => ({
                inline: field.inline,
                name: field.name,
                value: field.value
            })),
            flags: embed.flags,
            footer: embed.footer === undefined ? undefined : {
                flags: embed.footer.flags,
                iconURL: embed.footer.icon_url,
                proxyIconURL: embed.footer.proxy_icon_url,
                text: embed.footer.text
            },
            timestamp: embed.timestamp,
            title: embed.title,
            image: embed.image === undefined ? undefined : {
                flags: embed.image.flags,
                height: embed.image.height,
                proxyURL: embed.image.proxy_url,
                url: embed.image.url,
                width: embed.image.width
            },
            provider: embed.provider === undefined ? undefined : {
                name: embed.provider.name,
                url: embed.provider.url
            },
            thumbnail: embed.thumbnail === undefined ? undefined : {
                url: embed.thumbnail.url,
                height: embed.thumbnail.height,
                proxyURL: embed.thumbnail.proxy_url,
                width: embed.thumbnail.width
            },
            url: embed.url,
            type: embed.type,
            video: embed.video === undefined ? undefined : {
                height: embed.video.height,
                proxyURL: embed.video.proxy_url,
                url: embed.video.url,
                width: embed.video.width
            }
        }));
    }
    embedsToRaw(embeds) {
        return embeds.map(embed => ({
            author: embed.author === undefined ? undefined : {
                name: embed.author.name,
                icon_url: embed.author.iconURL,
                url: embed.author.url
            },
            color: embed.color,
            description: embed.description,
            fields: embed.fields?.map(field => ({
                inline: field.inline,
                name: field.name,
                value: field.value
            })),
            footer: embed.footer === undefined ? undefined : {
                text: embed.footer.text,
                icon_url: embed.footer.iconURL
            },
            timestamp: embed.timestamp,
            title: embed.title,
            image: embed.image === undefined ? undefined : { url: embed.image.url },
            thumbnail: embed.thumbnail === undefined ? undefined : { url: embed.thumbnail.url },
            url: embed.url
        }));
    }
    formatAllowedMentions(allowed) {
        const result = { parse: [] };
        if (!allowed) {
            return this.formatAllowedMentions(this._client.options.allowedMentions);
        }
        if (allowed.everyone === true) {
            result.parse.push("everyone");
        }
        if (allowed.roles === true) {
            result.parse.push("roles");
        }
        else if (Array.isArray(allowed.roles)) {
            result.roles = allowed.roles;
        }
        if (allowed.users === true) {
            result.parse.push("users");
        }
        else if (Array.isArray(allowed.users)) {
            result.users = allowed.users;
        }
        if (allowed.repliedUser === true) {
            result.replied_user = true;
        }
        return result;
    }
    formatImage(url, format, size) {
        if (!format || !Constants_1.ImageFormats.includes(format.toLowerCase())) {
            format = url.includes("/a_") ? "gif" : this._client.options.defaultImageFormat;
        }
        if (!size || !Constants_1.MEDIA_PROXY_SIZES.includes(size)) {
            size = this._client.options.defaultImageSize;
        }
        return `${Routes_1.CDN_URL}${url}.${format}?size=${size}`;
    }
    getMagic(file, len = 4) {
        return [...new Uint8Array(file.subarray(0, len))].map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
    }
    modalSubmitComponentToParsed(component) {
        switch (component.type) {
            case Constants_1.ComponentTypes.TEXT_INPUT: {
                return {
                    customID: component.custom_id,
                    type: component.type,
                    value: component.value
                };
            }
            case Constants_1.ComponentTypes.STRING_SELECT: {
                return {
                    customID: component.custom_id,
                    type: component.type,
                    values: component.values
                };
            }
            default: {
                return component;
            }
        }
    }
    modalSubmitComponentsToParsed(components) {
        return components.map(row => {
            if (row.type === Constants_1.ComponentTypes.ACTION_ROW) {
                return {
                    type: row.type,
                    components: row.components ? row.components.map(component => this.modalSubmitComponentToParsed(component)) : undefined
                };
            }
            else {
                return {
                    type: row.type,
                    component: row.component ? this.modalSubmitComponentToParsed(row.component) : undefined
                };
            }
        });
    }
    optionToParsed(option) {
        return {
            autocomplete: option.autocomplete,
            channelTypes: option.channel_types,
            choices: option.choices,
            description: option.description,
            descriptionLocalizations: option.description_localizations,
            descriptionLocalized: option.description_localized,
            max_length: option.max_length,
            max_value: option.max_value,
            min_length: option.min_length,
            min_value: option.min_value,
            name: option.name,
            nameLocalizations: option.name_localizations,
            nameLocalized: option.name_localized,
            options: option.options?.map(o => this.optionToParsed(o)),
            required: option.required,
            type: option.type
        };
    }
    optionToRaw(option) {
        const opt = option;
        return {
            autocomplete: opt.autocomplete,
            channel_types: opt.channelTypes,
            choices: opt.choices?.map(choice => ({
                name: choice.name,
                name_localizations: choice.nameLocalizations,
                value: choice.value
            })),
            description: opt.description,
            description_localizations: opt.descriptionLocalizations,
            max_length: opt.maxLength,
            max_value: opt.maxValue,
            min_length: opt.minLength,
            min_value: opt.minValue,
            name: opt.name,
            name_localizations: opt.nameLocalizations,
            options: opt.options?.map(o => this.optionToRaw(o)),
            required: opt.required,
            type: opt.type
        };
    }
    /** @internal */
    replacePollAnswer(poll, answerID, count, users) {
        let answerCount = poll.results.answerCounts.find(a => a.id === answerID);
        if (!answerCount) {
            answerCount = {
                count,
                id: answerID,
                users: [],
                meVoted: false
            };
        }
        answerCount.count = count;
        if (users) {
            answerCount.users = users;
            answerCount.meVoted = (this._client["_user"] && users.includes(this._client["_user"]?.id)) ?? false;
        }
    }
    updateChannel(channelData) {
        guild: if (channelData.guild_id) {
            const guild = this._client.guilds.get(channelData.guild_id);
            if (guild) {
                if (Constants_1.ThreadChannelTypes.includes(channelData.type)) {
                    if (!channelData.parent_id) {
                        break guild;
                    }
                    return guild.threads.update(channelData);
                }
                else {
                    return guild.channels.update(channelData);
                }
            }
        }
        switch (channelData.type) {
            case Constants_1.ChannelTypes.DM: return this._client.privateChannels.update(channelData);
            case Constants_1.ChannelTypes.GROUP_DM: return this._client.groupChannels.update(channelData);
            default: return Channel_1.default.from(channelData, this._client);
        }
    }
    /** @internal */
    updateEntitlement(data) {
        if (this._client["_application"] === undefined) {
            return "subscription_id" in data && data.subscription_id ?
                new Entitlement_1.default(data, this._client) :
                new TestEntitlement_1.default(data, this._client);
        }
        else {
            return this._client.application.entitlements.update(data);
        }
    }
    /** @internal */
    updateMember(guildID, memberID, member) {
        const guild = this._client.guilds.get(guildID);
        if (guild && this._client["_user"] && this._client.user.id === memberID) {
            if (guild["_clientMember"]) {
                guild["_clientMember"]["update"](member);
            }
            else {
                guild["_clientMember"] = guild.members.update({ ...member, id: memberID }, guildID);
            }
            return guild["_clientMember"];
        }
        return guild ? guild.members.update({ ...member, id: memberID }, guildID) : new Member_1.default({ ...member, id: memberID }, this._client, guildID);
    }
    /** @internal */
    updateMessage(data) {
        const channel = this._client.getChannel(data.channel_id);
        if (channel && "messages" in channel) {
            return channel.messages.update(data);
        }
        return new Message_1.default(data, this._client);
    }
    /** @internal */
    updatePollAnswer(poll, answerID, count, user) {
        let answerCount = poll.results.answerCounts.find(a => a.id === answerID);
        if (!answerCount) {
            if (count === -1) {
                return;
            }
            answerCount = {
                count,
                id: answerID,
                users: user ? [user] : [],
                meVoted: user === this._client["_user"]?.id
            };
            poll.results.answerCounts.push(answerCount);
            return;
        }
        answerCount.count += count;
        if (user) {
            if (count === 1 && !answerCount.users.includes(user)) {
                answerCount.users.push(user);
                answerCount.meVoted = user === this._client["_user"]?.id;
            }
            else if (count === -1 && answerCount.users.includes(user)) {
                answerCount.users.splice(answerCount.users.indexOf(user), 1);
                if (user === this._client["_user"]?.id) {
                    answerCount.meVoted = false;
                }
            }
        }
    }
    /** @internal */
    updateThread(threadData) {
        const guild = this._client.guilds.get(threadData.guild_id);
        if (guild) {
            return guild.threads.update(threadData);
        }
        return Channel_1.default.from(threadData, this._client);
    }
}
exports.default = Util;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL1V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUJBQW1CO0FBQ25CLHFDQUFtQztBQUNuQyxxQ0FBbUQ7QUFFbkQsNENBWXNCO0FBb0J0QiwwRUFBMEM7QUFDMUMsNEVBQTRDO0FBOEI1Qyw0RUFBNEM7QUFDNUMsb0ZBQW9EO0FBQ3BELDRGQUE0RDtBQUU1RCx5Q0FBa0M7QUFFbEMsdUlBQXVJO0FBQ3ZJLE1BQXFCLElBQUk7SUFDYixPQUFPLENBQVM7SUFFeEIsWUFBWSxNQUFjO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUFJRCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQWtDO1FBQy9DLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3RGLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUlELE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxVQUE0RDtRQUNwRixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3RHLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FB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