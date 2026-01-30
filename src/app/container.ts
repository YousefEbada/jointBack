type Token<T> = string & { __type: T };
const registry = new Map<string, any>();

export function register<T>(token: Token<T>, value: T) {
  registry.set(token as string, value);
}
export function resolve<T>(token: Token<T>): T {
  const v = registry.get(token as string);
  if (!v) throw new Error(`Container: missing binding for ${String(token)}`);
  return v as T;
}
export function token<T>(name: string) { return name as Token<T>; }
