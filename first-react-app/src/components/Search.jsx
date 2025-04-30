import React from 'react'

// props should never be changed by the child component
// always use the setter function
const search = ({searchTerm, setSearchTerm}) => {

    return (
        <div className='search '>
            <div>
                <img src="search.svg" alt="search" />
                <input 
                className='border border-gray-300 transition-all focus:border-indigo-500 focus:text-indigo-300 rounded shadow-sm'
                type="text" 
                placeholder='Search through thousands of movies online'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
        </div>
    )
}

export default search