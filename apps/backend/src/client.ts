import { hc } from "hono/client";

import type { app } from "./index";

export const appClient = hc<typeof app>("/");
