import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FilterAndSortScreen } from "./screens/FilterAndSortScreen/FilterAndSortScreen";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <FilterAndSortScreen />
  </StrictMode>,
);
