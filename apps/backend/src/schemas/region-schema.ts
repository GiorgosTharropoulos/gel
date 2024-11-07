import { z } from "zod";

// Party schema definition
const PartySchema = z.object({
  EP_ID: z.number(),
  PARTY_ID: z.number(),
  Cands: z.number(),
  VOTES: z.number(),
  Perc: z.number(),
  Edres: z.number(),
  Rank: z.number(),
  vid: z.number(),
});

// Main response schema
const ElectionResultSchema = z.object({
  EP_ID: z.number(),
  Updated: z.string(),
  Gramenoi: z.number(),
  Egkyra: z.number(),
  Akyra: z.number(),
  Leyka: z.number(),
  NumTmGeo: z.number(),
  NumTm: z.number(),
  NumTmK: z.number(),
  NumTmE: z.number(),
  NumTmM: z.number(),
  WIN_ID: z.number(),
  vid: z.number(),
  official: z.number(),
  party: z.array(PartySchema),
});

export const RegionWinnerSchema = z.object({
  EP_ID: z.number(),
  PARTY_ID: z.number(),
  PARTY_ID_2: z.number(),
  Perc: z.number(),
  Edres: z.number(),
  Perc2: z.number(),
  NumTm: z.number(),
  Updated: z.string().datetime(),
  official: z.number().min(0).max(1),
});

// Type inference
type ElectionResult = z.infer<typeof ElectionResultSchema>;
type Party = z.infer<typeof PartySchema>;
type RegionWinner = z.infer<typeof RegionWinnerSchema>;

export { ElectionResultSchema, PartySchema, type ElectionResult, type Party };
