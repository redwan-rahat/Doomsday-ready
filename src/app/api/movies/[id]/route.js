import connectDB from "@/lib/db";
import { hasCircularDependency } from "@/services/movieOrder";
import { ObjectId } from "mongodb";



export async function PATCH(request, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ message: "Invalid movie ID" }, { status: 400 });
    }

    const db = await connectDB();
    const movies = db.collection("movies");

    const data = await request.json();

    // Find the movie being updated
    const currentMovie = await movies.findOne({
      _id: new ObjectId(id),
    });

    if (!currentMovie) {
      return Response.json({ message: "Movie not found" }, { status: 404 });
    }

    // Check if another movie already uses this title
    const title = (data.title ?? currentMovie.title).trim();

    const duplicateMovie = await movies.findOne(
      {
        title,
        _id: { $ne: new ObjectId(id) },
      },
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

    // Get all movies for cycle detection
    const existingMovies = await movies.find({}).toArray();

    // Use new prerequisites if provided, otherwise keep existing ones
    const prerequisites =
      data.prerequisites ?? currentMovie.prerequisites ?? [];

    // Check for circular dependency
    const hasCycle = hasCircularDependency(
      existingMovies,
      currentMovie._id,
      prerequisites,
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

    // Prepare updated movie
    const updatedMovie = {
      title,
      releaseDate: data.releaseDate ?? currentMovie.releaseDate,
      runtime:
        data.runtime !== undefined
          ? Number(data.runtime)
          : currentMovie.runtime,
      prerequisites,
      watched: data.watched ?? currentMovie.watched,
    };

    await movies.updateOne({ _id: currentMovie._id }, { $set: updatedMovie });

    return Response.json(
      {
        message: "Movie updated successfully",
        movie: {
          _id: currentMovie._id.toString(),
          ...updatedMovie,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to update movie" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ message: "Invalid movie ID" }, { status: 400 });
    }

    const db = await connectDB();
    const movies = db.collection("movies");

    const result = await movies.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return Response.json({ message: "Movie not found" }, { status: 404 });
    }

    // Remove this movie from other movies' prerequisites
    await movies.updateMany(
      { prerequisites: id },
      { $pull: { prerequisites: id } },
    );

    return Response.json(
      { message: "Movie deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to delete movie" },
      { status: 500 },
    );
  }
}
