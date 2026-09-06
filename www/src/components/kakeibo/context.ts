import { createContext } from "react";
import type { KakeiboApi } from "./api";

export const ApiContext = createContext<KakeiboApi | null>(null);
