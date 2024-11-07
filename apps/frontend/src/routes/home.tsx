import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Outlet,
  useMatch,
  useRouter,
} from "@tanstack/react-router";

import { ResultsCard } from "~/components/results/results-card";
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
    <div className="flex h-screen flex-col gap-4 px-2 md:px-8">
      {/* Stats Banner */}
      <div className="flex min-h-14 justify-between p-2">
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
              className="rounded border p-1 shadow hover:shadow-md lg:p-3"
            >
              <div className="text-sm">{party.name}</div>
              <div className="text-sm font-bold">
                {party.percentage.toFixed(2)}%
              </div>
              <div className="text-sm">{party.seats}</div>
            </li>
          ))}
          <li className="rounded border p-1 shadow hover:shadow-md lg:p-3">
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
              <div className="flex h-auto w-full items-center justify-center">
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

            // <div className="flex flex-col justify-between p-2 border rounded">
            //   <div className="flex items-center justify-between p-2">
            //     <h1 className="text-lg font-bold">Nation</h1>
            //   </div>
            //   <ol className="flex flex-col gap-4 p-4">
            //     {nationResults.parties
            //       .filter((p) => p.percentage >= 1)
            //       .map((p) => (
            //         <li key={p.id} className="grid grid-cols-3 gap-4">
            //           <div className="text-sm">{p.shortName}</div>
            //           <div className="text-sm font-bold">
            //             {p.percentage.toFixed(2)}%
            //           </div>
            //           <div className="text-sm">{p.seats}</div>
            //         </li>
            //       ))}
            //   </ol>

            //   <div className="flex justify-end text-sm">
            //     {nationResults.reporting.percentage.toFixed(2)}% (
            //     {nationResults.reporting.countedStations} /
            //     {nationResults.reporting.totalStations})
            //   </div>
            // </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

interface HeadsUpResult {
  name?: string;
  votes?: number;
  votePercentage?: number;
  seats?: number;
  color?: string;
  seatsPercentage?: number;
}

interface HeadsUpProps {
  winner: HeadsUpResult;
  runnerUp: HeadsUpResult;
}

export function HeadsUp({ winner, runnerUp }: HeadsUpProps) {
  const markerPosition = (150 / 300) * 100;

  return (
    <div className="w-full rounded-lg p-6 text-white">
      {/* Winner Banner */}
      <div className="mb-4 flex items-center gap-2">
        <div
          style={{ backgroundColor: winner.color }}
          className="flex h-6 w-6 items-center justify-center rounded-full"
        >
          <svg
            className="h-4 w-4 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <span className="text-lg">{winner.name} wins</span>
      </div>

      {/* Results Bar */}
      <div className="mb-4">
        <div className="mb-2 flex justify-between">
          {/* Left Candidate */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-600"></div>
            <div style={{ color: winner.color }} className="text-3xl font-bold">
              {winner.seats}
            </div>
            <div className="text-gray-400">{winner.name}</div>
          </div>

          {/* Right Candidate */}
          <div className="flex items-center gap-3">
            <div className="text-gray-400">{runnerUp.name}</div>
            <div
              style={{ color: runnerUp.color }}
              className="text-3xl font-bold"
            >
              {runnerUp.seats}
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-600"></div>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="relative mt-5 h-4">
          {/* Background Bar */}
          <div className="absolute flex h-full w-full overflow-hidden rounded-full">
            <div className="w-1/2 border-r border-gray-700 bg-blue-500/20"></div>
            <div className="w-1/2 bg-gray-500/20"></div>
          </div>

          {/* Actual Progress Bars */}
          <div className="absolute flex h-full w-full overflow-hidden rounded-full">
            <div
              style={{
                backgroundColor: winner.color,
                width: `${winner.seatsPercentage}%`,
              }}
              className="h-full"
            ></div>

            <div
              style={{
                backgroundColor: runnerUp.color,
                width: `${runnerUp.seatsPercentage}%`,
              }}
              className="h-full"
            ></div>
          </div>

          {/* 150 Marker */}
          <div
            className="absolute top-0 h-full w-0.5 bg-gray-300"
            style={{ left: `${markerPosition}%` }}
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 transform text-xs text-gray-300">
              150
            </div>
          </div>
        </div>

        {/* Vote Counts */}
        <div className="mt-2 flex justify-between text-sm text-gray-400">
          <div>
            {winner.votes?.toLocaleString()} votes (
            {winner.votePercentage?.toFixed(2)}%)
          </div>

          <div>
            {runnerUp.votes?.toLocaleString()} votes (
            {runnerUp.votePercentage?.toFixed(2)}%)
          </div>
        </div>
      </div>
    </div>
  );
}
