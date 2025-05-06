import React from 'react'

const InfoPage = ({ movie }) => {
  return (
    <main className='bg-[#0f0d23] flex h-dvh justify-center items-center'>
        <div className='size-[90%] p-5 border-blue-700 border-2 text-white shadow-[#847cac] rounded-lg shadow-2xl'>
            <div>info of {movie.title}</div>
        </div>
    </main>
  )
}

export default InfoPage