import React from 'react'

// yes i did something
function GenreLookupTable(genre_ids) {
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
    
    const genre = genreDataById[genre_ids] || 'N/A'
    return genre
}

const MovieCard = ({ movie: 
    {title, vote_average, poster_path, release_date, original_language, genre_ids} 
}) => {
  return (
    <div className='cursor-pointer movie-card group'>
        <img className='rounded-lg duration-250 transition-all group-hover:scale-105 group-hover:shadow-blue-800 shadow-2xl group-hover:border-1 group-hover:border-blue-200 active:scale-100 active:shadow-md ' src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : './No-Poster.png'} alt={title} />
        <div className='mt-4'>
            <h3>{title}</h3>

            <div className='content'>
                <div className="rating">
                    <img src="./Rating.svg" alt="Star-icon" />
                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                </div>

                <span>•</span>
                <p className="lang">{original_language}</p>
                <span>•</span>
                <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
                <span>•</span>
                <p className="year">{GenreLookupTable(genre_ids && [0])}</p>
            </div>
        </div>
    </div>
  )
}

export default MovieCard