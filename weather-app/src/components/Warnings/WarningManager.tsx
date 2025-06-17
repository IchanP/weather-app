"use client";

import dynamic from "next/dynamic";
import { Warning } from "./types";
import WarningView from "./WarningView";
import TypeSelectorWrapper from "./TypeSelectorWrapper";
import { useEffect } from "react";
import { useFilteredWarnings } from "@/hooks/useFilteredWarnings";
import { useWarningContext } from "@/context/WarningContext";

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
 * Responsible for rendering the components related to weather warnings.
 */
const WarningManager = ({
  warningData,
}: WarningManagerProps): React.JSX.Element => {
  const { tieredWarnings } = useFilteredWarnings(warningData);
  const { setWarningGroup, displayData } = useWarningContext();

  useEffect(() => {
    setWarningGroup(tieredWarnings);
  }, [setWarningGroup, tieredWarnings]);

  return (
    <div className="flex flex-col items-center justify-center gap-5 max-w-[100%]">
      <TypeSelectorWrapper data={warningData} />
      <div className="flex flex-col items-center justify-center md:flex-row md:gap-10 max-w-[100%]">
        <div className="h-map">
          <WarningView />
        </div>
        <div>
          <Map>
            {displayData.flatMap((event) =>
              event.warningAreas.map((data) => (
                <GeoJSONArea
                  warningArea={data}
                  key={data.id}
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
