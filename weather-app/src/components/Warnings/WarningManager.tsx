"use client";

import dynamic from "next/dynamic";
import { Warning } from "./types";

interface WarningManagerProps {
  warningData: Warning[];
}

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});

const GeoJSONArea = dynamic(() => import("@/components/Map/GeoJSONArea"), {
  ssr: false,
});

// TODO rewrite jsdoc...
/**
 * Manager component for warning data.
 * Manages callbacks and events for when users interact with warning text or warning polygons on the map.
 */
const WarningManager = ({
  warningData,
}: WarningManagerProps): React.JSX.Element => {
  return (
    <>
      <Map data={warningData}>
        {warningData.flatMap((event) =>
          event.warningAreas.map((data) => (
            <GeoJSONArea
              warningArea={data}
              key={data.id}
              eventCode={event.event.mhoClassification.code}
            />
          )),
        )}
      </Map>
    </>
  );
};

export default WarningManager;
