export function getEnvironmentVariable(key: string): string {
  const env = process.env[key];

  if (env === undefined) {
    throw new Error(`Required environment variable "${key}" not found`);
  }

  return env;
}
