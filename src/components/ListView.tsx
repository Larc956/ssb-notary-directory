"use client";

import { useState, useEffect } from "react";
import { notariesData, Notary } from "@/data/notaries";

// Mathematical formula to calculate exact kilometers between two GPS coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function ListView() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sortedNotaries, setSortedNotaries] = useState<Notary[]>(notariesData);

  useEffect(() => {
    // Ask the browser for the user's current location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          // Sort the directory from closest to farthest
          const sorted = [...notariesData].sort((a, b) => {
            const distA = calculateDistance(latitude, longitude, a.lat, a.lng);
            const distB = calculateDistance(latitude, longitude, b.lat, b.lng);
            return distA - distB;
          });
          setSortedNotaries(sorted);
        },
        (error) => {
          console.warn("Location access denied. Displaying default order.", error);
        }
      );
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto bg-gray-50 pb-32 absolute inset-0 z-0">
      {sortedNotaries.map((notary) => {
        // Calculate the specific distance for this card if location is enabled
        const distance = userLocation
          ? calculateDistance(userLocation.lat, userLocation.lng, notary.lat, notary.lng).toFixed(1)
          : null;

        return (
          <div key={notary.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div className="pr-4">
                <h3 className="font-bold text-[#003A6C] text-lg leading-tight">{notary.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{notary.address}</p>
              </div>
              
              {/* Dynamic Distance Display */}
              {distance && (
                <div className="text-right shrink-0 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                  <span className="text-[#003A6C] font-bold text-lg">{distance}</span>
                  <span className="text-xs text-[#003A6C] block font-medium">km away</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
               <div><span className="font-semibold text-gray-700">Fee:</span> <span className="text-green-700 font-bold">{notary.fee}</span></div>
               <div><span className="font-semibold text-gray-700">Hours:</span> <span className="text-gray-600">{notary.hours !== "Not specified" ? "Check Details" : "Unknown"}</span></div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {notary.payments.map(method => (
                <span key={method} className="px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-md text-xs font-medium">
                  {method}
                </span>
              ))}
            </div>

            {/* Render feedback if it exists */}
            {notary.feedback && (
              <div className="mt-2 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-xs font-bold text-yellow-800 mb-1">Scholar Feedback:</p>
                <p className="text-sm text-yellow-700 italic">"{notary.feedback}"</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}