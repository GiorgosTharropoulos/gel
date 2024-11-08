import invariant from "tiny-invariant";

import { parties as partiesMap } from "@gel/data/parties";

import type { ElectionResults as NationElectionResults } from "../schemas/nation-wide-schema";

export function nationStatsToDTO(nationResults: NationElectionResults) {
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
