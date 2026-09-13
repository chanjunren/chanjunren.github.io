export function getKakeiboMockErrorName(
  ...names: Array<string | undefined>
) {
  if (typeof window === "undefined") return null;

  const requested = new URLSearchParams(window.location.search).get("mockError");
  return requested && names.includes(requested) ? requested : null;
}

export function getKakeiboMockError(...names: Array<string | undefined>) {
  const requested = getKakeiboMockErrorName(...names);
  if (!requested) return null;

  return new Error(`Mocked Kakeibo failure: ${requested}`);
}
