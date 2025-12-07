import React, { useState } from "react";

export default function DeclineModal({ item, loading, onCancel, onConfirm }) {
  const presetMessages = [
    "Guest did not pay the required 50% of price.",
    "Guest was rude or displayed inappropriate behavior.",
  ];

  const [selectedPreset, setSelectedPreset] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const finalMessage = selectedPreset || customMessage;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-3">Decline Booking</h2>

        <p className="text-sm text-gray-600 mb-4">
          Select a reason or type your own message.
        </p>

        {/* PRESET MESSAGES */}
        <label className="text-sm font-medium">Preset Reason</label>
        <select
          className="w-full border rounded px-3 py-2 mb-3 text-sm"
          value={selectedPreset}
          onChange={(e) => {
            setSelectedPreset(e.target.value);
            setCustomMessage("");
          }}
        >
          <option value="">-- Select preset reason --</option>
          {presetMessages.map((msg, i) => (
            <option key={i} value={msg}>
              {msg}
            </option>
          ))}
        </select>

        {/* CUSTOM MESSAGE */}
        <label className="text-sm font-medium">Custom Note</label>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm h-24"
          placeholder="Type custom decline reason..."
          value={customMessage}
          onChange={(e) => {
            setCustomMessage(e.target.value);
            setSelectedPreset("");
          }}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded text-sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-red-600 text-white rounded text-sm"
            disabled={!finalMessage || loading}
            onClick={() => onConfirm(finalMessage)}
          >
            {loading ? "Processing..." : "Decline Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
