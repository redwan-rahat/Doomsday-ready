
export function hasCircularDependency(movies, movieId, prerequisites) {
  const visited = new Set();


  const findMovie = (id) =>
    movies.find((movie) => movie._id.toString() === id.toString());


  const hasCycle = (currentId) => {

    if (currentId.toString() === movieId.toString()) {
      return true;
    }


    if (visited.has(currentId.toString())) {
      return false;
    }

    visited.add(currentId.toString());

    const currentMovie = findMovie(currentId);

    if (!currentMovie) {
      return false;
    }

    return currentMovie.prerequisites.some((prerequisiteId) =>
      hasCycle(prerequisiteId),
    );
  };


  return prerequisites.some((prerequisiteId) => hasCycle(prerequisiteId));
}



export function getRewatchOrder(movies, targetMovieId) {
  const visited = new Set();
  const rewatchOrder = [];


  const findMovie = (id) =>
    movies.find((movie) => movie._id.toString() === id.toString());


  const visitMovie = (movieId) => {
    const id = movieId.toString();


    if (visited.has(id)) {
      return;
    }

    visited.add(id);

    const movie = findMovie(id);

    if (!movie) {
      return 0;
    }

    let level = 1;


    (movie.prerequisites || []).forEach((prerequisiteId) => {
      const prerequisiteLevel = visitMovie(prerequisiteId);

      level = Math.max(level, prerequisiteLevel + 1);
    });


    rewatchOrder.push({
      ...movie,
      watchLevel: level,
    });

    return level;
  };


  const targetMovie = findMovie(targetMovieId);

  if (!targetMovie) {
    return null;
  }

  (targetMovie.prerequisites || []).forEach((prerequisiteId) => {
    visitMovie(prerequisiteId);
  });


  const watchedCount = rewatchOrder.filter((movie) => movie.watched).length;


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
