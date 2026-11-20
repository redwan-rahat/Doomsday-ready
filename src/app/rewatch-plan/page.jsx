
"use client";

import { useEffect, useState } from "react";
import RewatchPlan from "@/components/Rewatch/RewatchPlan";

export default function Page() {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [rewatchOrder, setRewatchOrder] = useState({});
    const [watchedCount, setWatchedCount] = useState(0);

    const [loadingMovies, setLoadingMovies] = useState(true);
    const [loadingRewatch, setLoadingRewatch] = useState(false);
    const [error, setError] = useState("");

    // Fetch all movies
    useEffect(() => {
        async function fetchMovies() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch movies");
                }

                setMovies(data);

                // Select the first movie by default
                if (data.length > 0) {
                    setSelectedMovie(data[0]);
                }
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoadingMovies(false);
            }
        }

        fetchMovies();
    }, []);

    // Fetch rewatch order whenever selected movie changes
    useEffect(() => {
        if (!selectedMovie) {
            setRewatchOrder({});
            setWatchedCount(0);
            return;
        }

        async function fetchRewatchOrder() {
            setLoadingRewatch(true);
            setError("");

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${selectedMovie._id}/rewatch-order`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to generate rewatch order"
                    );
                }

                setRewatchOrder(data.rewatchOrder);
                setWatchedCount(data.watchedCount);
            } catch (error) {
                console.error(error);
                setError(error.message);
                setRewatchOrder({});
            } finally {
                setLoadingRewatch(false);
            }
        }

        fetchRewatchOrder();
    }, [selectedMovie]);

    // Handle movie selection
    const handleSelectMovie = (movie) => {
        setSelectedMovie(movie);
    };

    if (loadingMovies) {
        return (
            <div className="min-h-screen bg-background p-8 flex items-center justify-center">
                <p className="text-text-secondary">Loading movies...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground p-5 md:p-8 lg:p-10">
            <div className="max-w-7xl mx-auto">
                {error && (
                    <div className="bg-red-500/10 text-red-400 rounded-lg p-4 mb-6">
                        {error}
                    </div>
                )}

                <RewatchPlan
                    movies={movies}
                    selectedMovie={selectedMovie}
                    rewatchOrder={rewatchOrder}
                    watchedCount={watchedCount}
                    loading={loadingRewatch}
                    onSelectMovie={handleSelectMovie}
                />
            </div>
        </main>
    );
}
