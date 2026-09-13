export type UchiConfig = {
  apiBase: string;
};

export type UchiProviderStatus = {
  name: string;
  status: "ok" | "degraded" | string;
  cli_installed?: boolean;
  cli_authenticated?: boolean;
  auth_method?: string;
  email?: string;
};

export type UchiStatus = {
  environment: string;
  status: "ok" | "degraded" | "not_ok" | string;
  providers: UchiProviderStatus[];
};

export function isUchiAvailable(
  status: UchiStatus | null,
  error: Error | null,
): boolean {
  return !error && status !== null && status.status !== "not_ok";
}

export async function fetchUchiStatus(
  apiBase: string,
  signal?: AbortSignal,
): Promise<UchiStatus> {
  const response = await fetch(`${apiBase}/api/uchi/status`, { signal });
  if (!response.ok) {
    throw new Error(`Uchi status request failed: HTTP ${response.status}`);
  }
  return response.json() as Promise<UchiStatus>;
}
