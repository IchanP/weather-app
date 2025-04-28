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

/**
 * Manager component for warning data.
 * Manages callbacks and events for when users interact with warning text or warning polygons on the map.
 */
const WarningManager = ({
  warningData,
}: WarningManagerProps): React.JSX.Element => {
  const eventHandlers = {
    /**
     *
     */
    mouseover: (e) => {
      console.log(e.target);
      const layer = e.target;
      layer.setStyle({
        color: "red",
      });
      layer.bringToFront();
    },
    /**
     *
     */
    mouseout: (e) => {
      const layer = e.target;
      layer.setStyle(style);
    },
  };

  return (
    <>
      <Map data={warningData}>
        {warningData.flatMap((event) =>
          event.warningAreas.map((data) => (
            <GeoJSONArea
              warningArea={data}
              key={data.id}
              eventCode={event.event.mhoClassification.code}
              eventHandlers={eventHandlers}
            />
          ))
        )}
      </Map>
    </>
  );
};

export default WarningManager;
