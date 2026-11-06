import { useEffect, useState } from "react";

/** Current time in a time zone, e.g. "14:05", refreshed every 20 s. */
export function useLocalTime(timeZone: string) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 20_000);
    return () => window.clearInterval(id);
  }, []);
  return new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(now);
}
