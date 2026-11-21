
"use client";

import { useEffect, useState } from "react";
import Booking from "@/components/Bookings/Booking";

export default function Page() {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [groupSize, setGroupSize] = useState("");

  const [bookingResult, setBookingResult] = useState(null);
  const [cinemaForm, setCinemaForm] = useState({
    name: "",
    bundleSizes: "",
  });

  const [showCinemaModal, setShowCinemaModal] = useState(false);

  const [loadingCinemas, setLoadingCinemas] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [cinemaLoading, setCinemaLoading] = useState(false);

  const [error, setError] = useState("");


  useEffect(() => {
    async function fetchCinemas() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cinemas`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch cinemas");
        }

        setCinemas(data);

      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoadingCinemas(false);
      }
    }

    fetchCinemas();
  }, []);


  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    setBookingLoading(true);
    setBookingResult(null);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cinemaId: selectedCinemaId,
            groupSize: Number(groupSize),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate booking quote");
      }

      setBookingResult(data);

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setBookingLoading(false);
    }
  };


  const handleCinemaSubmit = async (e) => {
    e.preventDefault();

    setCinemaLoading(true);
    setError("");

    try {
      const bundleSizes = cinemaForm.bundleSizes
        .split(",")
        .map((size) => Number(size.trim()));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cinemas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: cinemaForm.name,
            bundleSizes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create cinema");
      }

      setCinemas((prev) => [...prev, data.cinema]);

      setSelectedCinemaId(data.cinema._id);
      setCinemaForm({
        name: "",
        bundleSizes: "",
      });

      setShowCinemaModal(false);
      setBookingResult(null);

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setCinemaLoading(false);
    }
  };


  const handleCinemaChange = (id) => {
    setSelectedCinemaId(id);
    setBookingResult(null);
    setError("");
  };


  const handleOpenCinemaModal = () => {
    setCinemaForm({
      name: "",
      bundleSizes: "",
    });

    setError("");
    setShowCinemaModal(true);
  };

  return (
    <>
      {loadingCinemas ? (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-text-secondary">Loading cinemas...</p>
        </div>
      ) : (
        <Booking
          cinemas={cinemas}
          selectedCinemaId={selectedCinemaId}
          onCinemaChange={handleCinemaChange}
          groupSize={groupSize}
          onGroupSizeChange={setGroupSize}
          onBookingSubmit={handleBookingSubmit}
          bookingResult={bookingResult}
          bookingLoading={bookingLoading}
          cinemaForm={cinemaForm}
          onCinemaFormChange={setCinemaForm}
          onCinemaSubmit={handleCinemaSubmit}
          cinemaLoading={cinemaLoading}
          showCinemaModal={showCinemaModal}
          onOpenCinemaModal={handleOpenCinemaModal}
          onCloseCinemaModal={() => {
            setShowCinemaModal(false);
            setError("");
          }}
          error={error}
        />
      )}
    </>
  );
}
