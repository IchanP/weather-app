"use client";

import { Spinner } from "../Spinner";
import { WarningProvider } from "@/context/WarningContext";
import WarningManager from "./WarningManager";
import React, { useEffect, useState } from "react";
import { isWarningArray, Warning } from "./types";

type SocketData = {
  status: "connected" | "cached" | "data" | "message";
  message: string | Warning[];
};
const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL as string);

/**
 * Responsible for fetching the forecasted weather and passing it to the renderer.
 */
const ClientFetcher = (): React.JSX.Element => {
  const [isPending, setIsPending] = useState(true);
  const [data, setData] = useState<Warning[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      /**
       * Handles the parsing of messages.
       * Sets pending to false when cache is received.
       */
      socket.onmessage = (event: MessageEvent): void => {
        const parsed = JSON.parse(event.data) as SocketData;
        console.log(parsed.status);
        if (parsed.status === "cached") {
          if (isWarningArray(parsed.message)) {
            console.log("Cache hit... Setting data to parsed warnings.");
            setData(parsed.message);
            setError(null);
          } else {
            setError(
              "We were unable to fetch warning data at this time. Please try again later.",
            );
          }
          setIsPending(false);
        } else if (parsed.status === "data") {
          if (isWarningArray(parsed.message)) {
            console.log("Data received... Setting data to parsed warnings.");
            setData(parsed.message);
            setError(null);
          } else {
          }
        } else if (
          parsed.status === "connected" ||
          parsed.status === "message"
        ) {
          console.log(parsed.message);
        } else {
          throw new TypeError();
        }
      };
    } catch {
      setError("The data displayed may be out of date."); // TODO Make more descriptive with a timestamp.
    }

    // TODO.... this doesnt work lol
    return (): void => socket.close(1000, "The client has been unmounted");
  }, []);

  if (isPending)
    return (
      <div>
        <Spinner />
      </div>
    );

  return (
    <>
      <WarningProvider>
        <WarningManager warningData={data as Warning[]} />
      </WarningProvider>
    </>
  );
};

export default ClientFetcher;
