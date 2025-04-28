import fs from "node:fs";
import path, { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Fetches current warnings. Throws an error if the response is not ok.
 */
const fetchWarnings = async () => {
  // TODO requires setup in production
  // Construct the absolute path to the JSON file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = join(
    __dirname,
    "../../public/datamock/warning-fetcher-mock.json"
  );

  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to read or parse the JSON file");
  }
};

// TODO add type here...

/**
 * Fetches weather warnings and returns them as a JavaScript object.
 */
export const useGetWarnings = () => {
  return fetchWarnings();
};
