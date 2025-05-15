"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_1 = tslib_1.__importDefault(require("./base"));
const Errors_1 = require("../../util/Errors");
class ZstdCompression extends base_1.default {
    constructor(shard) {
        super(shard);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async decompress(_data) {
        throw new Errors_1.NotImplementedError("zstd-stream compression has been temporarily removed");
    }
}
exports.default = ZstdCompression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoienN0ZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9nYXRld2F5L2NvbXByZXNzaW9uL3pzdGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMERBQWlDO0FBRWpDLDhDQUF3RDtBQUV4RCxNQUFxQixlQUFnQixTQUFRLGNBQVc7SUFDcEQsWUFBWSxLQUFZO1FBQ3BCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRUQsNkRBQTZEO0lBQzdELEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBYTtRQUMxQixNQUFNLElBQUksNEJBQW1CLENBQUMsc0RBQXNELENBQUMsQ0FBQztJQUMxRixDQUFDO0NBQ0o7QUFURCxrQ0FTQyJ9