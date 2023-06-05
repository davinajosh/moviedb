'use client';

import styles from './page.module.css'

import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogTitle } from '@mui/material';

import { getPopularMovies } from './providers/movies/popular'
import Movie from './models/data/movie';

export default function Home() {

  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie>({} as Movie);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPopularMovies = async (page: number) => {
      try {
        setIsLoading(true);
        const moviesData = await getPopularMovies(page);
        setPopularMovies((prevMovies: Movie[]) => [...prevMovies, ...moviesData.results]);
        setIsLoading(false);
      } catch (error) {        
        console.error('Error:', error);
      }
    };

    fetchPopularMovies(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(handleIntersection, {
      rootMargin: '0px',
      threshold: 1.0,
    });

    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }

    return () => {
      if (observer.current && sentinelRef.current) {
        observer.current.unobserve(sentinelRef.current);
      }
    };
  }, [isLoading]);

  const handleDialogOpen = (movie: Movie) => {
    setCurrentMovie(movie);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setCurrentMovie({} as Movie);
    setDialogOpen(false);
  };

  const toggleFavorite = (movie: Movie) => {
    movie.is_favorite = !movie.is_favorite;
    updateMoviesFavorite(movie);
    localStorage.setItem(
      "favoriteMovies", 
      JSON.stringify(popularMovies.filter((m: Movie) => m.is_favorite))
    )
  };

  const updateMoviesFavorite = (movie: Movie) => {
    setPopularMovies((movies) =>
      movies.map((m) => (m.id === movie.id ? { ...m, favorite: movie.is_favorite } : m))
    );
  }

  return (
    <div>
      <div className={styles.moviegrid}>
        {popularMovies.map((movie) => (
          <div
            key={movie.id}
            className={styles.moviecard}
          >
            <img className={styles.moviecardimg} src={`https://themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}`} alt={movie.title} />
            <h3 className={styles.moviecardh3}>{movie.title}</h3>
            <p className={styles.moviecardp}>{movie.release_date}</p>
            <button className="open-details-button" onClick={() => handleDialogOpen(movie)}>
              Details
            </button>
            <button className="favorite-button" onClick={() => toggleFavorite(movie)}>
              {movie.is_favorite ? 'Unfavorite' : 'Favorite'}
            </button>
          </div>
        ))}
      </div>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>{currentMovie.title} details</DialogTitle>
        <h3>Overview</h3>
        <p>{currentMovie.overview}</p>
        <p>Rating: {currentMovie.vote_average}</p>
      </Dialog>
      {isLoading && <p>Loading...</p>}
      <div ref={sentinelRef}></div>
    </div>
  )
}
