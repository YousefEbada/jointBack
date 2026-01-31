const registry = new Map();
export function register(token, value) {
    registry.set(token, value);
}
export function resolve(token) {
    const v = registry.get(token);
    if (!v)
        throw new Error(`Container: missing binding for ${String(token)}`);
    return v;
}
export function token(name) { return name; }
