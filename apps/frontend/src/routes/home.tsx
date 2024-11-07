import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Outlet,
  useMatch,
  useRouter,
} from "@tanstack/react-router";

import { ResultsCard } from "~/components/results/results-card";
import { HeadsUp } from "~/features/home/components/heads-up";
import { nationWideOptions } from "../api/nation-wide";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
  async loader(opts) {
    return opts.context.queryClient.ensureQueryData(nationWideOptions());
  },
});

const RegionMap = React.lazy(() =>
  import("../features/region-map/components/region-map").then((module) => ({
    default: module.RegionMap,
  })),
);

function RouteComponent() {
  const { data: nationResults } = useSuspenseQuery(nationWideOptions());
  const lastUpdated = new Date(nationResults.lastUpdated);
  const partiesGroupedByInParliament = Object.groupBy(
    nationResults.parties,
    (party) => (party.inParliament ? 1 : 0),
  );
  const inParliament = partiesGroupedByInParliament[1];
  const outOfParliamentPercentage =
    partiesGroupedByInParliament[0]?.reduce(
      (acc, party) => acc + party.percentage,
      0,
    ) ?? 0;
  const firstParty = inParliament?.at(0);
  const secondParty = inParliament?.at(1);

  const router = useRouter();
  const detailsMatch = useMatch({
    from: "/home/$regionId",
    shouldThrow: false,
  });
  const selectedRegionId = detailsMatch?.params.regionId ?? null;

  const results = {
    winner: {
      name: firstParty?.name,
      votes: firstParty?.votes,
      votePercentage: firstParty?.percentage,
      seats: firstParty?.seats,
      color: firstParty?.color,
      seatsPercentage: ((firstParty?.seats ?? 0) / 300) * 100,
    },
    runnerup: {
      name: secondParty?.name,
      votes: secondParty?.votes,
      votePercentage: secondParty?.percentage,
      seats: secondParty?.seats,
      color: secondParty?.color,
      seatsPercentage: ((secondParty?.seats ?? 0) / 300) * 100,
    },
    seats: {
      toWin: 150,
      total: 300,
    },
  };

  function handleSelectRegion(regionId: string | null) {
    if (regionId) {
      router.navigate({ to: "/home/$regionId", params: { regionId } });
    } else {
      router.navigate({ to: "/home" });
    }
  }

  function handleEnterRegion(regionId: string) {
    router.preloadRoute({ to: "/home/$regionId", params: { regionId } });
  }

  return (
    <div className="flex flex-col h-screen gap-4 px-2 md:px-8">
      {/* Stats Banner */}
      <div className="flex justify-between p-2 min-h-14">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-col">
            <div className="text-sm">Last Updated</div>
            <div className="text-sm font-bold">
              {lastUpdated.toLocaleDateString()}{" "}
              {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm">Reporting</div>
            <div className="text-sm font-bold">
              {nationResults.reporting.percentage.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-col">
            <div className="text-sm">Turnout</div>
            <div className="text-sm font-bold">
              {nationResults.turnoutPercentage.toFixed(2)}%
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-sm">Invalid/Blank</div>
            <div className="text-sm font-bold">
              {nationResults.votes.invalidAndBlankPercentage.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Results Cards */}
      {inParliament && (
        <ol className="flex flex-wrap items-stretch justify-center gap-4 p-2">
          {inParliament.map((party) => (
            <li
              key={party.id}
              className="p-1 border rounded shadow hover:shadow-md lg:p-3"
            >
              <div className="text-sm">{party.name}</div>
              <div className="text-sm font-bold">
                {party.percentage.toFixed(2)}%
              </div>
              <div className="text-sm">{party.seats}</div>
            </li>
          ))}
          <li className="p-1 border rounded shadow hover:shadow-md lg:p-3">
            <div className="text-sm">Other</div>
            <div className="text-sm font-bold">
              {outOfParliamentPercentage.toFixed(2)}%
            </div>
          </li>
        </ol>
      )}

      <HeadsUp winner={results.winner} runnerUp={results.runnerup} />

      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center w-full h-auto">
                Loading...
              </div>
            }
          >
            <RegionMap
              selectedRegionId={selectedRegionId}
              onSelectRegion={handleSelectRegion}
              onEnterRegion={handleEnterRegion}
            />
          </React.Suspense>
        </div>

        <div className="max-w-full p-2 md:max-w-md">
          {!detailsMatch && (
            <ResultsCard
              title="Nation"
              parties={nationResults.parties}
              reporting={nationResults.reporting}
            />
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
