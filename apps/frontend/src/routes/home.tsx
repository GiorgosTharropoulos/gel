import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Outlet,
  useMatch,
  useRouter,
} from "@tanstack/react-router";

import { regionWinnersOptions } from "~/api/region";
import { ResultsCard } from "~/components/results/results-card";
import { HeadsUp } from "~/features/home/components/heads-up";
import { blendWithGray } from "~/utils/colors";
import { nationWideOptions } from "../api/nation-wide";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
  async loader({ context }) {
    return Promise.all([
      context.queryClient.ensureQueryData(nationWideOptions()),
      context.queryClient.ensureQueryData(regionWinnersOptions()),
    ]);
  },
});

const RegionMap = React.lazy(() =>
  import("../features/region-map/components/region-map").then((module) => ({
    default: module.RegionMap,
  })),
);

function RouteComponent() {
  const { data: nationResults } = useSuspenseQuery(nationWideOptions());
  const { data: regionWinners } = useSuspenseQuery(regionWinnersOptions());

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
      logo: firstParty?.logo,
    },
    runnerup: {
      name: secondParty?.name,
      votes: secondParty?.votes,
      votePercentage: secondParty?.percentage,
      seats: secondParty?.seats,
      color: secondParty?.color,
      seatsPercentage: ((secondParty?.seats ?? 0) / 300) * 100,
      logo: secondParty?.logo,
    },
    seats: {
      toWin: 150,
      total: 300,
    },
  };

  const regionColors = React.useMemo(
    () =>
      new Map(
        regionWinners.map(({ region, winner }) => [
          region.id.toString(),
          {
            primary: winner.color,
            secondary: blendWithGray(winner.color, 0.5),
          },
        ]),
      ),
    [regionWinners],
  );

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
    <div className="bg-background flex flex-col gap-4 md:h-screen">
      {/* Stats Banner */}
      <div className="flex min-h-14 items-center justify-between border-b p-2 md:px-8">
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
              className="w-24 rounded border bg-white p-1 text-center text-black shadow lg:p-3"
            >
              <div className="flex h-7 items-center justify-center text-center lg:h-14">
                <img
                  src={`/party-images/${party.logo}`}
                  className="inline h-full object-contain"
                />
              </div>
              <div className="text-sm font-bold">
                {party.percentage.toFixed(2)}%
              </div>
              <div className="text-sm">{party.seats}</div>
            </li>
          ))}
          <li className="w-24 rounded border bg-white p-1 text-center text-black shadow lg:p-3">
            <div className="flex h-7 items-center justify-center text-center lg:h-14">
              Other
            </div>
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
              <div className="flex h-auto w-full items-center justify-center">
                Loading...
              </div>
            }
          >
            <RegionMap
              regionColors={regionColors}
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
