import React from 'react'

//  did this all on my own 

const Footer = () => {
  return (
    <footer className='border-t-1 border-blue-900 pb-5 pt-5 flex leading-loose flex-col text-xs items-center justify-center text-white '>
        <p>A Learning Project By <a className='text-blue-200 transition-all hover:underline' href="https://github.com/AlphaBeast97">Muhammad Saad Khan</a>.</p>
        <p>API Provided By <a className='text-blue-200 transition-all hover:underline' href="https://www.themoviedb.org/">The Movie Database</a>.</p>
        <p className='flex'>Technologies: <img className='transition-all hover:w-6.5 mr-1.5 w-5' src="./html.svg" alt="HTML 5" /> <img className='transition-all hover:w-6.5 mr-1.5 w-5 grayscale-50' src="./tailwind.svg" alt="Tailwind CSS" /> <img src="./react.svg" alt="React" className="transition-all hover:w-6.5 mr-1.5 w-5" /> <img src="./true.svg" alt="AppWrite" className="transition-all hover:w-6.5 mr-1.5 w-5 grayscale-50" /> <img src="./netlify.svg" alt="" className="transition-all hover:w-6.5 mr-1.5 w-5 grayscale-50" /></p>
    </footer>
  )
}

export default Footer