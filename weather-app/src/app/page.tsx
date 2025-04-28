import Warnings from "@/components/Warnings/Warnings";

/**
 * Renders the home page of the application.
 */
export default async function Home(): Promise<React.JSX.Element> {
  return (
    <>
      <div className="w-screen h-screen centered-column">
        <Warnings />
      </div>
    </>
  );
}
