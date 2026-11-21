import connectDB from "@/lib/db";
import { ObjectId } from "mongodb";
import { getRewatchOrder } from "@/services/movieOrder";

export async function GET(request, { params }) {
  try {
    const { id } = await params;


    if (!ObjectId.isValid(id)) {
      return Response.json({ message: "Invalid movie ID" }, { status: 400 });
    }

    const db = await connectDB();
    const movies = db.collection("movies");


    const movieList = await movies.find({}).toArray();

  

    const result = getRewatchOrder(movieList, id);

  
    if (!result) {
      return Response.json({ message: "Movie not found" }, { status: 404 });
    }

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
