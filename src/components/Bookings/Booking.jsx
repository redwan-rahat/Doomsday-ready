
"use client";

import { FiFilm, FiPlus, FiX } from "react-icons/fi";
import CinemaList from "./CinemaList";

export default function Booking({
    cinemas = [],
    selectedCinemaId,
    onCinemaChange,
    groupSize,
    onGroupSizeChange,
    onBookingSubmit,
    bookingResult,
    bookingLoading,
    cinemaForm,
    onCinemaFormChange,
    onCinemaSubmit,
    cinemaLoading,
    showCinemaModal,
    onOpenCinemaModal,
    onCloseCinemaModal,
    onDeleteCinema,
    error,
}) {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <section className="p-5 md:p-8 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <p className="text-primary text-sm mb-2">Booking</p>
                            <h2 className="text-3xl font-semibold">
                                Watch Party Booking
                            </h2>
                            <p className="text-text-secondary mt-2">
                                Find the best bundle combination for your group.
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface border border-border rounded-xl p-5 md:p-6 mb-10">
                        <h3 className="text-lg font-semibold mb-5">
                            Book Your Watch Party
                        </h3>

                        <form onSubmit={onBookingSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Select Cinema
                                    </label>

                                    <select
                                        value={selectedCinemaId}
                                        onChange={(e) => onCinemaChange(e.target.value)}
                                        required
                                        className="w-full bg-surface-secondary border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
                                    >
                                        <option value="">Choose a cinema</option>

                                        {cinemas.map((cinema) => (
                                            <option key={cinema._id} value={cinema._id}>
                                                {cinema.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Group Size
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        max="10000"
                                        value={groupSize}
                                        onChange={(e) => onGroupSizeChange(e.target.value)}
                                        placeholder="Enter number of people"
                                        required
                                        className="w-full bg-surface-secondary border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={bookingLoading || cinemas.length === 0}
                                className="mt-5 bg-primary hover:bg-primary-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded-lg text-sm font-medium transition-colors"
                            >
                                {bookingLoading ? "Calculating..." : "Get Booking Quote"}
                            </button>
                        </form>



                        {bookingResult && (
                            <div className="mt-6 bg-surface-secondary rounded-lg p-5">
                                {bookingResult.possible ? (
                                    <>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                            <div>
                                                <p className="text-xs text-text-muted uppercase mb-1">
                                                    Booking Result
                                                </p>

                                                <h4 className="text-xl font-semibold">
                                                    {bookingResult.totalBundles}{" "}
                                                    {bookingResult.totalBundles === 1
                                                        ? "bundle"
                                                        : "bundles"}{" "}
                                                    required
                                                </h4>
                                            </div>

                                            <span className="text-sm text-text-secondary">
                                                {bookingResult.groupSize} people
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {Object.entries(bookingResult.bundles)
                                                .sort(
                                                    ([a], [b]) => Number(b) - Number(a)
                                                )
                                                .map(([size, quantity]) => (
                                                    <div
                                                        key={size}
                                                        className="flex items-center justify-between text-sm"
                                                    >
                                                        <span className="text-text-secondary">
                                                            {size} seats × {quantity}
                                                        </span>

                                                        <span className="font-medium">
                                                            {Number(size) * quantity} seats
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <p className="text-xs text-text-muted uppercase mb-2">
                                            Booking Result
                                        </p>

                                        <h4 className="text-lg font-semibold text-red-400">
                                            Not possible
                                        </h4>

                                        <p className="text-sm text-text-secondary mt-1">
                                            {bookingResult.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold">
                                Available Cinemas
                            </h3>

                            <p className="text-sm text-text-secondary mt-1">
                                Manage cinemas and their available bundle sizes.
                            </p>
                        </div>

                        <button
                            onClick={onOpenCinemaModal}
                            className="bg-primary hover:bg-primary-hover cursor-pointer px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                            <FiPlus size={16} />
                            Add Cinema
                        </button>
                    </div>

                    <CinemaList
                        cinemas={cinemas}
                        selectedCinemaId={selectedCinemaId}
                        onSelectCinema={onCinemaChange}
                        onDeleteCinema={onDeleteCinema}
                    />
                </div>
            </section>

            {showCinemaModal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-surface border border-border rounded-xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold">
                                Add Cinema
                            </h3>

                            <button
                                onClick={onCloseCinemaModal}
                                className="text-text-secondary hover:text-foreground cursor-pointer"
                                aria-label="Close modal"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={onCinemaSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Cinema Name
                                </label>

                                <input
                                    type="text"
                                    value={cinemaForm.name}
                                    onChange={(e) =>
                                        onCinemaFormChange({
                                            ...cinemaForm,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. Star Cineplex"
                                    required
                                    className="w-full bg-surface-secondary border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Bundle Sizes
                                </label>

                                <input
                                    type="text"
                                    value={cinemaForm.bundleSizes}
                                    onChange={(e) =>
                                        onCinemaFormChange({
                                            ...cinemaForm,
                                            bundleSizes: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. 2, 5, 6"
                                    required
                                    className="w-full bg-surface-secondary border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary"
                                />

                                <p className="text-xs text-text-muted mt-2">
                                    Enter bundle sizes separated by commas (1–10 unique sizes).
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 text-red-400 rounded-lg p-3 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onCloseCinemaModal}
                                    className="flex-1 bg-surface-secondary hover:bg-border cursor-pointer rounded-lg py-3 text-sm font-medium"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={cinemaLoading}
                                    className="flex-1 bg-primary hover:bg-primary-hover cursor-pointer disabled:opacity-50 rounded-lg py-3 text-sm font-medium"
                                >
                                    {cinemaLoading ? "Saving..." : "Save Cinema"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
