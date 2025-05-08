import React, { useEffect, useState } from "react";
import { GenreLookupTable } from "../components/MovieCard.jsx";
import Spinner from "../components/Spinner";

const InfoPage = ({
  setToHomePage,
  API_BASE_URL,
  API_KEY,
  API_OPTIONS,
  movie,
}) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovieDetailsAndTrailer = async (movieId) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch basic movie details
      const detailsEndpoint = `${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
      const detailsResponse = await fetch(detailsEndpoint, API_OPTIONS);
      if (!detailsResponse.ok) {
        const errorData = await detailsResponse.json();
        throw new Error(
          errorData.status_message || "Failed to fetch movie details"
        );
      }
      const detailsData = await detailsResponse.json();
      setMovieDetails(detailsData);

      // Fetch movie videos (including trailers)
      const videosEndpoint = `${API_BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;
      const videosResponse = await fetch(videosEndpoint, API_OPTIONS);
      if (!videosResponse.ok) {
        console.error(
          "Failed to fetch movie videos:",
          await videosResponse.json()
        );
        return; // Don't block the whole page if videos fail
      }
      const videosData = await videosResponse.json();
      const trailer = videosData.results.find(
        (video) => video.site === "YouTube" && video.type === "Trailer"
      );
      if (trailer) {
        setTrailerKey(trailer.key);
      }
    } catch (error) {
      console.error("Error fetching movie data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (movie && movie.id) {
      fetchMovieDetailsAndTrailer(movie.id);
    }
  }, [API_BASE_URL, API_KEY, API_OPTIONS, movie]);

  if (isLoading) {
    return (
      <div className="min-h-dvh min-w-dvw flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  if (!movieDetails) {
    return (
      <p className="text-white text-center">No movie details available.</p>
    );
  }

  const genresToDisplay =
    movie.genre_ids && movie.genre_ids.length > 0
      ? movie.genre_ids.map((id) => GenreLookupTable(id))
      : []; // Return an empty array if no genres

  const productionCompanies = movieDetails.production_companies
    ? movieDetails.production_companies
        .map((company) => company.name)
        .join(" • ") // Using a bullet point for separation
    : "N/A";

  const productionCountries = movieDetails.production_countries
    ? movieDetails.production_countries
        .map((country) => country.name)
        .join(" • ") // Using a bullet point for separation
    : "N/A";

  const spokenLanguages = movieDetails.spoken_languages
    ? movieDetails.spoken_languages.map((lang) => lang.english_name).join(" • ") // Using a bullet point for separation
    : "N/A";

  return (
    <main className="bg-[#0f0d23] min-h-dvh pt-15 pb-15 flex justify-center items-center">
      <div className="size-[90%] pl-8 pr-8 pt-10 pb-10 border-blue-700 border-2 text-white shadow-[#847cac] rounded-lg shadow-2xl">
        {/* upper body */}
        <div className="flex flex-wrap text-[50%] md:text-[100%] lg:text-[100%] items-center justify-between">
          <h2>{movieDetails.title}</h2>
          <div className="flex flex-wrap justify-center gap-5">
            <p className="rounded bg-[#221f3d] flex items-center pl-9 pr-9 pt-2 pb-2">
              <img src="./Rating.svg" alt="Star-icon" />{" "}
              {movieDetails.vote_average
                ? movieDetails.vote_average.toFixed(1)
                : "N/A"}{" "}
              <span className="text-[#a8b5db]">
                /10 ({movieDetails.vote_count ? movieDetails.vote_count : "N/A"}
                )
              </span>
            </p>
            <p className="rounded bg-[#221f3d] flex items-center pl-6 pr-6 text-[#a8b5db] gap-2">
              <img src="./stock-up.png" alt="Stock Up" />{" "}
              {movieDetails.popularity ? movieDetails.popularity : "N/A"}{" "}
            </p>
          </div>
        </div>

        <div className="text-[50%] md:text-[100%] lg:text-[100%] mt-2 mb-4 flex gap-2">
          <p className="text-[#a8b5db]">
            {movieDetails.release_date
              ? movieDetails.release_date.split("-")[0]
              : "N/A"}
          </p>
          <span>•</span>
          <p className="text-[#a8b5db]">
            {movieDetails.runtime ? `${movieDetails.runtime} min` : "N/A"}
          </p>
        </div>

        {/* poster and trailer */}
        <div className="flex flex-wrap items-center justify-around">
          <div className="">
            <img
              className="rounded-lg "
              src={
                movieDetails.poster_path
                  ? `https://image.tmdb.org/t/p/w300/${movieDetails.poster_path}`
                  : "./No-Poster.png"
              }
              alt={movieDetails.title}
            />
          </div>
          <div className="relative w-full mt-5 aspect-video max-w-xl mx-auto overflow-hidden">
            {trailerKey ? (
              <iframe
                className="absolute top-0 left-0 w-full h-full border-0"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <img
                className="w-full h-full object-contain"
                src="./No-video.png"
                alt={movie.title}
              />
            )}
          </div>
        </div>

        {/* other info and back home btn */}
        <div className="mt-5">
          <ul className="">
            <li className="text-[#95a0c4] py-2 flex items-center">
              <span className="w-1/3">Genres</span>
              <div className="flex flex-wrap w-2/3">
                {genresToDisplay.length > 0
                  ? genresToDisplay.map((genre) => (
                      <span
                        key={genre}
                        className="bg-[#221f3d] text-white rounded-md px-3 py-1 mr-2 mb-1 text-sm"
                      >
                        {genre}
                      </span>
                    ))
                  : "N/A"}
              </div>
            </li>
            <li className="text-[#95a0c4] py-2 flex items-center">
              <span className="w-1/3">Overview</span>
              <p className="text-white break-words w-2/3">
                {movieDetails.overview || "N/A"}
              </p>
            </li>
            <li className="text-[#95a0c4] py-2 flex items-center">
              <span className="w-1/3">Release date</span>
              <p className="text-[#d6c7ff] w-2/3">
                {movieDetails.release_date || "N/A"}
              </p>
            </li>
            <li className="text-[#95a0c4] py-2 flex items-center">
              <span className="w-1/3">Countries</span>
              <p className="text-[#d6c7ff] w-2/3">{productionCountries}</p>
            </li>
            <li className="text-[#95a0c4] py-2 flex items-center">
              <span className="w-1/3">Status</span>
              <p className="text-[#d6c7ff] w-2/3">
                {movieDetails.status || "N/A"}
              </p>
            </li>
            <li className="text-[#95a0c4] py-2 flex items-center">
              <span className="w-1/3">Language</span>
              <p className="text-[#d6c7ff] w-2/3">{spokenLanguages}</p>
            </li>
            <li className="text-[#95a0c4] py-2 flex items-center">
              <span className="w-1/3">Budget</span>
              <p className="text-[#d6c7ff] w-2/3">
                {movieDetails.budget
                  ? `$${movieDetails.budget.toLocaleString()}`
                  : "N/A"}
              </p>
            </li>
            <li className="text-[#95a0c4] py-2 flex items-center">
              <span className="w-1/3">Revenue</span>
              <p className="text-[#d6c7ff] w-2/3">
                {movieDetails.revenue
                  ? `$${movieDetails.revenue.toLocaleString()}`
                  : "N/A"}
              </p>
            </li>
            <li className="text-[#95a0c4] py-2 flex items-center">
              <span className="w-1/3">Tagline</span>
              <p className="text-[#d6c7ff] w-2/3">
                {movieDetails.tagline || "N/A"}
              </p>
            </li>
            <li className="text-[#95a0c4] py-2 flex items-center">
              <span className="w-1/3">Production Companies</span>
              <p className="text-[#d6c7ff] w-2/3">{productionCompanies}</p>
            </li>
          </ul>
          <button
            onClick={() => setToHomePage(true)}
            className="cursor-pointer h-10 bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-md px-6 py-1 text-lg font-semibold mt-5 active:shadow-2xl shadow-blue-600 active:scale-95 transition-all"
          >
            Visit Homepage <span className="ml-2 text-xl">→</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default InfoPage;
