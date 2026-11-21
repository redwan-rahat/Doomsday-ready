import connectDB from "@/lib/db";
import { hasCircularDependency } from "@/services/movieOrder";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const db = await connectDB();
    const movies = db.collection("movies");

    const data = await request.json();
    const title = data.title.trim();


    const duplicateMovie = await movies.findOne(
      { title },
      { collation: { locale: "en", strength: 2 } },
    );

    if (duplicateMovie) {
      return Response.json(
        {
          code: "DUPLICATE_TITLE",
          message: "A movie with this title already exists",
        },
        { status: 409 },
      );
    }


    const existingMovies = await movies.find({}).toArray();


    const newMovieId = new ObjectId();


    const hasCycle = hasCircularDependency(
      existingMovies,
      newMovieId,
      data.prerequisites || [],
    );

    if (hasCycle) {
      return Response.json(
        {
          code: "CIRCULAR_DEPENDENCY",
          message: "Circular dependency detected",
        },
        { status: 409 },
      );
    }


    const newMovie = {
      _id: newMovieId,
      title,
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
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to create movie" },
      { status: 500 },
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
      { status: 500 },
    );
  }
}
