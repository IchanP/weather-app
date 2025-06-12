"use client";

import dynamic from "next/dynamic";
import { Warning } from "./types";
import { WarningProvider } from "@/context/WarningContext";
import WarningView from "./WarningView";
import TypeSelectorWrapper from "./TypeSelectorWrapper";
import { useState } from "react";
import { useFilteredWarnings } from "@/hooks/useFilteredWarnings";

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

  /**
   * Filters out all the WarningAreas except for the current ID and sets the displayData to the warning.
   */
  const displayOneArea = (id: number): void => {
    setDisplayData((prev) =>
      prev.map((warning) => {
        const areas = warning.warningAreas.filter((area) => area.id === id);
        return {
          ...warning,
          warningAreas: areas,
        };
      }),
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 max-w-[100%]">
      <WarningProvider>
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
      </WarningProvider>
    </div>
  );
};

export default WarningManager;
