
"use client";

import { FiX } from "react-icons/fi";

export default function MovieModal({
    formData,
    setFormData,
    availableMovies,
    selectedPrerequisites,
    onPrerequisiteChange,
    onClose,
    onSubmit,
    loading,
    error,
}) {
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-surface p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">Add Movie</h2>
                        <p className="text-sm text-text-secondary mt-1">
                            Add a movie to your collection.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-text-secondary hover:text-foreground cursor-pointer"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label className="gap-1 flex text-sm font-medium mb-2">
                            Movie Title
                            <span className="text-primary">*</span>
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter movie title"
                            required
                            className="w-full rounded-lg bg-surface-secondary px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="gap-1 flex text-sm font-medium mb-2">
                            Release Date
                            <span className="text-primary">*</span>
                        </label>

                        <input
                            type="date"
                            name="releaseDate"
                            value={formData.releaseDate}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg bg-surface-secondary px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="gap-1 flex text-sm font-medium mb-2">
                            Runtime (minutes)
                            <span className="text-primary">*</span>
                        </label>

                        <input
                            type="number"
                            name="runtime"
                            value={formData.runtime}
                            onChange={handleChange}
                            min="1"
                            max="300"
                            placeholder="e.g. 120"
                            required
                            className="w-full rounded-lg bg-surface-secondary px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Prerequisite Movies
                        </label>

                        <p className="text-xs text-text-muted mb-3">
                            Select any movies that should be watched first. You can select multiple movies.
                        </p>

                        {availableMovies.length > 0 ? (
                            <div className="max-h-48 overflow-y-auto rounded-lg bg-surface-secondary p-3 space-y-2">
                                {availableMovies.map((movie) => (
                                    <label
                                        key={movie._id}
                                        className="flex items-center gap-3 rounded-md p-2 hover:bg-border cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedPrerequisites.includes(movie._id)}
                                            onChange={() => onPrerequisiteChange(movie._id)}
                                            className="h-4 w-4 accent-primary cursor-pointer"
                                        />

                                        <span className="text-sm">{movie.title}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg bg-surface-secondary p-4 text-center">
                                <p className="text-sm text-text-muted">
                                    No movies available. Add some movies first to select them as prerequisites.
                                </p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="text-sm text-red-400">{error}</p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-surface-secondary px-4 py-2 text-sm hover:bg-border cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium hover:bg-primary-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
