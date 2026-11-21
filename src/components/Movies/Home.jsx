
"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiFilm, FiCheckCircle } from "react-icons/fi";
import MovieModal from "./MovieModal";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [availableMovies, setAvailableMovies] = useState([]);
  const [selectedPrerequisites, setSelectedPrerequisites] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetchingMovies, setFetchingMovies] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    releaseDate: "",
    runtime: "",
  });


  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch movies");
        }

        setMovies(Array.isArray(data) ? data : data.movies || []);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setFetchingMovies(false);
      }
    }

    fetchMovies();
  }, []);

  // Open Add Movie Modal
  const openAddModal = () => {
    setEditingMovie(null);

    setFormData({
      title: "",
      releaseDate: "",
      runtime: "",
    });

    setSelectedPrerequisites([]);
    setAvailableMovies(movies);
    setError("");
    setShowMovieModal(true);
  };

  // Open Edit Movie Modal
  const openEditModal = (movie) => {
    setEditingMovie(movie);

    setFormData({
      title: movie.title,
      releaseDate: movie.releaseDate,
      runtime: movie.runtime,
    });

    setSelectedPrerequisites(movie.prerequisites || []);

    // Exclude the current movie from its own prerequisite options
    setAvailableMovies(
      movies.filter((item) => item._id !== movie._id)
    );

    setError("");
    setShowMovieModal(true);
  };

  // Add or Update Movie
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const isEditing = Boolean(editingMovie);

      const response = await fetch(
        isEditing
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${editingMovie._id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/movies`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            runtime: Number(formData.runtime),
            prerequisites: selectedPrerequisites,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save movie");
      }

      if (isEditing) {
        setMovies((prev) =>
          prev.map((movie) =>
            movie._id === editingMovie._id ? data.movie : movie
          )
        );
      } else {
        setMovies((prev) => [...prev, data.movie]);
      }

      setShowMovieModal(false);
      setEditingMovie(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Watched Status
  const handleWatchedChange = async (movie) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${movie._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            watched: !movie.watched,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update watched status");
      }

      setMovies((prev) =>
        prev.map((item) =>
          item._id === movie._id ? data.movie : item
        )
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // Delete Movie
  const handleDelete = async (movie) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${movie.title}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${movie._id}`,
        {
          method: "DELETE",
        }
      );


      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete movie");
      }

      setMovies((prev) =>
        prev.filter((item) => item._id !== movie._id)
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // Toggle prerequisite selection
  const handlePrerequisiteChange = (id) => {
    setSelectedPrerequisites((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const formatDate = (date) => new Date(date).getFullYear();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="p-5 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-primary text-sm mb-2">Movies</p>

              <h2 className="text-3xl font-semibold">
                Your MCU Watchlist
              </h2>

              <p className="text-text-secondary mt-2">
                Manage your movies and track your watch progress.
              </p>
            </div>

            <button
              onClick={openAddModal}
              disabled={fetchingMovies}
              className="bg-primary hover:bg-primary-hover cursor-pointer px-5 py-3 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              + Add Movie
            </button>
          </div>



          {/* Movie Collection */}
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold">All Movies</h3>

            <span className="text-xs text-text-muted">
              {movies.length} movies
            </span>
          </div>

          {fetchingMovies ? (
            <div className="bg-surface rounded-xl p-10 text-center">
              <p className="text-text-secondary">Loading movies...</p>
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {movies.map((movie) => (
                <div
                  key={movie._id}
                  className="aspect-[4/3] bg-surface rounded-xl p-4 flex flex-col justify-between border border-border hover:border-primary/50 transition-colors"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <FiFilm className="text-primary" size={20} />

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditModal(movie)}
                        className="text-text-secondary hover:text-foreground cursor-pointer"
                        aria-label={`Edit ${movie.title}`}
                      >
                        <FiEdit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(movie)}
                        className="text-text-secondary hover:text-red-400 cursor-pointer"
                        aria-label={`Delete ${movie.title}`}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div>
                    <h4 className="font-semibold text-sm leading-snug">
                      {movie.title}
                    </h4>

                    <p className="text-xs text-text-muted mt-2">
                      {formatDate(movie.releaseDate)} · {movie.runtime} min
                    </p>
                  </div>

                  {/* Watched Status */}
                  <button
                    onClick={() => handleWatchedChange(movie)}
                    className={`flex items-center gap-2 text-xs font-medium w-fit px-3 py-1.5 rounded-full cursor-pointer transition-colors ${movie.watched
                      ? "bg-green-500/15 text-green-400"
                      : "bg-surface-secondary text-text-secondary hover:text-foreground"
                      }`}
                  >
                    <FiCheckCircle size={14} />
                    {movie.watched ? "Watched" : "Mark as watched"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface rounded-xl p-10 text-center">
              <FiFilm className="mx-auto text-text-muted mb-3" size={28} />

              <h4 className="font-medium">No movies yet</h4>

              <p className="text-sm text-text-muted mt-2">
                Add your first movie to start building your MCU watchlist.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Movie Modal */}
      {showMovieModal && (
        <MovieModal
          formData={formData}
          setFormData={setFormData}
          availableMovies={availableMovies}
          selectedPrerequisites={selectedPrerequisites}
          onPrerequisiteChange={handlePrerequisiteChange}
          onClose={() => {
            setShowMovieModal(false);
            setEditingMovie(null);
          }}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      )}
    </main>
  );
}
