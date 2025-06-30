import React from 'react';

interface LiveRegionProps {
  announcement: string;
}

/**
 * A visually hidden container that announces content changes to screen readers.
 * Uses role="status" and aria-live="polite" for non-interrupting announcements
 * of important, time-sensitive information.
 */
const LiveRegion: React.FC<LiveRegionProps> = ({ announcement }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only" // This class is defined in index.html for visual hiding
    >
      {announcement}
    </div>
  );
};

export default LiveRegion;
