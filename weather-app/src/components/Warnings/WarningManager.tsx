"use client";

import dynamic from "next/dynamic";
import { Warning } from "./types";
import { useMemo } from "react";
import { WarningProvider } from "@/context/WarningContext";

interface WarningManagerProps {
  warningData: Warning[];
}

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});

const GeoJSONArea = dynamic(() => import("@/components/Map/GeoJSONArea"), {
  ssr: false,
});

/**
 * Manager component for warning data.
 * Manages callbacks and events for when users interact with warning text or warning polygons on the map.
 */
const WarningManager = ({
  warningData,
}: WarningManagerProps): React.JSX.Element => {
  // Cache for performance
  const memoizedData = useMemo(() => {
    return warningData.map((warning) => ({ ...warning }));
  }, [warningData]);

  return (
    <>
      <WarningProvider>
        <Map data={warningData}>
          {memoizedData.flatMap((event) =>
            event.warningAreas.map((data) => (
              <GeoJSONArea
                warningArea={data}
                key={data.id}
                eventCode={event.event.mhoClassification.code}
              />
            )),
          )}
        </Map>
      </WarningProvider>
    </>
  );
};

export default WarningManager;
