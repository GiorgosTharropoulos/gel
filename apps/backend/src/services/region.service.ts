import invariant from "tiny-invariant";

import { parties as partiesMap, regions } from "@gel/data";

import type {
  ElectionResult as RegionResult,
  RegionWinner,
} from "../schemas/region-schema";

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

export function regionWinnerToDTO(winners: RegionWinner[]) {
  return winners.map((winner) => {
    const party = partiesMap[winner.PARTY_ID];
    const region = regions[winner.EP_ID];

    invariant(party, `Party with id ${winner.PARTY_ID} not found`);
    invariant(region, `Region with id ${winner.EP_ID} not found`);

    return {
      region: {
        id: region.id,
        name: region.name,
        reporting: {
          percentage: (winner.NumTm / region.countTm) * 100,
          countedStations: winner.NumTm,
          totalStations: region.countTm,
        },
      },
      winner: {
        id: winner.PARTY_ID,
        name: party.name,
        shortName: party.shortName,
        color: `#${party.color}`,
        seats: winner.Edres,
        percentage: winner.Perc,
      },
    };
  });
}
