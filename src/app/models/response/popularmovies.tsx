import Movie from "../data/movie";

interface PopularMoviesResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  }
  
export default PopularMoviesResponse;