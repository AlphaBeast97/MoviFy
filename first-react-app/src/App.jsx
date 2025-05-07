import React, { useEffect, useState, useRef } from "react";
import { useDebounce } from "react-use";

import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTopButton from "./components/ScrollToTopButton.jsx";
import InfoPage from "./Page/InfoPage.jsx";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [toHomePage, setToHomePage] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearchterm, setDebounceSearchTerm] = useState("");

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [errorMsgTrending, setErrorMsgTrending] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isCardSelected, setIsCardSelected] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [isgray, setIsGray] = useState(true);
  const [pageNum, setPageNum] = useState(1);

  const pageUp = useRef(null);

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "", pageNum) => {
    setIsLoading(true);
    setErrorMsg("");
    if (query !== "") { // Use !== for strict comparison
      setPageNum(1);
    }

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${pageNum}`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.status_message || "Failed to fetch movies");
      }

      const data = await response.json();
      if (data.results && data.results.length === 0) {
        setErrorMsg("No movies found for your search.");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      if (query && data.results && data.results.length > 0) { // Added check for data.results
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(`Error fetching Movies ${error}`);
      setErrorMsg("Error fetching movies. Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    setIsLoadingTrending(true);
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      setErrorMsgTrending(`Error fetching trending movies. ${error}`); // More specific error
      console.error(`Error fetching trending movies. ${error}`);
    } finally {
      setIsLoadingTrending(false);
    }
  };

  const handleTrendingMovieClick = (appwriteMovie) => {
    // Adapt the Appwrite movie object for InfoPage
    // InfoPage likely expects 'id' as the TMDB movie ID
    // and might use other common fields like 'title'.
    // It also gets poster_url directly from Appwrite data.
    const adaptedMovie = {
      ...appwriteMovie, // Spread all properties from Appwrite movie
      id: appwriteMovie.movie_id, // Map appwrite's movie_id to id
      // poster_path: null, // Or handle poster display logic within InfoPage if it expects poster_path
                           // For now, InfoPage can use appwriteMovie.poster_url which is already included
    };
    setSelectedMovie(adaptedMovie);
    setIsCardSelected(true);
    setToHomePage(false); // Ensure we navigate to the InfoPage view
    PageUp(); // Scroll to top when a card is selected
  };

  const prevPage = () => {
    if (pageNum !== 1) { // Use !== for strict comparison
      setPageNum(pageNum - 1);
    }
  };
  const nextPage = () => {
    setPageNum(pageNum + 1);
    PageUp();
  };
  const PageUp = () => {
    pageUp.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMovies(debounceSearchterm, pageNum);
    pageNum === 1 ? setIsGray(true) : setIsGray(false);
  }, [debounceSearchterm, pageNum]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  // When returning to home page from info page, reset card selection
  useEffect(() => {
    if (toHomePage) {
      setIsCardSelected(false);
      setSelectedMovie(null);
      // setToHomePage(false); // Reset toHomePage after handling, or manage this in InfoPage's back navigation
    }
  }, [toHomePage]);


  return (
    <main>
      {isCardSelected && !toHomePage && selectedMovie ? (
        <InfoPage
          setToHomePage={setToHomePage}
          API_BASE_URL={API_BASE_URL}
          API_KEY={API_KEY}
          API_OPTIONS={API_OPTIONS}
          movie={selectedMovie}
        />
      ) : (
        <div className="pattern">
          <div className="wrapper">
            <header ref={pageUp}>
              <img
                className="max-w-150"
                src="./hero-img.png"
                alt="Hero Background"
              />
              <h1>
                Find <span className="text-gradient">Movies</span> You'll Love
                Without the Hassle
              </h1>
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </header>

            <h2 className=" lg:text-4xl font-extrabold tracking-wide text-indigo-600 dark:text-indigo-400 sm:text-4xl">
              Trending{" "}
              <span className="text-gray-900 dark:text-gray-100">Movies</span>
            </h2>
            {isLoadingTrending ? (
              <Spinner />
            ) : trendingMovies.length > 0 ? (
              <section className="trending">
                <ul className="overflow-y-hidden">
                  {trendingMovies.map((movie, index) => (
                    <li
                      onClick={() => handleTrendingMovieClick(movie)} // Updated onClick
                      className="transition-all hover:scale-110 cursor-pointer active:scale-100"
                      key={movie.$id} // Use Appwrite's document ID as key
                    >
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : errorMsgTrending ? (
              <p className="text-red-500">{errorMsgTrending}</p>
            ) : (
              <p className="text-red-500">No trending movies were found</p>
            )}

            <section className="all-movies">
              <h2 className=" lg:text-4xl font-extrabold tracking-wide text-indigo-600 dark:text-indigo-400 sm:text-4xl">
                All{" "}
                <span className="text-gray-900 dark:text-gray-100">Movies</span>
              </h2>

              {isLoading ? (
                <Spinner />
              ) : errorMsg ? (
                <p className="text-red-500">{errorMsg}</p>
              ) : movieList.length > 0 ? ( // Added check for movieList.length > 0
                <ul>
                  {movieList.map((movie) => (
                    <MovieCard
                      setToHomePage={setToHomePage}
                      setSelectedMovie={setSelectedMovie}
                      setIsCardSelected={setIsCardSelected}
                      key={movie.id}
                      movie={movie}
                      onCardClick={PageUp} // Pass PageUp to scroll to top from MovieCard
                    />
                  ))}
                </ul>
              ) : (
                 <p className="text-gray-500">No movies to display currently.</p> // Handle empty movieList
              )}
            </section>
            <div className="text-white flex justify-between ml-3 mr-3 mt-10">
              <button
                onClick={() => prevPage()}
                id="prev"
                className={`bg-blue-700 cursor-pointer rounded-xl transition-all hover:opacity-80 p-1.5 h-15 w-15 active:scale-92 active:opacity-80  ${
                  isgray ? "grayscale line-through" : ""
                }`}
                disabled={isgray} // Disable button if it's grayed out
              >
                {" "}
                &lt;{" "}
              </button>
              <p className="pt-5 text-violet-300 animate-pulse">
                Page: {pageNum}
              </p>
              <button
                onClick={() => nextPage()}
                id="next"
                className="bg-blue-700 cursor-pointer rounded-xl transition-all hover:opacity-80 p-1.5 h-15 w-15 active:scale-92 active:opacity-80"
              >
                {" "}
                &gt;{" "}
              </button>
            </div>
          </div>
          <ScrollToTopButton />
          <Footer />
        </div>
      )}
    </main>
  );
}

export default App;