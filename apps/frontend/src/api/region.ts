import { queryOptions, useQuery } from "@tanstack/react-query";

import { appClient } from "@gel/backend";

export function regionResultsOptions(regionId: string) {
  return queryOptions({
    queryKey: ["regions", regionId],
    queryFn: async ({ signal }) => {
      const response = await appClient.api.regions[":regionId"].$get(
        { param: { regionId } },
        {
          init: {
            signal,
          },
        },
      );
      return response.json();
    },
  });
}

export function useRegionResults(regionId: string) {
  return useQuery(regionResultsOptions(regionId));
}

export function regionWinnersOptions() {
  return queryOptions({
    queryKey: ["regions", "winners"],
    queryFn: async ({ signal }) => {
      const response = await appClient.api.regions.winners.$get(undefined, {
        init: {
          signal,
        },
      });
      return response.json();
    },
  });
}
