import React from "react";
import Button from "../UI/Button";
import { useWarningContext } from "@/context/WarningContext";
import { MoveLeft } from "lucide-react";
import WarningHeading from "./WarningHeading";
import IncidentText from "./IncidentText";
import CenteredHeading from "../UI/CenteredHeading";
import { MapPin } from "lucide-react";
import { findDescriptionIndex } from "@/utils/warningUtils";
import CenteredIconHeader from "../UI/CenteredIconHeader";
import { MessageSquareMore } from "lucide-react";
/**
 * Renders information about a WarningArea.
 */
const WarningFull = (): React.JSX.Element => {
  const { resetFocus, displayData } = useWarningContext();
  const warning = displayData[0];
  const warningArea = warning.warningAreas[0];

  const affectIndex = findDescriptionIndex(warningArea, "AFFECT");

  const locationIndex = findDescriptionIndex(warningArea, "WHERE");

  const commentIndex = findDescriptionIndex(warningArea, "COMMENTS");

  let affections: Array<string> | undefined;
  if (affectIndex >= 0) {
    affections = warningArea.descriptions[affectIndex].text.sv.split("\n");
  }
  let location: string | undefined;
  if (locationIndex >= 0) {
    location = warningArea.descriptions[locationIndex].text.sv;
  }

  let comments: string | undefined;
  if (commentIndex) {
    comments = warningArea.descriptions[commentIndex].text.sv;
  }

  return (
    <div className="flex flex-col gap-5 mr-2">
      <div>
        <Button callback={resetFocus}>
          <MoveLeft /> Tillbaka
        </Button>
      </div>
      <div>
        <WarningHeading warning={warningArea} eventCode={warning.event.code} />
      </div>
      <div>
        <IncidentText warning={warningArea} />
      </div>
      {affections && (
        <div>
          <CenteredHeading text="Hur påverkar detta mig?" />
          <ul className="mt-2 list-disc pl-5">
            {affections.map((affect, i) => (
              <li className="mt-2" key={i}>
                {affect}
              </li>
            ))}
          </ul>
        </div>
      )}
      {location && (
        <div>
          <CenteredIconHeader text="Var?">
            <MapPin />
          </CenteredIconHeader>
          <p>{location}</p>
        </div>
      )}
      {comments && (
        <div>
          <CenteredIconHeader text="Kommentar">
            <MessageSquareMore />
          </CenteredIconHeader>
          <p>{comments}</p>
        </div>
      )}
      {/* TODO - add when */}
    </div>
  );
};

export default WarningFull;
