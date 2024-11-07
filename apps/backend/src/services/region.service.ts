import invariant from "tiny-invariant";

import { parties as partiesMap } from "@gel/data/parties";
import { regions } from "@gel/data/regions";

import type { ElectionResult as RegionResult } from "../schemas/region-schema";

export function regionResultsToDTO(regionResults: RegionResult) {
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
