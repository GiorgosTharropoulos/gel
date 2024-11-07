import { Cross2Icon } from "@radix-ui/react-icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { regionResultsOptions } from "~/api/region";
import { ResultsCard } from "~/components/results/results-card";

export const Route = createFileRoute("/home/$regionId")({
  component: RouteComponent,
  async loader({ context, params }) {
    return context.queryClient.ensureQueryData(
      regionResultsOptions(params.regionId),
    );
  },
});
function RouteComponent() {
  const { regionId } = Route.useParams();
  const { data: regionResults } = useSuspenseQuery(
    regionResultsOptions(regionId),
  );

  return (
    <ResultsCard
      parties={regionResults.parties}
      title={regionResults.name}
      reporting={regionResults.reporting}
      close={
        <Link to="/home">
          <Cross2Icon className="size-4" />
          <span className="sr-only">Close</span>
        </Link>
      }
    />
  );
}