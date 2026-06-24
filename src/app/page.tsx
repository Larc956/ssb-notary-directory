"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ListView from "@/components/ListView";
// import Header from "@/components/Header";
// import ListView from "@/components/ListView";

// CRITICAL: This dynamically imports the map so it doesn't crash Next.js SSR
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center bg-gray-100 text-brand-blue">Loading Map...</div>
});

export default function Home() {
  const [activeView, setActiveView] = useState<"map" | "list">("map");

  return (
    <main className="flex h-screen flex-col bg-white">
      {/* Header component will go here */}
      <div className="p-4 border-b relative z-20 bg-white">
         <h1 className="text-2xl font-bold text-brand-blue">SSB Directory</h1>
      </div>

      {/* The Toggle Switch */}
      <div className="flex justify-center p-3 bg-brand-light relative z-20">
        <div className="flex bg-white rounded-full shadow-sm p-1">
          <button 
            onClick={() => setActiveView("map")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeView === "map" ? "bg-brand-blue text-white" : "text-gray-600"}`}
          >
            Map View
          </button>
          <button 
            onClick={() => setActiveView("list")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeView === "list" ? "bg-brand-blue text-white" : "text-gray-600"}`}
          >
            List View
          </button>
        </div>
      </div>

      {/* The Dynamic Content Area */}
      <div className="flex-grow relative min-h-[500px]">
        {activeView === "map" ? (
          <MapView />
        ) : (
          <ListView />
        )}
      </div>
    </main>
  );
}