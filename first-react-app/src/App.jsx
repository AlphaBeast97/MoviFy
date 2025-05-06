import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'

import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import Footer from './components/Footer.jsx'
import { getTrendingMovies, updateSearchCount } from './appwrite.js'


const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [debounceSearchterm, setDebounceSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [movieList, setMovieList] = useState([]);
  
  const [isgray, setIsGray] = useState(true);
  const [pageNum, setPageNum] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [errorMsgTrending, setErrorMsgTrending] = useState('');

  // debounces the search term to prevent making too many API requests
  // by waiting for the user for stop typing for 500ms
  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '', pageNum) => {
    setIsLoading(true);
    setErrorMsg('');
    
    query || setPageNum(1)

    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${pageNum}`;
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.status_message || 'Failed to fetch movies');
      }

      const data = await response.json();
      if(data.results && data.results.length === 0){
        setErrorMsg('No movies found for your search.');
        setMovieList([]);
        return;
      }
      
      setMovieList(data.results || []);
      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(`Error fetching Movies ${error}`);
      setErrorMsg('Error fetching movies. Please try again later')
    } finally {
      setIsLoading(false);
    }
  }
  
  const loadTrendingMovies = async () => {
    setIsLoadingTrending(true)
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      setErrorMsgTrending(`Error fetching movies. ${error}`)
      console.error(`Error fetching movies. ${error}`)
    } finally {
      setIsLoadingTrending(false)
    }
  }

  useEffect(() => {
    fetchMovies(debounceSearchterm, pageNum);
    pageNum === 1 ? setIsGray(true) : setIsGray(false);
  }, [debounceSearchterm, pageNum]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);


  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img className='max-w-150' src="./hero-img.png" alt="Hero Background" />
            <h1>Find <span className="text-gradient">Movies</span> You'll Love Without the Hassle</h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <h2 className=' lg:text-4xl font-extrabold tracking-wide text-indigo-600 dark:text-indigo-400 sm:text-4xl'>
          Trending <span className="text-gray-900 dark:text-gray-100">Movies</span>
          </h2>
          {isLoadingTrending ? <Spinner /> : 
            trendingMovies.length > 0 ? (
              <section className='trending'>
                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : errorMsgTrending ? (
              <p className='text-red-500'>{errorMsgTrending}</p>
            ) : (
              <p className='text-red-500'>No trending movies were found</p>
            )
          }

          <section className='all-movies'>
            <h2 className=' lg:text-4xl font-extrabold tracking-wide text-indigo-600 dark:text-indigo-400 sm:text-4xl'>
              All <span className="text-gray-900 dark:text-gray-100">Movies</span>
            </h2>
            
            {isLoading ? (
              <Spinner/>
            ) : errorMsg ? (
              <p className='text-red-500'>{errorMsg}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )}
          </section>
          <div className='text-white flex justify-between ml-3 mr-3 mt-10'>
            <button onClick={() => (pageNum === 1 ? null : setPageNum(pageNum - 1))} id='prev' className={`bg-blue-700 cursor-pointer rounded-xl transition-all hover:opacity-80 p-1.5 h-15 w-15 active:scale-92 active:opacity-80  ${isgray ? 'grayscale line-through' : ''}`} > &lt; </button>
            <p className='pt-5 text-violet-300 animate-pulse'>Page: {pageNum}</p>
            <button onClick={() => (setPageNum(pageNum + 1))} id='next' className='bg-blue-700 cursor-pointer rounded-xl transition-all hover:opacity-80 p-1.5 h-15 w-15 active:scale-92 active:opacity-80'> &gt; </button>
          </div>
        </div>
        <Footer/>
      </div>
    </main>
  )
}

export default App