import connectDB from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const cinemas = await db.collection("cinemas").find({}).toArray();

    const formattedCinemas = cinemas.map((cinema) => ({
      ...cinema,
      _id: cinema._id.toString(),
    }));

    return Response.json(formattedCinemas, { status: 200 });
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to fetch cinemas" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { name, bundleSizes } = await request.json();


    if (!name || typeof name !== "string" || !name.trim()) {
      return Response.json(
        { message: "Cinema name is required" },
        { status: 400 },
      );
    }


    if (
      !Array.isArray(bundleSizes) ||
      bundleSizes.length < 1 ||
      bundleSizes.length > 10 ||
      bundleSizes.some(
        (size) => !Number.isInteger(size) || size < 1 || size > 500,
      ) ||
      new Set(bundleSizes).size !== bundleSizes.length
    ) {
      return Response.json(
        {
          message:
            "Bundle sizes must contain 1–10 unique integers between 1 and 500",
        },
        { status: 400 },
      );
    }

    const db = await connectDB();
    const cinemas = db.collection("cinemas");


    const existingCinema = await cinemas.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existingCinema) {
      return Response.json(
        { message: "Cinema name already exists" },
        { status: 409 },
      );
    }

    const newCinema = {
      name: name.trim(),
      bundleSizes,
    };

    const result = await cinemas.insertOne(newCinema);

    return Response.json(
      {
        message: "Cinema created successfully",
        cinema: {
          ...newCinema,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to create cinema" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!ObjectId.isValid(id)) {
      return Response.json(
        { message: "Invalid cinema ID" },
        { status: 400 }
      );
    }

    const db = await connectDB();

    const result = await db.collection("cinemas").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { message: "Cinema not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Cinema deleted successfully" },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { message: "Failed to delete cinema" },
      { status: 500 }
    );
  }
}
