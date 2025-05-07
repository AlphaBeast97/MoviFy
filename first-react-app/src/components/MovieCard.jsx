import React from 'react'

// yes i did something
export function GenreLookupTable(genre_ids) {
    const genreDataById = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western',
    };
    
    const genre = genreDataById[genre_ids] ? genreDataById[genre_ids] : 'N/A'
    return genre
}

const MovieCard = ({ setToHomePage ,setSelectedMovie, setIsCardSelected, movie }) => {

    const selectedMovie = (movie) => {
        setToHomePage(false)
        setIsCardSelected(true)
        setSelectedMovie(movie)
    }

    const firstGenreId = movie.genre_ids && movie.genre_ids.length > 0 ? movie.genre_ids[0] : null;
    const genreName = GenreLookupTable(firstGenreId);

  return (
    <div onClick={() => selectedMovie(movie)} className='cursor-pointer movie-card group'>
        <img className='rounded-lg duration-250 transition-all group-hover:scale-105 group-hover:shadow-blue-800 shadow-2xl group-hover:border-1 group-hover:border-blue-200 active:scale-100 active:shadow-md ' src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : './No-Poster.png'} alt={movie.title} />
        <div className='mt-4'>
            <h3>{movie.title}</h3>

            <div className='content'>
                <div className="rating">
                    <img src="./Rating.svg" alt="Star-icon" />
                    <p>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
                </div>

                <span>•</span>
                <p className="lang">{movie.original_language}</p>
                <span>•</span>
                <p className="year">{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</p>
                <span>•</span>
                <p className="year">{genreName}</p>
            </div>
        </div>
    </div>
  )
}

export default MovieCard