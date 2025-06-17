interface ButtonProps {
  children?: React.ReactNode;
  callback(): void;
}

/**
 * A blue button with a callback and text prop.
 */
const Button = ({ children, callback }: ButtonProps): React.JSX.Element => {
  return (
    <>
      <button
        onClick={callback}
        className="cursor-pointer px-2 py-2 bg-blue-800 hover:bg-blue-500 ease-in-out duration-200 flex flex-row gap-2"
      >
        {children}
      </button>
    </>
  );
};

export default Button;
