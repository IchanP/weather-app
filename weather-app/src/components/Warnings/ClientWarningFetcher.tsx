"use client";

import { Spinner } from "../Spinner";
import { WarningProvider } from "@/context/WarningContext";
import WarningManager from "./WarningManager";
import React, { useEffect, useState } from "react";
import { Warning } from "./types";

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
  const [data, setData] = useState<Warning[] | null>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      /**
       * Handles the parsing of messages.
       * Sets pending to false when cache is received.
       */
      socket.onmessage = (event: MessageEvent): void => {
        const parsed = JSON.parse(event.data) as SocketData;
        if (parsed.status === "cached") {
          // TODO Need to validate that the data we got is ok.
          setIsPending(false);
          // TODO - need to run a typeguard here.
          //   setData(parsed.message as Warning[]);
          setError(null);
        } else if (parsed.status === "data") {
          // TODO - Run a typeguard.
          setData(parsed.message as Warning[]);
          setError(null);
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
