/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Exercise 02: Movie Library
 * We are trying to make a movie library for internal users. We are facing some issues by creating this, try to help us following the next steps:
 * !IMPORTANT: Make sure to run yarn movie-api for this exercise
 * 1. We have an issue fetching the list of movies, check why and fix it (handleMovieFetch)
 * 2. Create a filter by fetching the list of gender (http://localhost:3001/genres) and then loading
 * list of movies that belong to that gender (Filter all movies).
 * 3. Order the movies by year and implement a button that switch between ascending and descending order for the list
 * 4. Try to recreate the user interface that comes with the exercise (exercise02.png)
 * 
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import "./assets/styles.css";
import { useEffect, useState, useMemo } from "react";
import imgMovieNotAvailable from './assets/movieNotAvailable.jpg'

export default function Exercise02() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [fetchCount, setFetchCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [ascendingOrder, setAscendingOrder] = useState(true)

  const orderedMovies = useMemo(() => {
    let filteredMovies = movies
    if (selectedGenre !== '') {
      filteredMovies = movies.filter(movie => movie.genres.includes(selectedGenre))
    }
    return filteredMovies.slice().sort((a, b) => {
      const order = ascendingOrder ? 1 : -1
      return order * (a.year - b.year)
    })
  }, [movies, ascendingOrder, selectedGenre])

  const handleMovieFetch = () => {
    setLoading(true)
    setFetchCount(fetchCount + 1)
    console.log('Getting movies')
    let url = 'http://localhost:3001/movies?_limit=50'
    if (selectedGenre !== '') {
      url += `&genres=${selectedGenre}`
    }
    fetch(url)
      .then(res => res.json())
      .then(json => {
        setMovies(json)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value)
    setLoading(true)
    setFetchCount(fetchCount + 1)
    console.log('Getting movies')
    let url = 'http://localhost:3001/movies?_limit=50'
    if (event.target.value !== '') {
      url += `&genres_like=${event.target.value}`
    }
    fetch(url)
      .then(res => res.json())
      .then(json => {
        setMovies(json)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const handleOrderChange = () => {
    setAscendingOrder(!ascendingOrder)
  }

  useEffect(() => {
    handleMovieFetch()
  }, [])

  useEffect(() => {
    fetch('http://localhost:3001/genres')
      .then(res => res.json())
      .then(json => setGenres(json))
  }, [])

  return (
    <section className="movie-library">
      <h1 className="movie-library__title">
        Movie Library
      </h1>
      <div className="movie-library__actions">
        <select name="genre" onChange={handleGenreChange} value={selectedGenre}>
          <option value="">All genres</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        <button onClick={handleOrderChange}>
          {ascendingOrder ? 'Year Descending' : 'Year Ascending'}
        </button>
      </div>
      {loading ? (
        <div className="movie-library__loading">
          <p>Loading...</p>
          <p>Fetched {fetchCount} times</p>
        </div>
      ) : (
        <ul className="movie-library__list">
          {orderedMovies.map(movie => (
            <li key={movie.id} className="movie-library__card">
              <li>{movie.title}</li>
              <li>{movie.genres.join(', ')}</li>
              <li>{movie.year}</li>
              <img src={movie.posterUrl} alt={movie.title}  onError={(e) => {e.target.onerror = null; e.target.src=imgMovieNotAvailable;}} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}