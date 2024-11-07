import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import ky from "ky";
import invariant from "tiny-invariant";

import { parties as partiesMap } from "@gel/data/parties";
import { regions } from "@gel/data/regions";

import type { ElectionResults as NationElectionResults } from "./schemas/nation-wide-schema";
import type { ElectionResult as RegionResult } from "./schemas/region-schema";
import { ElectionResultSchema as RegionResultsSchema } from "./schemas/region-schema";

const hono = new Hono();
hono.use(logger());

const http = ky.create({
  keepalive: true,
  prefixUrl: "https://ekloges-prev.singularlogic.eu/2023/june/",
});

hono.get("/health", async (c) => {
  return c.json({ status: "ok" });
});

function nationStatsToDTO(nationResults: NationElectionResults) {
  const totalVotes =
    nationResults.Akyra + nationResults.Egkyra + nationResults.Leyka;
  const invalidAndBlankVotes =
    ((nationResults.Leyka + nationResults.Akyra) / totalVotes) * 100;
  const turnout = (totalVotes / nationResults.Gramenoi) * 100;
  const reporting =
    (nationResults.NumTm /
      (nationResults.NumTmK + nationResults.NumTmE + nationResults.NumTmM)) *
    100;

  const parties = nationResults.party.map((p) => {
    const party = partiesMap[p.PARTY_ID];
    invariant(party, `Party with id ${p.PARTY_ID} not found`);

    return {
      id: p.PARTY_ID,
      name: party.name,
      shortName: party.shortName,
      color: `#${party.color}`,
      percentage: p.Perc,
      votes: p.VOTES,
      seats: p.Edres + p.EdresEpik,
      inParliament: p.TakesEdres > 0,
      rank: p.Rank,
    };
  });

  parties.sort((a, b) => a.rank - b.rank);

  return {
    votes: {
      total: totalVotes,
      invalidAndBlankPercentage: invalidAndBlankVotes,
    },
    turnoutPercentage: turnout,
    lastUpdated: nationResults.Updated,
    reporting: {
      percentage: reporting,
      countedStations: nationResults.NumTm,
      totalStations:
        nationResults.NumTmK + nationResults.NumTmE + nationResults.NumTmM,
    },
    parties,
  };
}

function regionResultsToDTO(regionResults: RegionResult) {
  const region = regions[regionResults.EP_ID];
  invariant(region, `Region with id ${regionResults.EP_ID} not found`);

  const totalStations = region.countTm;
  const countedStations = regionResults.NumTm;
  const reporting = (countedStations / totalStations) * 100;

  const totalVotes =
    regionResults.Akyra + regionResults.Egkyra + regionResults.Leyka;

  const parties = regionResults.party.map((p) => {
    const party = partiesMap[p.PARTY_ID];
    invariant(
      party,
      `Party with id ${p.PARTY_ID} not found
    `,
    );

    return {
      id: p.PARTY_ID,
      name: party.name,
      shortName: party.shortName,
      color: `#${party.color}`,
      percentage: p.Perc,
      votes: p.VOTES,
      seats: p.Edres,
    };
  });

  return {
    name: region.name,
    votes: {
      total: totalVotes,
      invalidAndBlankPercentage:
        ((regionResults.Leyka + regionResults.Akyra) / totalVotes) * 100,
    },
    turnoutPercentage: (totalVotes / regionResults.Gramenoi) * 100,
    lastUpdated: regionResults.Updated,
    reporting: {
      percentage: reporting,
      countedStations,
      totalStations,
    },
    parties,
  };
}

export const app = hono
  .get("/api/nation-stats", async (c) => {
    const response = await http
      .get("dyn1/v/epik_1.js")
      .json<NationElectionResults>();
    return c.json(nationStatsToDTO(response));
  })
  .get("/api/regions/:regionId", async (c) => {
    const response = await http
      .get(`dyn/v/ep_${c.req.param("regionId")}.js`)
      .json<RegionResult>();
    return c.json(regionResultsToDTO(response));
  });

serve(hono);
