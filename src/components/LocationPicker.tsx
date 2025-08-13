import React, { useState } from "react";

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect }) => {
  const [search, setSearch] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("");

  // For demo: fake search resolves to Bangalore
  const handleSearch = () => {
    if (search.toLowerCase().includes("bangalore")) {
      setLat(12.9716);
      setLng(77.5946);
      setAddress("Bangalore, India");
      onLocationSelect({ lat: 12.9716, lng: 77.5946, address: "Bangalore, India" });
    } else {
      alert("Location not found. Try 'Bangalore'.");
    }
  };

  return (
    <div className="space-y-2">
      <label className="font-semibold">Search Accident Location</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Type a city or address..."
          className="border rounded px-2 py-1 w-full"
        />
        <button type="button" className="bg-blue-600 text-white px-4 py-1 rounded" onClick={handleSearch}>
          Search
        </button>
      </div>
      {lat && lng && (
        <div className="mt-2 text-sm text-gray-700">
          <strong>Selected:</strong> {address} <br />
          <span>Lat: {lat}, Lng: {lng}</span>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
