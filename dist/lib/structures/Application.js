"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/** @module Application */
const ClientApplication_1 = tslib_1.__importDefault(require("./ClientApplication"));
const OAuthGuild_1 = tslib_1.__importDefault(require("./OAuthGuild"));
const User_1 = tslib_1.__importDefault(require("./User"));
const Team_1 = tslib_1.__importDefault(require("./Team"));
const Routes = tslib_1.__importStar(require("../util/Routes"));
/** Represents an application. */
class Application extends ClientApplication_1.default {
    /** The approximate number of guilds the application is in. */
    approximateGuildCount;
    /** The approximate number of users this application has been installed by. */
    approximateUserInstallCount;
    /** If the bot can be invited by anyone. */
    botPublic;
    /** If authorizing the bot requires a code grant. */
    botRequireCodeGrant;
    /** This application's rich presence invite cover image hash, if any. */
    coverImage;
    /** This application's default custom authorization link, if any. */
    customInstallURL;
    /** The description of the application. */
    description;
    /** The state of this application's discoverability. */
    discoverabilityState;
    /** The { @link Constants~ApplicationDiscoveryEligibilityFlags | flags } for this application's discovery eligibility. */
    discoveryEligibilityFlags;
    /** If webhook events are enabled for the app. */
    eventWebhooksStatus;
    /**	List of Webhook event types the app subscribes to. */
    eventWebhooksTypes;
    /** Event webhooks URL for the app to receive webhook events. */
    eventWebhooksURL;
    /** The explicit content filter for this application. */
    explicitContentFilter;
    /** If this application is a game sold on Discord, the guild to which it has been linked. This will only be present if recieved via {@link REST/Applications.getCurrent | `/applications/@me`}. */
    guild;
    /** If this application is a game sold on Discord, the ID of the guild to which it has been linked. */
    guildID;
    hook;
    /** The icon hash of the application. */
    icon;
    /** Settings for this application's in-app authorization link, if enabled. */
    installParams;
    /** The install types available for this application. */
    integrationTypes;
    /** The configs for the install types available for this application. */
    integrationTypesConfig;
    /** This applications interaction endpoint url, if any. */
    interactionsEndpointURL;
    /** The event types that will be recieved like http interactions, if interactionsVersion is 2. */
    interactionsEventTypes;
    /** The interactions version of this application. */
    interactionsVersion;
    /** If this application is monetized. */
    isMonetized;
    /** The { @link Constants~ApplicationMonetizationEligibilityFlags | flags } for this application's monetization eligibility. */
    monetizationEligibilityFlags;
    /** This application's monetization state. */
    monetizationState;
    /** The name of the application. */
    name;
    /** The owner of this application. */
    owner;
    /** If this application is a game sold on Discord, the id of the Game's SKU. */
    primarySKUID;
    /** A URL to this application's privacy policy. */
    privacyPolicyURL;
    /** The redirect URIs for this application. */
    redirectURIs;
    /** This application's role connections verification url, if any. */
    roleConnectionsVerificationURL;
    /** The state of this application's RPC application. */
    rpcApplicationState;
    /** A list of rpc origin urls, if rpc is enabled. */
    rpcOrigins;
    /** If this application is a game sold on Discord, the slug that links to its store page. */
    slug;
    /** The state of this application's store application state. */
    storeApplicationState;
    /** The tags for this application. */
    tags;
    /** The team that owns this application. */
    team;
    /** A URL to this application's terms of service. */
    termsOfServiceURL;
    /** The type of this application. */
    type;
    /** The state of this application's verification. */
    verificationState;
    /** The bot's hex encoded public key. */
    verifyKey;
    constructor(data, client) {
        super(data, client);
        this.approximateGuildCount = data.approximate_guild_count ?? 0;
        this.approximateUserInstallCount = data.approximate_user_install_count ?? 0;
        this.botPublic = data.bot_public;
        this.botRequireCodeGrant = data.bot_require_code_grant;
        this.coverImage = data.cover_image ?? null;
        this.description = data.description;
        this.discoverabilityState = data.discoverability_state;
        this.discoveryEligibilityFlags = data.discovery_eligibility_flags;
        this.eventWebhooksStatus = data.event_webhooks_status;
        this.eventWebhooksTypes = data.event_webhooks_types;
        this.eventWebhooksURL = data.event_webhooks_url;
        this.explicitContentFilter = data.explicit_content_filter;
        this.guild = data.guild === undefined ? null : new OAuthGuild_1.default(data.guild, client);
        this.guildID = data.guild_id ?? null;
        this.hook = data.hook;
        this.icon = data.icon;
        this.installParams = data.install_params;
        this.integrationTypes = [];
        this.integrationTypesConfig = {};
        this.interactionsEndpointURL = null;
        this.interactionsEventTypes = data.interactions_event_types;
        this.interactionsVersion = data.interactions_version;
        this.isMonetized = data.is_monetized;
        this.monetizationEligibilityFlags = data.monetization_eligibility_flags;
        this.monetizationState = data.monetization_state;
        this.name = data.name;
        this.owner = data.owner === undefined ? null : new User_1.default(data.owner, client);
        this.primarySKUID = data.primary_sku_id;
        this.privacyPolicyURL = data.privacy_policy_url;
        this.redirectURIs = data.redirect_uris ?? [];
        this.roleConnectionsVerificationURL = null;
        this.rpcApplicationState = data.rpc_application_state;
        this.rpcOrigins = data.rpc_origins ?? [];
        this.slug = data.slug;
        this.storeApplicationState = data.store_application_state;
        this.tags = data.tags ?? [];
        this.team = data.team ? new Team_1.default(data.team, client) : null;
        this.termsOfServiceURL = data.terms_of_service_url;
        this.type = data.type;
        this.verificationState = data.verification_state;
        this.verifyKey = data.verify_key;
        this.update(data);
    }
    /**
     * The url of this application's cover image.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    coverImageURL(format, size) {
        return this.coverImage === null ? null : this.client.util.formatImage(Routes.APPLICATION_COVER(this.id, this.coverImage), format, size);
    }
    /**
     * The url of this application's icon.
     * @param format The format the url should be.
     * @param size The dimensions of the image.
     */
    iconURL(format, size) {
        return this.icon === null ? null : this.client.util.formatImage(Routes.APPLICATION_ICON(this.id, this.icon), format, size);
    }
    toJSON() {
        return {
            ...super.toJSON(),
            approximateGuildCount: this.approximateGuildCount,
            botPublic: this.botPublic,
            botRequireCodeGrant: this.botRequireCodeGrant,
            coverImage: this.coverImage,
            customInstallURL: this.customInstallURL,
            description: this.description,
            discoverabilityState: this.discoverabilityState,
            discoveryEligibilityFlags: this.discoveryEligibilityFlags,
            explicitContentFilter: this.explicitContentFilter,
            guild: this.guild?.toJSON() ?? null,
            guildID: this.guildID,
            hook: this.hook,
            icon: this.icon,
            installParams: this.installParams,
            integrationTypes: this.integrationTypes,
            integrationTypesConfig: this.integrationTypesConfig,
            interactionsEndpointURL: this.interactionsEndpointURL,
            interactionsEventTypes: this.interactionsEventTypes,
            interactionsVersion: this.interactionsVersion,
            isMonetized: this.isMonetized,
            monetizationEligibilityFlags: this.monetizationEligibilityFlags,
            monetizationState: this.monetizationState,
            name: this.name,
            owner: this.owner?.toJSON() ?? null,
            primarySKUID: this.primarySKUID,
            privacyPolicyURL: this.privacyPolicyURL,
            redirectURIs: this.redirectURIs,
            roleConnectionsVerificationURL: this.roleConnectionsVerificationURL,
            rpcApplicationState: this.rpcApplicationState,
            rpcOrigins: this.rpcOrigins,
            slug: this.slug,
            storeApplicationState: this.storeApplicationState,
            tags: this.tags,
            team: this.team?.toJSON() ?? null,
            termsOfServiceURL: this.termsOfServiceURL,
            type: this.type,
            verificationState: this.verificationState,
            verifyKey: this.verifyKey
        };
    }
}
exports.default = Application;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9BcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQkFBMEI7QUFDMUIsb0ZBQW9EO0FBQ3BELHNFQUFzQztBQUN0QywwREFBMEI7QUFDMUIsMERBQTBCO0FBZTFCLCtEQUF5QztBQUl6QyxpQ0FBaUM7QUFDakMsTUFBcUIsV0FBWSxTQUFRLDJCQUFpQjtJQUN0RCw4REFBOEQ7SUFDOUQscUJBQXFCLENBQVM7SUFDOUIsOEVBQThFO0lBQzlFLDJCQUEyQixDQUFTO0lBQ3BDLDJDQUEyQztJQUMzQyxTQUFTLENBQVc7SUFDcEIsb0RBQW9EO0lBQ3BELG1CQUFtQixDQUFXO0lBQzlCLHdFQUF3RTtJQUN4RSxVQUFVLENBQWdCO0lBQzFCLG9FQUFvRTtJQUNwRSxnQkFBZ0IsQ0FBVTtJQUMxQiwwQ0FBMEM7SUFDMUMsV0FBVyxDQUFTO0lBQ3BCLHVEQUF1RDtJQUN2RCxvQkFBb0IsQ0FBbUM7SUFDdkQseUhBQXlIO0lBQ3pILHlCQUF5QixDQUFVO0lBQ25DLGlEQUFpRDtJQUNqRCxtQkFBbUIsQ0FBZ0M7SUFDbkQseURBQXlEO0lBQ3pELGtCQUFrQixDQUEyQztJQUM3RCxnRUFBZ0U7SUFDaEUsZ0JBQWdCLENBQWlCO0lBQ2pDLHdEQUF3RDtJQUN4RCxxQkFBcUIsQ0FBeUM7SUFDOUQsa01BQWtNO0lBQ2xNLEtBQUssQ0FBb0I7SUFDekIsc0dBQXNHO0lBQ3RHLE9BQU8sQ0FBZ0I7SUFDdkIsSUFBSSxDQUFVO0lBQ2Qsd0NBQXdDO0lBQ3hDLElBQUksQ0FBZ0I7SUFDcEIsNkVBQTZFO0lBQzdFLGFBQWEsQ0FBaUI7SUFDOUIsd0RBQXdEO0lBQ3hELGdCQUFnQixDQUFxQztJQUNyRCx3RUFBd0U7SUFDeEUsc0JBQXNCLENBQXlCO0lBQy9DLDBEQUEwRDtJQUMxRCx1QkFBdUIsQ0FBZ0I7SUFDdkMsaUdBQWlHO0lB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