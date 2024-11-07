import { queryOptions, useQuery } from "@tanstack/react-query";

import { appClient } from "@gel/backend";

export function nationWideOptions() {
  return queryOptions({
    queryKey: ["nation-wide", "stats"],
    queryFn: async ({ signal }) => {
      const response = await appClient.api["nation-stats"].$get(undefined, {
        init: {
          signal,
        },
      });
      return response.json();
    },
  });
}

export function useNationWide() {
  return useQuery(nationWideOptions());
}
