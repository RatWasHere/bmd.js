"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Base_1 = tslib_1.__importDefault(require("./Base"));
class Subscription extends Base_1.default {
    /** When the subscription was canceled. */
    canceledAt;
    /** ISO3166-1 alpha-2 country code of the payment source used to purchase the subscription. Missing unless queried with a private OAuth scope. */
    country;
    /** End of the current subscription period. */
    currentPeriodEnd;
    /** Start of the current subscription period. */
    currentPeriodStart;
    /** List of entitlements granted for this subscription. */
    entitlementIDs;
    /** List of SKUs that this user will be subscribed to at renewal. */
    renewalSKUIDs;
    /** List of SKUs subscribed to. */
    skuIDs;
    /** Current status of the subscription. */
    status;
    /**	ID of the user who is subscribed. */
    userID;
    constructor(data, client) {
        super(data.id, client);
        this.canceledAt = data.canceled_at ? new Date(data.canceled_at) : null;
        this.country = data.country;
        this.currentPeriodEnd = new Date(data.current_period_end);
        this.currentPeriodStart = new Date(data.current_period_start);
        this.entitlementIDs = data.entitlement_ids;
        this.renewalSKUIDs = data.renewal_sku_ids;
        this.skuIDs = data.sku_ids;
        this.status = data.status;
        this.userID = data.user_id;
    }
}
exports.default = Subscription;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3N0cnVjdHVyZXMvU3Vic2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDBEQUEwQjtBQUsxQixNQUFxQixZQUFhLFNBQVEsY0FBSTtJQUMxQywwQ0FBMEM7SUFDMUMsVUFBVSxDQUFjO0lBQ3hCLGlKQUFpSjtJQUNqSixPQUFPLENBQVU7SUFDakIsOENBQThDO0lBQzlDLGdCQUFnQixDQUFPO0lBQ3ZCLGdEQUFnRDtJQUNoRCxrQkFBa0IsQ0FBTztJQUN6QiwwREFBMEQ7SUFDMUQsY0FBYyxDQUFnQjtJQUM5QixvRUFBb0U7SUFDcEUsYUFBYSxDQUFnQjtJQUM3QixrQ0FBa0M7SUFDbEMsTUFBTSxDQUFnQjtJQUN0QiwwQ0FBMEM7SUFDMUMsTUFBTSxDQUF1QjtJQUM3Qix3Q0FBd0M7SUFDeEMsTUFBTSxDQUFTO0lBQ2YsWUFBWSxJQUFxQixFQUFFLE1BQWM7UUFDN0MsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN2RSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDNUIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFDM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQy9CLENBQUM7Q0FDSjtBQS9CRCwrQkErQkMifQ==