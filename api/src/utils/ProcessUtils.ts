export function isEnvVarSet(name: string): boolean {
  return process.env[name] !== undefined;
}
