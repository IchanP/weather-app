import { useState } from "react";
import { X } from "lucide-react";
/**
 * Renders a red banner with a warning message to be displayed.
 * Is stickied to the top of the viewport.
 */
const WarningBanner = ({ text }: { text: string }): React.JSX.Element => {
  const [visible, setVisible] = useState<boolean>(true);
  return (
    <>
      {visible && (
        <div className="bg-red-700 fixed top-0 w-full py-3">
          <p className="text-center">{text}</p>
          <button
            onClick={() => setVisible(false)}
            className="cursor-pointer absolute right-15 top-[50%] -translate-y-6/12"
          >
            <X />
          </button>
        </div>
      )}
    </>
  );
};

export default WarningBanner;
