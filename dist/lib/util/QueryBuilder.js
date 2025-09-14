"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder extends URLSearchParams {
    set(name, value) {
        if (value === undefined) {
            if (this.has(name)) {
                this.delete(name);
            }
        }
        else {
            super.set(name, String(value));
        }
    }
    setIfPresent(name, value) {
        if (value !== undefined) {
            this.set(name, value);
        }
    }
}
exports.default = QueryBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVlcnlCdWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3V0aWwvUXVlcnlCdWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBcUIsWUFBYSxTQUFRLGVBQWU7SUFDNUMsR0FBRyxDQUFDLElBQVksRUFBRSxLQUFjO1FBQ3JDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3RCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLENBQUM7UUFDTCxDQUFDO2FBQU0sQ0FBQztZQUNKLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ25DLENBQUM7SUFDTCxDQUFDO0lBRUQsWUFBWSxDQUFDLElBQVksRUFBRSxLQUFjO1FBQ3JDLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFCLENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFoQkQsK0JBZ0JDIn0=