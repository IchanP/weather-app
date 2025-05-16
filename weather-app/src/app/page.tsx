import WarningWrapper from "@/components/Warnings/WarningWrapper";

/**
 * Renders the home page of the application.
 */
export default async function Home(): Promise<React.JSX.Element> {
  return (
    <>
      <div className="w-screen md:w-[80%]">
        <div className="centered-column pt-8">
          <WarningWrapper />
        </div>
      </div>
    </>
  );
}
