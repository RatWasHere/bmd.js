"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const BaseEntitlement_1 = tslib_1.__importDefault(require("./BaseEntitlement"));
/** Represents an entitlement. */
class Entitlement extends BaseEntitlement_1.default {
    endsAt;
    startsAt;
    subscriptionID;
    constructor(data, client) {
        super(data, client);
        this.endsAt = data.ends_at ? new Date(data.ends_at) : null;
        this.startsAt = data.starts_at ? new Date(data.starts_at) : null;
        this.subscriptionID = data.subscription_id;
    }
    toJSON() {
        return {
            ...super.toJSON(),
            endsAt: this.endsAt?.getTime() || null,
            startsAt: this.startsAt?.getTime() || null,
            subscriptionID: this.subscriptionID
        };
    }
}
exports.default = Entitlement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50aXRsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvc3RydWN0dXJlcy9FbnRpdGxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxnRkFBZ0Q7QUFLaEQsaUNBQWlDO0FBQ2pDLE1BQXFCLFdBQVksU0FBUSx5QkFBZTtJQUNwRCxNQUFNLENBQWM7SUFDcEIsUUFBUSxDQUFjO0lBQ3RCLGNBQWMsQ0FBUztJQUN2QixZQUFZLElBQW9CLEVBQUUsTUFBYztRQUM1QyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDM0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNqRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDL0MsQ0FBQztJQUVRLE1BQU07UUFDWCxPQUFPO1lBQ0gsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2pCLE1BQU0sRUFBVSxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLElBQUk7WUFDOUMsUUFBUSxFQUFRLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksSUFBSTtZQUNoRCxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7U0FDdEMsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQW5CRCw4QkFtQkMifQ==