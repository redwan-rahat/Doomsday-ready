import connectDB from "@/lib/db";
import { ObjectId } from "mongodb";
import { getRewatchOrder } from "@/services/movieOrder";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Validate movie ID
    if (!ObjectId.isValid(id)) {
      return Response.json({ message: "Invalid movie ID" }, { status: 400 });
    }

    // Connect to database
    const db = await connectDB();
    const movies = db.collection("movies");

    // Get all movies
    const movieList = await movies.find({}).toArray();

    // Generate rewatch order

    const result = getRewatchOrder(movieList, id);

    // Check whether target movie exists
    if (!result) {
      return Response.json({ message: "Movie not found" }, { status: 404 });
    }

    // Return movie data with string IDs
const rewatchOrder = Object.fromEntries(
  Object.entries(result.rewatchOrder).map(([level, movies]) => [
    level,
    movies.map((movie) => ({
      ...movie,
      _id: movie._id.toString(),
    })),
  ])
);


    return Response.json(
      {
        rewatchOrder,
        watchedCount: result.watchedCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to generate rewatch order" },
      { status: 500 },
    );
  }
}
