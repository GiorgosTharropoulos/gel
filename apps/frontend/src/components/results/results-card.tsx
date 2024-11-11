import type { PartyResult, ReportingResult } from "@gel/backend";

interface ResultsCardProps {
  title: string;
  parties: PartyResult[];
  close?: React.ReactNode;
  reporting: ReportingResult;
}

export function ResultsCard({
  title,
  parties,
  close,
  reporting,
}: ResultsCardProps) {
  return (
    <div className="flex flex-col justify-between rounded border p-2">
      <div className="flex items-center justify-between p-2">
        <h1 className="text-lg font-bold">{title}</h1>
        {close}
      </div>
      <ol className="flex flex-col gap-4 p-4">
        {parties
          .filter((p) => p.percentage >= 1)
          .map((p) => (
            <li key={p.id} className="grid grid-cols-4 gap-3">
              <div className="flex h-7 items-center justify-center text-center lg:h-14">
                <img
                  src={`/party-images/${p.logo}`}
                  className="inline h-full object-contain"
                />
              </div>
              <div className="text-sm">{p.shortName}</div>
              <div className="text-sm font-bold">
                {p.percentage.toFixed(2)}%
              </div>
              <div className="text-sm">{p.seats}</div>
            </li>
          ))}
      </ol>

      <div className="flex justify-end text-sm">
        {reporting.percentage.toFixed(2)}% ({reporting.countedStations} /
        {reporting.totalStations})
      </div>
    </div>
  );
}
