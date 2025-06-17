interface CenteredHeadingProps {
  text: string;
}

/**
 * Renders a centered h2 element with text-2xl size.
 * @returns {React.JSX.Element} - The h2 element.
 */
const CenteredHeading = ({ text }: CenteredHeadingProps): React.JSX.Element => {
  return (
    <>
      <h2 className="text-2xl text-center font-bold">{text}</h2>
    </>
  );
};

export default CenteredHeading;
