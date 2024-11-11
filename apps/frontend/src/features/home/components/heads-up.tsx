interface HeadsUpResult {
  name?: string;
  votes?: number;
  votePercentage?: number;
  seats?: number;
  color?: string;
  seatsPercentage?: number;
  logo?: string;
}

interface HeadsUpProps {
  winner: HeadsUpResult;
  runnerUp: HeadsUpResult;
}

export function HeadsUp({ winner, runnerUp }: HeadsUpProps) {
  const markerPosition = (150 / 300) * 100;

  return (
    <div className="w-full rounded-lg text-white">
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
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-white">
              {winner.logo && (
                <img
                  src={`/party-images/${winner.logo}`}
                  className="object-cover"
                />
              )}
            </div>
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
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-white">
              {runnerUp.logo && (
                <img
                  src={`/party-images/${runnerUp.logo}`}
                  className="object-cover"
                />
              )}
            </div>
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
