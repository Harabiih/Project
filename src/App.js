import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import './App.css';
import SearchIcon from './search.svg';

const API_URL = 'http://www.omdbapi.com?apikey=99f65279';
const defaultSearchTerm = 'Avengers'; // Initial movie set
const moviesPerPage = 10; // Number of movies to load per page

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreMovies, setHasMoreMovies] = useState(true); // Track if more movies are available

  // Fetch movies with pagination (lazy loading)
  const fetchMovies = async (title, page) => {
    setLoading(true);
    const response = await fetch(`${API_URL}&s=${title}&page=${page}`);
    const data = await response.json();

    if (data.Search) {
      setMovies((prevMovies) => [...prevMovies, ...data.Search]); // Append new movies to the list
      if (data.Search.length < moviesPerPage) {
        setHasMoreMovies(false); // If fewer movies are returned, no more movies to load
      }
    } else {
      setHasMoreMovies(false); // No more movies to load
    }

    setLoading(false);
  };

  // Load default movies on the homepage
  useEffect(() => {
    fetchMovies(defaultSearchTerm, page);
  }, [page]); // Fetch movies when page number changes

  // Infinite scrolling: load more movies as the user scrolls down
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;

    if (hasMoreMovies) {
      setPage((prevPage) => prevPage + 1); // Load next page
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMoreMovies]);

  return (
    <div className='app'>
      <h1>My Movie World</h1>

      <div className="search">
        <input
          placeholder="Search Movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => {
            setMovies([]); // Clear current movies before search
            setPage(1); // Reset page to 1 for new search
            fetchMovies(searchTerm, 1); // Search from the first page
          }}
        />
      </div>

      {/* Movie container */}
      {movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        <div className='empty'>
          <h2>No movies found</h2>
        </div>
      )}

      {/* Loading state */}
      {loading && <div>Loading more movies...</div>}
    </div>
  );
};

export default App;
