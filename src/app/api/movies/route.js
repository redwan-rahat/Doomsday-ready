
import connectDB from "@/lib/db";
import { hasCircularDependency } from "@/services/movieOrder";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const db = await connectDB();
    const movies = db.collection("movies");

    const data = await request.json();

    // Get all existing movies
    const existingMovies = await movies.find({}).toArray();

    // Generate an ID for the new movie
    const newMovieId = new ObjectId();

    // Check for circular dependency
    const hasCycle = hasCircularDependency(
      existingMovies,
      newMovieId,
      data.prerequisites || []
    );

    if (hasCycle) {
      return Response.json(
        {
          code: "CIRCULAR_DEPENDENCY",
          message: "Circular dependency detected",
        },
        { status: 409 }
      );
    }

    // Insert movie if no cycle is detected
    const newMovie = {
      _id: newMovieId,
      title: data.title,
      releaseDate: data.releaseDate,
      runtime: Number(data.runtime),
      prerequisites: data.prerequisites || [],
      watched: false,
    };

    await movies.insertOne(newMovie);

    return Response.json(
      {
        message: "Movie created successfully",
        movie: {
          ...newMovie,
          _id: newMovieId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to create movie" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await connectDB();
    const movies = db.collection("movies");

    const data = await movies.find({}).toArray();

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
