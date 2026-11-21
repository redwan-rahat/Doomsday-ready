
"use client";

import {
  FiFilm,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

export default function RewatchPlan({
  movies = [],
  selectedMovie,
  rewatchOrder = {},
  watchedCount = 0,
  loading = false,
  onSelectMovie,
}) {
  const formatDate = (date) => new Date(date).getFullYear();

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) return `${remainingMinutes} min`;

    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const watchLevels = Object.entries(rewatchOrder).sort(
    ([levelA], [levelB]) => Number(levelA) - Number(levelB)
  );

  const totalPrerequisites = watchLevels.reduce(
    (total, [, levelMovies]) => total + levelMovies.length,
    0
  );

  const totalUnwatchedRuntime = watchLevels.reduce(
    (total, [, levelMovies]) =>
      total +
      levelMovies.reduce(
        (levelTotal, movie) =>
          levelTotal + (!movie.watched ? movie.runtime : 0),
        0
      ),
    0
  );

  const getLevelUnwatchedRuntime = (levelMovies) =>
    levelMovies.reduce(
      (total, movie) =>
        total + (!movie.watched ? movie.runtime : 0),
      0
    );

  const progress =
    totalPrerequisites > 0
      ? (watchedCount / totalPrerequisites) * 100
      : 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="p-5 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-primary text-sm mb-2">
              Rewatch Planner
            </p>

            <h2 className="text-3xl font-semibold">
              Plan Your Rewatch
            </h2>

            <p className="text-text-secondary mt-2">
              Select a movie to see its prerequisite watch order.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(280px,0.85fr)_minmax(0,2fr)] gap-6">
            <div className="bg-surface rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">
                    Movies
                  </h3>

                  <p className="text-sm text-text-secondary mt-1">
                    Select a target movie
                  </p>
                </div>

                <span className="text-xs text-text-muted">
                  {movies.length} movies
                </span>
              </div>

              {movies.length > 0 ? (
                <div className="space-y-3">
                  {movies.map((movie) => (
                    <button
                      key={movie._id}
                      onClick={() => {
                        onSelectMovie(movie);

                        document
                          .getElementById("selected-movie-section")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }}
                      className={`w-full flex items-center gap-3 text-left p-4 rounded-lg border transition-colors cursor-pointer ${
                        selectedMovie?._id === movie._id
                          ? "bg-primary-muted border-primary"
                          : "bg-surface-secondary border-transparent hover:border-border"
                      }`}
                    >
                      <div className="shrink-0">
                        <FiFilm
                          size={20}
                          className="text-primary"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm leading-snug">
                          {movie.title}
                        </h4>

                        <p className="text-xs text-text-muted mt-1">
                          {formatDate(movie.releaseDate)} ·{" "}
                          {movie.runtime} min
                        </p>
                      </div>

                      <div className="shrink-0">
                        {movie.watched ? (
                          <FiCheckCircle
                            size={18}
                            className="text-green-500"
                          />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-yellow-500 block" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-surface-secondary rounded-lg p-6 text-center">
                  <p className="text-sm text-text-muted">
                    No movies available. Add movies first.
                  </p>
                </div>
              )}
            </div>

            <div
              id="selected-movie-section"
              className="bg-surface rounded-xl p-6 min-w-0"
            >
              {selectedMovie ? (
                <>
                  <div className="mb-6">
                    <p className="text-xs text-text-muted mb-2">
                      YOUR SELECTED MOVIE
                    </p>

                    <h3 className="text-xl font-semibold">
                      {selectedMovie.title}
                    </h3>

                    <p className="text-sm text-text-secondary mt-1">
                      Movies you need to watch before this movie.
                    </p>
                  </div>

                  {loading ? (
                    <div className="bg-surface-secondary rounded-lg p-8 text-center">
                      <p className="text-sm text-text-secondary">
                        Generating your rewatch order...
                      </p>
                    </div>
                  ) : (
                    <>
                      {totalPrerequisites > 0 ? (
                        <>
                          <div className="bg-surface-secondary rounded-lg p-5 mb-6">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary-muted rounded-lg p-3">
                                <FiClock
                                  size={22}
                                  className="text-primary"
                                />
                              </div>

                              <div>
                                <p className="text-xs text-text-muted">
                                  TOTAL UNWATCHED TIME
                                </p>

                                <h3 className="text-2xl font-semibold mt-1">
                                  {formatRuntime(totalUnwatchedRuntime)}
                                </h3>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-5">
                              <p className="text-sm text-text-secondary">
                                {watchedCount} of {totalPrerequisites} movies watched
                              </p>

                              <p className="text-xs text-text-muted">
                                {Math.round(progress)}% complete
                              </p>
                            </div>

                            <div className="h-2 bg-border rounded-full mt-3 overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="space-y-6">
                            {watchLevels.map(([level, levelMovies]) => {
                              const levelRuntime =
                                getLevelUnwatchedRuntime(levelMovies);

                              return (
                                <div key={level}>
                                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-3">
                                      <span className="bg-primary-muted text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                                        Watch Level {level}
                                      </span>

                                      <span className="text-xs text-text-muted">
                                        {levelMovies.length}{" "}
                                        {levelMovies.length === 1
                                          ? "movie"
                                          : "movies"}
                                      </span>
                                    </div>

                                    <span className="text-xs text-text-secondary">
                                      <FiClock className="inline mr-1" />
                                      {formatRuntime(levelRuntime)} unwatched
                                    </span>
                                  </div>

                                  <div className="space-y-3">
                                    {levelMovies.map((movie) => (
                                      <div
                                        key={movie._id}
                                        className="bg-surface-secondary rounded-lg p-4 flex items-center justify-between gap-4"
                                      >
                                        <div className="flex items-center gap-3 min-w-0">
                                          <FiFilm
                                            size={20}
                                            className="text-primary shrink-0"
                                          />

                                          <div className="min-w-0">
                                            <h4 className="font-medium text-sm">
                                              {movie.title}
                                            </h4>

                                            <p className="text-xs text-text-muted mt-1">
                                              {formatDate(movie.releaseDate)} ·{" "}
                                              {movie.runtime} min
                                            </p>
                                          </div>
                                        </div>

                                        <span
                                          className={`text-xs font-medium px-3 py-1.5 rounded-full shrink-0 ${
                                            movie.watched
                                              ? "bg-green-500/15 text-green-400"
                                              : "bg-yellow-500/15 text-yellow-400"
                                          }`}
                                        >
                                          {movie.watched
                                            ? "Watched"
                                            : "Not watched"}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="bg-surface-secondary rounded-lg p-8 text-center">
                          <FiCheckCircle
                            className="mx-auto text-green-500 mb-3"
                            size={28}
                          />

                          <h4 className="font-medium">
                            No prerequisite movies
                          </h4>

                          <p className="text-sm text-text-muted mt-2">
                            You don't need to watch any other movies before{" "}
                            {selectedMovie.title}.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <FiClock
                    className="text-text-muted mb-3"
                    size={28}
                  />

                  <p className="text-text-secondary">
                    Select a movie to see its rewatch order.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
