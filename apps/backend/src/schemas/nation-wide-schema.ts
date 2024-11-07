import { z } from "zod";

// Schema for individual party results
const PartyResultSchema = z.object({
  EPIK_ID: z.number(),
  PARTY_ID: z.number(),
  VOTES: z.number(),
  Perc: z.number(),
  TakesEdres: z.number(),
  Edres: z.number(),
  EdresEpik: z.number(),
  Rank: z.number(),
});

// Main election results schema
const ElectionResultsSchema = z.object({
  EPIK_ID: z.number(),
  Updated: z.string(),
  Gramenoi: z.number(),
  Egkyra: z.number(),
  Akyra: z.number(),
  Leyka: z.number(),
  NumTm: z.number(),
  NumTmK: z.number(),
  NumTmE: z.number(),
  NumTmM: z.number(),
  WIN_ID: z.number(),
  official: z.number(),
  party: z.array(PartyResultSchema),
  LockLevel: z.number(),
  LockEdres: z.number(),
});

// Type inference
export type ElectionResults = z.infer<typeof ElectionResultsSchema>;

export { ElectionResultsSchema, PartyResultSchema };
