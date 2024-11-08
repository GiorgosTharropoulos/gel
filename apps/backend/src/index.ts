import fs from "node:fs/promises";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { logger } from "hono/logger";
import ky from "ky";

import type { ElectionResults as NationElectionResults } from "./schemas/nation-wide-schema";
import type {
  ElectionResult as RegionResult,
  RegionWinner,
} from "./schemas/region-schema";
import { nationStatsToDTO } from "./services/nation.service";
import {
  regionResultsToDTO,
  regionWinnerToDTO,
} from "./services/region.service";

const STATIC_CACHE_DURATION = 60 * 60 * 24 * 365; // 1 year

const http = ky.create({
  keepalive: true,
  prefixUrl: "https://ekloges-prev.singularlogic.eu/2023/june/",
});

const app = new Hono();
app.use("*", logger());

export const api = app
  .basePath("/api")
  .get("/nation-stats", async (c) => {
    const response = await http
      .get("dyn1/v/epik_1.js")
      .json<NationElectionResults>();
    return c.json(nationStatsToDTO(response));
  })
  .get("regions/winners", async (c) => {
    const response = await http.get("dyn/v/eps.js").json<RegionWinner[]>();
    return c.json(regionWinnerToDTO(response));
  })
  .get("regions/:regionId", async (c) => {
    const response = await http
      .get(`dyn/v/ep_${c.req.param("regionId")}.js`)
      .json<RegionResult>();
    return c.json(regionResultsToDTO(response));
  });

app.get(
  "/party-images/*",
  serveStatic({
    root: "./public",
    onFound(_path, c) {
      c.header(
        "Cache-Control",
        `public, max-age=${STATIC_CACHE_DURATION}, immutable`,
      );
    },
  }),
);
app.get(
  "/assets/*",
  serveStatic({
    root: "../frontend/dist",
    onFound(_path, c) {
      c.header(
        "Cache-Control",
        `public, max-age=${STATIC_CACHE_DURATION}, immutable`,
      );
    },
  }),
);
app.get("*", async (c) => {
  return c.newResponse(
    (await fs.readFile("../frontend/dist/index.html")).toString(),
    200,
    {
      "Content-Type": "text/html",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  );
});

serve(app);
