import { MeteorologicalEventCode, Warning } from "@/components/Warnings/types";
import { useMemo } from "react";

interface FilteredWarningsReturnValue {
  tieredWarnings: Warning[];
  fireWarnings: Warning[];
  highTempWarnings: Warning[];
  waterShortageWarnings: Warning[];
}

export type UntieredWarnings = "FIRE" | "HIGH_TEMPERATURES" | "WATER_SHORTAGE";

/**
 * Returns true if code is a type UntieredWarnings. Else it returns false.
 */
export function isUntieredWarning(code: string): code is UntieredWarnings {
  return (
    code === "FIRE" || code === "HIGH_TEMPERATURES" || code === "WATER_SHORTAGE"
  );
}

/**
 * Filters the passed warnings into high tempereatures, tirered warnings, water shortage and fire risks.
 */
export const useFilteredWarnings = (
  warnings: Warning[],
): FilteredWarningsReturnValue => {
  // TODO - ideally this should be put in a global state manager as the warnings are the same globally.
  // However this is fine for our use case currently.
  const tieredWarnings = useMemo(
    () =>
      warnings.map((warning) => {
        const areas = warning.warningAreas.filter(
          (area) => area.warningLevel.code !== "MESSAGE",
        );
        return {
          ...warning,
          warningAreas: areas,
        };
      }),
    [warnings],
  );

  const fireWarnings = useMemo(
    () => filterOnCode(warnings, "FIRE"),
    [warnings],
  );

  const highTempWarnings = useMemo(
    () => filterOnCode(warnings, "HIGH_TEMPERATURES"),
    [warnings],
  );

  const waterShortageWarnings = useMemo(
    () => filterOnCode(warnings, "WATER_SHORTAGE"),
    [warnings],
  );

  return {
    tieredWarnings,
    fireWarnings,
    highTempWarnings,
    waterShortageWarnings,
  };
};

/**
 * Filters the warnings based on if it matches the provided code.
 * @param {Warning[]} warnings - The array of Warnings to filter the areas from.
 * @param {MeteorologicalEventCode} code - The code to match.
 * @returns {WarningArea[]} - Returns a Warning array.
 */
function filterOnCode(
  warnings: Warning[],
  code: MeteorologicalEventCode,
): Warning[] {
  return warnings
    .filter((warning) => warning.event.code === code)
    .map((warning) => ({
      ...warning,
      warningAreas: [...warning.warningAreas],
    }));
}
