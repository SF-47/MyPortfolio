import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "../theme/ThemeProvider";
import { FindlyDemo } from "./FindlyDemo";
import "../index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <main>
        <FindlyDemo />
      </main>
      <Analytics />
    </ThemeProvider>
  </StrictMode>,
);
