import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import BreakpointIndicator from "../components/tailwind-indicator";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="flex gap-2 p-2"></div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
      <BreakpointIndicator />
    </>
  );
}
