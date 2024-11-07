import { useEffect, useState } from "react";

function BreakpointIndicator() {
  const [breakpoint, setBreakpoint] = useState("");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        setBreakpoint("2xl");
      } else if (width >= 1280) {
        setBreakpoint("xl");
      } else if (width >= 1024) {
        setBreakpoint("lg");
      } else if (width >= 768) {
        setBreakpoint("md");
      } else if (width >= 640) {
        setBreakpoint("sm");
      } else {
        setBreakpoint("xs");
      }
    };

    updateBreakpoint();

    window.addEventListener("resize", updateBreakpoint);

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 rounded-full bg-gray-800 px-3 py-2 font-mono text-sm text-white shadow-lg">
      <span className="sm:hidden">xs</span>
      <span className="hidden sm:inline md:hidden">sm</span>
      <span className="hidden md:inline lg:hidden">md</span>
      <span className="hidden lg:inline xl:hidden">lg</span>
      <span className="hidden xl:inline 2xl:hidden">xl</span>
      <span className="hidden 2xl:inline">2xl</span>
      <span className="ml-2 opacity-75">({breakpoint})</span>
    </div>
  );
}

export default BreakpointIndicator;
