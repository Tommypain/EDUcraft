import React from "react";
import { createRoot } from "react-dom/client";
import EDUcraft from "./EDUcraft_fixed.jsx";
import "./styles.css";

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<EDUcraft />);
}
