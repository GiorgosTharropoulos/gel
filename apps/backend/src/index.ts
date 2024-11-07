import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import ky from "ky";

import { ElectionResultsSchema } from "./schema";

const hono = new Hono();

hono.use(logger());

const http = ky.create({
  keepalive: true,
  prefixUrl: "https://ekloges-prev.singularlogic.eu/2023/june/",
});

hono.get("/health", async (c) => {
  return c.json({ status: "ok" });
});

export const app = hono.get("/api/nation-stats", async (c) => {
  const response = await http.get("dyn1/v/epik_1.js").json();
  const data = await ElectionResultsSchema.parseAsync(response);
  return c.json(data);
});

serve(hono);
