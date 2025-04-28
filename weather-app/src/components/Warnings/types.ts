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

// TODO Set up the code levels!

// Warning Level
type WarningLevel = LocalizedString & {
  code: string;
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
  areaName: string | null;
  descriptions: Description[];
  warningAreas: WarningArea[];
};
