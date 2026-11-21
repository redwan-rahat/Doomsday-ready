"use client";

import { FiFilm } from "react-icons/fi";

export default function CinemaList({
  cinemas = [],
  selectedCinemaId,
  onSelectCinema,
}) {
  if (cinemas.length === 0) {
    return (
      <div className="bg-surface rounded-xl p-10 text-center border border-border">
        <FiFilm
          className="mx-auto text-text-muted mb-3"
          size={28}
        />

        <h4 className="font-medium">No cinemas yet</h4>

        <p className="text-sm text-text-muted mt-2">
          Add your first cinema to start generating booking quotes.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {cinemas.map((cinema) => (
        <div
          key={cinema._id}
          onClick={() => onSelectCinema(cinema._id)}
          className={`aspect-[4/3] bg-surface rounded-xl p-4 flex flex-col justify-between border transition-colors cursor-pointer ${
            selectedCinemaId === cinema._id
              ? "border-primary"
              : "border-border hover:border-primary/50"
          }`}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <FiFilm className="text-primary" size={20} />
          </div>

          {/* Card Details */}
          <div>
            <h4 className="font-semibold text-sm leading-snug">
              {cinema.name}
            </h4>

            <p className="text-xs text-text-muted mt-2">
              Bundle Sizes
            </p>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {cinema.bundleSizes.map((size) => (
                <span
                  key={size}
                  className="text-xs bg-surface-secondary text-text-secondary px-2 py-1 rounded-md"
                >
                  {size} seats
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
