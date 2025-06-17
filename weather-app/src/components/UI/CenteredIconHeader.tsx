import CenteredHeading from "./CenteredHeading";

interface CenteredHeadingProps {
  text: string;
  children: React.ReactNode;
}

/**
 * A centered heading that accepts a child infront of the text.
 */
const CenteredIconHeader = ({
  text,
  children,
}: CenteredHeadingProps): React.JSX.Element => {
  return (
    <div className="flex flex-row gap-1 justify-center items-center">
      {children}
      <CenteredHeading text={text} />
    </div>
  );
};

export default CenteredIconHeader;
