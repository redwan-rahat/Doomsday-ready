import connectDB from "@/lib/db";
import { ObjectId } from "mongodb";
import { calculateBooking } from "@/services/booking";

export async function POST(request) {
  try {
    const { cinemaId, groupSize } = await request.json();

    // Validate cinema ID
    if (!ObjectId.isValid(cinemaId)) {
      return Response.json(
        { message: "Invalid cinema ID" },
        { status: 400 }
      );
    }

    // Validate group size
    if (
      !Number.isInteger(groupSize) ||
      groupSize < 1 ||
      groupSize > 10000
    ) {
      return Response.json(
        { message: "Group size must be between 1 and 10,000" },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const cinemas = db.collection("cinemas");

    // Find selected cinema
    const cinema = await cinemas.findOne({
      _id: new ObjectId(cinemaId),
    });

    if (!cinema) {
      return Response.json(
        { message: "Cinema not found" },
        { status: 404 }
      );
    }

    // Calculate minimum bundles
    const result = calculateBooking(
      cinema.bundleSizes,
      groupSize
    );

    if (!result) {
      return Response.json(
        {
          possible: false,
          message: "Not possible to accommodate this group size",
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        possible: true,
        cinemaName: cinema.name,
        groupSize,
        totalBundles: result.totalBundles,
        bundles: result.bundles,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);

    return Response.json(
      { message: "Failed to generate booking quote" },
      { status: 500 }
    );
  }
}
