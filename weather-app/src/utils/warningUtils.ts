import { DescriptionCode, WarningArea } from "@/components/Warnings/types";

/**
 * Returns the index of the object containing the passed description code.
 */
export function findDescriptionIndex(
  warning: WarningArea,
  code: DescriptionCode,
): number {
  return warning.descriptions.findIndex((desc) => desc.title.code === code);
}
