import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { nationWideOptions } from "../api/nation-wide";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  async loader(opts) {
    return opts.context.queryClient.ensureQueryData(nationWideOptions());
  },
});

function RouteComponent() {
  const { data: stats } = useSuspenseQuery(nationWideOptions());
  const totalVotes = stats.Akyra + stats.Egkyra + stats.Leyka;
  const invalidAndBlankVotes = ((stats.Leyka + stats.Akyra) / totalVotes) * 100;
  const turnout = (totalVotes / stats.Gramenoi) * 100;
  const lastUpdated = new Date(stats.Updated);
  const reporting = (stats.NumTm / (stats.NumTmK + stats.NumTmE + stats.NumTmM)) * 100;
  const groupedParties = Object.groupBy(stats.party, (party) => party.TakesEdres);
  const inParliament = groupedParties[1];
  const restPercentage = groupedParties[0]?.reduce((acc, party) => acc + party.Perc, 0) ?? 0;

  return (
    <div className="flex h-screen flex-col gap-4">
      <div className="flex min-h-14 justify-between p-2">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-col">
            <div className="text-sm">Last Updated</div>
            <div className="text-sm font-bold">
              {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm">Reporting</div>
            <div className="text-sm font-bold">{reporting.toFixed(2)}%</div>
          </div>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-col">
            <div className="text-sm">Turnout</div>
            <div className="text-sm font-bold">{turnout.toFixed(2)}%</div>
          </div>

          <div className="flex flex-col">
            <div className="text-sm">Invalid/Blank</div>
            <div className="text-sm font-bold">{invalidAndBlankVotes.toFixed(2)}%</div>
          </div>
        </div>
      </div>

      <ol className="flex flex-wrap items-stretch justify-center gap-4 p-2">
        {inParliament?.map((party) => (
          <li key={party.PARTY_ID} className="rounded border p-1 shadow hover:shadow-md lg:p-3">
            <div className="text-sm">{party.PARTY_ID}</div>
            <div className="text-sm font-bold">{party.Perc.toFixed(2)}%</div>
            <div className="text-sm">{party.Edres + party.EdresEpik}</div>
          </li>
        ))}
        <li className="rounded border p-1 shadow hover:shadow-md lg:p-3">
          <div className="text-sm">Other</div>
          <div className="text-sm font-bold">{restPercentage.toFixed(2)}%</div>
        </li>
      </ol>
    </div>
  );
}
