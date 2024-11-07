import { hc } from "hono/client";

import type { app } from "./index";

export const appClient = hc<typeof app>("/");

export interface PartyResult {
  id: number;
  name: string;
  shortName: string;
  color: string;
  percentage: number;
  votes: number;
  seats: number;
}

export interface ReportingResult {
  percentage: number;
  countedStations: number;
  totalStations: number;
}

export interface RegionResultsDTO {
  votes: {
    total: number;
    invalidAndBlankPercentage: number;
  };
  turnoutPercentage: number;
  lastUpdated: string;
  reporting: ReportingResult;
  parties: PartyResult[];
}
