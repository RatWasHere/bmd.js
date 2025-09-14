/// <reference types="node" />
export default class QueryBuilder extends URLSearchParams {
    set(name: string, value: unknown): void;
    setIfPresent(name: string, value: unknown): void;
}
