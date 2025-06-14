"use client";

import dynamic from "next/dynamic";
import { Warning } from "./types";
import WarningView from "./WarningView";
import TypeSelectorWrapper from "./TypeSelectorWrapper";
import { useState } from "react";
import { useFilteredWarnings } from "@/hooks/useFilteredWarnings";
import { useWarningContext } from "@/context/WarningContext";
import { LatLng } from "leaflet";

interface WarningManagerProps {
  warningData: Warning[];
}

// TODO extract map wrapper into its own component and turn this one into a server component.
const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});

const GeoJSONArea = dynamic(() => import("@/components/Map/GeoJSONArea"), {
  ssr: false,
});

/**
 * Manager component for rendering weather warnings and GeoJSON areas
 * Responsiblef or rendering the components related to weather warnings.
 */
const WarningManager = ({
  warningData,
}: WarningManagerProps): React.JSX.Element => {
  const { tieredWarnings } = useFilteredWarnings(warningData);
  const [displayData, setDisplayData] = useState<Warning[]>(tieredWarnings);
  const { setMapFocus } = useWarningContext();

  /**
   * Filters out all the WarningAreas except for the current ID and sets the displayData to the warning.
   * @param {number} id - The ID of the WarningArea to display.
   */
  const displayOneArea = (id: number, center: LatLng): void => {
    const newData = displayData.reduce((acc: Warning[], warning) => {
      const areas = warning.warningAreas.filter((area) => area.id === id);
      if (areas.length > 0) {
        acc.push({
          ...warning,
          warningAreas: areas,
        });
      }
      return acc;
    }, []);
    setDisplayData(newData);
    setMapFocus(center);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 max-w-[100%]">
      <TypeSelectorWrapper data={warningData} setData={setDisplayData} />
      <div className="flex flex-col items-center justify-center md:flex-row md:gap-10 max-w-[100%]">
        <div className="h-map w-map overflow-y-scroll">
          <WarningView warnings={displayData} />
        </div>
        <div>
          <Map>
            {displayData.flatMap((event) =>
              event.warningAreas.map((data) => (
                <GeoJSONArea
                  warningArea={data}
                  key={data.id}
                  display={displayOneArea}
                  eventCode={event.event.mhoClassification.code}
                />
              )),
            )}
          </Map>
        </div>
      </div>
    </div>
  );
};

export default WarningManager;
