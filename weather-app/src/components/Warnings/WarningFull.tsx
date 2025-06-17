import React from "react";
import Button from "../UI/Button";
import { useWarningContext } from "@/context/WarningContext";
import WarningHeading from "./WarningHeading";
import IncidentText from "./IncidentText";
import CenteredHeading from "../UI/CenteredHeading";
import { MoveLeft, MapPin, Clock, MessageSquareMore } from "lucide-react";
import { findDescriptionIndex } from "@/utils/warningUtils";
import CenteredIconHeader from "../UI/CenteredIconHeader";

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
  if (commentIndex >= 0) {
    comments = warningArea.descriptions[commentIndex].text.sv;
  }

  const startTime = new Date(warningArea.approximateStart);
  const startDate = startTime.toLocaleString("sv-SE", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  let endDate = " och tills vidare.";
  if (warningArea.approximateEnd) {
    const endTime = new Date(warningArea.approximateEnd);
    endDate =
      " - " +
      endTime.toLocaleString("sv-SE", {
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      });
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
      <div>
        <CenteredIconHeader text="Tid">
          <Clock />
        </CenteredIconHeader>
        <p>Från {startDate + endDate}</p>
      </div>
    </div>
  );
};

export default WarningFull;
