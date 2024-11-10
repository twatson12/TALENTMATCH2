import React, { useState } from 'react';
import './Search.css'; // Optional: Include styles for the search component

const Search = ({ data, onSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        // Filter the data based on the search term
        const filteredResults = data.filter((item) =>
            item.Title.toLowerCase().includes(term.toLowerCase()) // Adjust this to your data's structure
        );

        // Pass the filtered results back to the parent component
        onSearchResults(filteredResults);
    };

    return (
        <div className="search-container">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search opportunities..." // Adjust placeholder as needed
                className="search-input"
            />
        </div>
    );
};

export default Search;
