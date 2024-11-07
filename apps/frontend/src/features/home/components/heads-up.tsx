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
    <div className="w-full p-6 text-white rounded-lg">
      {/* Winner Banner */}
      <div className="flex items-center gap-2 mb-4">
        <div
          style={{ backgroundColor: winner.color }}
          className="flex items-center justify-center w-6 h-6 rounded-full"
        >
          <svg
            className="w-4 h-4 text-white"
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
        <div className="flex justify-between mb-2">
          {/* Left Candidate */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
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
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="relative h-4 mt-5">
          {/* Background Bar */}
          <div className="absolute flex w-full h-full overflow-hidden rounded-full">
            <div className="w-1/2 border-r border-gray-700 bg-blue-500/20"></div>
            <div className="w-1/2 bg-gray-500/20"></div>
          </div>

          {/* Actual Progress Bars */}
          <div className="absolute flex w-full h-full overflow-hidden rounded-full">
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
            <div className="absolute text-xs text-gray-300 transform -translate-x-1/2 -top-5 left-1/2">
              150
            </div>
          </div>
        </div>

        {/* Vote Counts */}
        <div className="flex justify-between mt-2 text-sm text-gray-400">
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
