type LocalizedString = {
  sv: string;
  en: string;
  code?: string;
};

type Description = {
  title: LocalizedString;
  text: LocalizedString;
};

type Area = {
  type: string;
  geometry: GeoJSON.Geometry;
  properties: unknown;
};

type AffectedArea = {
  id: number;
  sv: string;
  en: string;
};

export type WarningLevels = "YELLOW" | "ORANGE" | "RED";

/**
 * Returns true if code is type WarningLevels. Else it returns false.
 */
export function isWarningLevels(code: string): code is WarningLevels {
  return code === "YELLOW" || code === "ORANGE" || code === "RED";
}

// Warning Level
type WarningLevel = LocalizedString & {
  code: WarningLevels;
};

// Event Description
type EventDescription = LocalizedString & {
  code: string;
};

// Warning Area
export type WarningArea = {
  id: number;
  approximateStart: string;
  approximateEnd: string | null;
  published: string;
  areaName: LocalizedString;
  warningLevel: WarningLevel;
  eventDescription: EventDescription;
  affectedAreas: AffectedArea[];
  descriptions: Description[];
  area: Area;
};

// Event
type MeteorologicalEvent = {
  en: string;
  sv: string;
  code: string;
  mhoClassification: LocalizedString & { code: "MET" | "HYD" | "OCE" };
};

// Main Warning Type
export type Warning = {
  id: number;
  event: MeteorologicalEvent;
  areaName: LocalizedString | null;
  descriptions: Description[];
  warningAreas: WarningArea[];
};
