import PopularMoviesResponse from "@/app/models/response/popularmovies";

export async function getPopularMovies(page: number): Promise<PopularMoviesResponse> {
    const apiKey = '866551ac881e21b681483ed31aa88dfe'; // TODO: Store in config
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`;
  
    try {
        const response = await fetch(url);
        if (!response.ok) {            
            console.error('Error:', response.status);
            // TODO: implement error handling
        }

        const data = await response.json();
        return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}