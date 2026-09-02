import masterLibrary from "./data/educraft_master_library.json";
import EDUcraft from "./EDUcraft_fixed.jsx";

// Set the 14 master curricula and encyclopedias as the active library seed
if (typeof window !== "undefined") {
  window.__EDUCRAFT_EXPORT__ = {
    id: "master-library",
    startBookId: masterLibrary.books[0]?.id || null,
    books: masterLibrary.books,
    collections: masterLibrary.collections,
    lang: "ar",
    skinId: "normal",
    flavorId: "normal",
    covers: {},
  };
}

export default function App() {
  return <EDUcraft />;
}
