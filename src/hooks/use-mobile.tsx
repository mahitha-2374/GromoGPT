import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false); // Initialize to a consistent value (e.g., false)

  React.useEffect(() => {
    // This function will only run on the client, after initial hydration.
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Run the check once on mount
    checkDevice();

    // Add event listener for window resize
    window.addEventListener("resize", checkDevice);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", checkDevice);
  }, []); // Empty dependency array ensures this runs once on client mount after initial render

  return isMobile;
}
