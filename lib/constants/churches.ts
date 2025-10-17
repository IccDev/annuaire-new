export const CHURCHES_BY_COUNTRY = {
  "Belgique": [
    "ICC Bruxelles",
    "ICC Alost",
    "ICC Anvers",
    "ICC Charleroi",
    "ICC La Louvière",
    "ICC Liège",
    "ICC Mons",
    "ICC Namur",
    "ICC Nivelles"
  ],
  "Allemagne": [
    "ICC Berlin",
    "ICC Bremen",
    "ICC Hambourg",
    "ICC Munich"
  ],
  "Pays-Bas": [
    "ICC La Haye"
  ],
  "Luxembourg": [
    "ICC Luxembourg"
  ]
} as const;

export const ALL_CHURCHES = Object.entries(CHURCHES_BY_COUNTRY)
  .flatMap(([, churches]) => churches);


export type ChurchName = typeof ALL_CHURCHES[number];
