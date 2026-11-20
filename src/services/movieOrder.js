// Check whether adding prerequisites creates a circular dependency
export function hasCircularDependency(movies, movieId, prerequisites) {
  const visited = new Set();

  // Find a movie by its ID
  const findMovie = (id) =>
    movies.find((movie) => movie._id.toString() === id.toString());

  // Follow the prerequisite chain
  const hasCycle = (currentId) => {
    // We reached the movie we're trying to update
    if (currentId.toString() === movieId.toString()) {
      return true;
    }

    // Already visited this movie
    if (visited.has(currentId.toString())) {
      return false;
    }

    visited.add(currentId.toString());

    const currentMovie = findMovie(currentId);

    if (!currentMovie) {
      return false;
    }

    // Check all prerequisites of this movie
    return currentMovie.prerequisites.some((prerequisiteId) =>
      hasCycle(prerequisiteId),
    );
  };

  // Start searching from each proposed prerequisite
  return prerequisites.some((prerequisiteId) => hasCycle(prerequisiteId));
}

// Generate the prerequisite watch order for a target movie

export function getRewatchOrder(movies, targetMovieId) {
  const visited = new Set();
  const rewatchOrder = [];

  // Find a movie by its ID
  const findMovie = (id) =>
    movies.find((movie) => movie._id.toString() === id.toString());

  // Visit prerequisites and calculate dependency level
  const visitMovie = (movieId) => {
    const id = movieId.toString();

    // Skip movies we have already visited
    if (visited.has(id)) {
      return;
    }

    visited.add(id);

    const movie = findMovie(id);

    if (!movie) {
      return 0;
    }

    let level = 1;

    // Visit all prerequisites first
    (movie.prerequisites || []).forEach((prerequisiteId) => {
      const prerequisiteLevel = visitMovie(prerequisiteId);

      level = Math.max(level, prerequisiteLevel + 1);
    });

    // Add the movie after its prerequisites
    rewatchOrder.push({
      ...movie,
      watchLevel: level,
    });

    return level;
  };

  // Find the target movie
  const targetMovie = findMovie(targetMovieId);

  if (!targetMovie) {
    return null;
  }
  // Start with target prerequisites, excluding the target itself
  (targetMovie.prerequisites || []).forEach((prerequisiteId) => {
    visitMovie(prerequisiteId);
  });

  // Calculate watched count
  const watchedCount = rewatchOrder.filter((movie) => movie.watched).length;

  // Group movies by dependency level
  const groupedMovies = rewatchOrder.reduce((groups, movie) => {
    const level = movie.watchLevel;

    if (!groups[level]) {
      groups[level] = [];
    }

    groups[level].push(movie);

    return groups;
  }, {});

  return {
    rewatchOrder: groupedMovies,
    watchedCount,
  };
}
