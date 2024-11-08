import React from "react";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

const BreakpointIndicator =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("../components/tailwind-indicator").then((res) => ({
          default: res.BreakpointIndicator,
        })),
      );
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootComponent,
  },
);

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
      <BreakpointIndicator />
    </>
  );
}
