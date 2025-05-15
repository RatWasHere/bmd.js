/// <reference types="node" />
/// <reference types="node" />
import Compression from "./base";
import type Shard from "../Shard";
export default class ZstdCompression extends Compression {
    constructor(shard: Shard);
    decompress(_data: Buffer): Promise<Buffer>;
}
