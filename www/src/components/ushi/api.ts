export type UshiConfig = {
  apiBase: string;
};

export type UshiProviderStatus = {
  name: string;
  status: "ok" | "degraded" | string;
  cli_installed?: boolean;
  cli_authenticated?: boolean;
  auth_method?: string;
  email?: string;
};

export type UshiStatus = {
  environment: string;
  status: "ok" | "degraded" | "not_ok" | string;
  providers: UshiProviderStatus[];
};

export function isUshiAvailable(
  status: UshiStatus | null,
  error: Error | null,
): boolean {
  return !error && status !== null && status.status !== "not_ok";
}

export async function fetchUshiStatus(
  apiBase: string,
  signal?: AbortSignal,
): Promise<UshiStatus> {
  const response = await fetch(`${apiBase}/api/ushi/status`, { signal });
  if (!response.ok) {
    throw new Error(`Ushi status request failed: HTTP ${response.status}`);
  }
  return response.json() as Promise<UshiStatus>;
}
