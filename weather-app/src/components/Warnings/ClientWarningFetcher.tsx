// "use client";
// import { useQuery } from "@tanstack/react-query";
// import dynamic from "next/dynamic";
// import { Spinner } from "../Spinner";

// /**
//  * Responsible for fetching the forecasted weather and passing it to the renderer.
//  */
// const WarningFetcher = () => {
//   const Map = dynamic(() => import("@/components/Map/Map"), {
//     ssr: false,
//   });
//   // TODO leave all this here for now so we can go back and look at it...
//   /**
//    * Fetches current and forecast data for the last hour.
//    */
//   const fetchWarnings = async () => {
//     const response = await fetch("/datamock/warning-fetcher-mock.json");
//     if (!response.ok) {
//       throw Error("Response not ok");
//     }
//     return response.json();
//   };

//   // TODO move this to route level at some point
//   const { isError, isPending, data, error } = useQuery({
//     queryKey: ["warnings"],
//     queryFn: fetchWarnings,
//   });

//   if (isPending)
//     return (
//       <div>
//         <Spinner />
//       </div>
//     );

//   if (isError) return <div>Error: {error.message}</div>;
//   return (
//     <>
//       <Map data={data} onClickCallback={() => console.log("yest")} />
//     </>
//   );
// };

// export default WarningFetcher;
