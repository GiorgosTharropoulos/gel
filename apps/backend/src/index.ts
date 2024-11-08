import { serve } from "@hono/node-server";
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

const hono = new Hono();
hono.use(logger());

const http = ky.create({
  keepalive: true,
  prefixUrl: "https://ekloges-prev.singularlogic.eu/2023/june/",
});

export const app = hono
  .get("/api/nation-stats", async (c) => {
    const response = await http
      .get("dyn1/v/epik_1.js")
      .json<NationElectionResults>();
    return c.json(nationStatsToDTO(response));
  })
  .get("/api/regions/winners", async (c) => {
    const response = await http.get("dyn/v/eps.js").json<RegionWinner[]>();
    return c.json(regionWinnerToDTO(response));
  })
  .get("/api/regions/:regionId", async (c) => {
    const response = await http
      .get(`dyn/v/ep_${c.req.param("regionId")}.js`)
      .json<RegionResult>();
    return c.json(regionResultsToDTO(response));
  });

serve(hono);
