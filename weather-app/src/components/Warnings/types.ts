type LocalizedString = {
  sv: string;
  en: string;
};

type Description = {
  title: {
    code:
      | "HAPPENS"
      | "INCIDENT"
      | "AFFECT"
      | "COMMENTS"
      | "WHERE"
      | "WATERCOURSE"
      | "GROUNDWATER_MINOR"
      | "GROUNDWATER_MAJOR";
  } & LocalizedString;
  text: LocalizedString;
};

export type LatLong = [number, number];

export type Area = {
  type:
    | "Point"
    | "LineString"
    | "MultiPoint"
    | "Polygon"
    | "MultiLineString"
    | "MultiPolygon";
  geometry: GeoJSON.Geometry & {
    coordinates:
      | Array<LatLong>
      | LatLong
      | Array<Array<LatLong>>
      | Array<Array<Array<LatLong>>>;
  };
  properties: unknown;
};

type AffectedArea = {
  id: number;
  sv: string;
  en: string;
};

export type WarningLevels = "YELLOW" | "ORANGE" | "RED" | "MESSAGE";

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

// Possible event codes divided into logical types
// https://opendata.smhi.se/warnings/objects#eventdescription

type WindEvent =
  | "WIND"
  | "WIND_MOUNTAINS"
  | "WIND_MOUNTAINS_SNOW"
  | "GALE_LOW"
  | "GALE_HIGH"
  | "STORM"
  | "HURRICANE";

type ColdEvent = "STRONG_COOLING" | "SNOW" | "WIND_SNOW" | "ICE" | "BLACK_ICE";

type RainEvent = "RAIN" | "DOWNPOUR";

type FireWarning = "GRASS_FIRE" | "FOREST_FIRE";

type HighTempsEvent = "HIGH_TEMPERATURES";

type ThunderEvent = "THUNDER";

type SeaEvent =
  | "LOW_SEA_LEVEL"
  | "HIGH_SEALEVEL"
  | "HIGH_SEA_LEVEL"
  | "ICE_ACCRETION"
  | "SEVERE_ICE_ACCRETION";

type WaterEvent = "HIGH_FLOW" | "FLOODING";

type WaterShortageEvent =
  | "WATER_SHORTAGE"
  | "GROUNDWATER_MAJOR"
  | "GROUNDWATER_MINOR"
  | "GROUNDWATER_MINOR_MAJOR"
  | "WATERCOURSES"
  | "WATERCOURSES_GROUNDWATER_MAJOR"
  | "WATERCOURSES_GROUNDWATER_MINOR"
  | "WATERCOURSES_GROUNDWATER_MINOR_MAJOR";

// Event Description
type EventDescription = LocalizedString & {
  code:
    | WindEvent
    | ColdEvent
    | RainEvent
    | FireWarning
    | HighTempsEvent
    | ThunderEvent
    | SeaEvent
    | WaterEvent
    | WaterShortageEvent;
};

export type DescriptionCode =
  | "HAPPENS"
  | "INCIDENT"
  | "AFFECT"
  | "COMMENTS"
  | "WHERE"
  | "WATERCOURSE"
  | "GROUNDWATER_MINOR"
  | "GROUNDWATER_MAJOR";

type WarningAreaDescriptions = {
  title: {
    sv: string;
    en: string;
    code: DescriptionCode;
  };
  text: {
    sv: string;
    en: string;
  };
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
  descriptions: WarningAreaDescriptions[];
  area: Area;
};

export type MeteorologicalEventCode =
  | "THUNDER"
  | "WIND"
  | "WIND_MOUNTAINS"
  | "WIND_MOUNTAINS_SNOW"
  | "STRONG_COOLING"
  | "SNOW"
  | "WIND_SNOW"
  | "BLACK_ICE"
  | "RAIN"
  | "FIRE"
  | "HIGH_TEMPERATURES"
  | "WIND_SEA"
  | "ICE_ACCRETION"
  | "LOW_SEA_LEVEL"
  | "HIGH_SEALEVEL"
  | "HIGH_SEA_LEVEL"
  | "WATER_SHORTAGE"
  | "HIGH_FLOW"
  | "FLOODING";

// Event
type MeteorologicalEvent = {
  code: MeteorologicalEventCode;

  mhoClassification: LocalizedString & { code: "MET" | "HYD" | "OCE" };
} & LocalizedString;

// Main Warning Type
export type Warning = {
  id: number;
  event: MeteorologicalEvent;
  areaName: LocalizedString | null;
  descriptions: Description[];
  warningAreas: WarningArea[];
};
