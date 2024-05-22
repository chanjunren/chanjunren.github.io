const SLASH = "/"

export const WORKSPACE = "workspace"

export function getCurrentLocation(path: string): string | null {
    try {
        return path.split(SLASH)[1];
    } catch (e) {
        console.error("Error in path utils: getCurrentLocation", e);
        return null;
    }
}