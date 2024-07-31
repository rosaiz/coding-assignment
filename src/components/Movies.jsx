import Movie from './Movie'
import '../styles/movies.scss'

const Movies = ({ movies, viewTrailer, loadMoreRef  }) => {

    return (
        <div data-testid="movies">
            {movies?.map((movie) => {
                return (
                    <Movie 
                        movie={movie} 
                        key={movie.id}
                        viewTrailer={viewTrailer}
                    />
                )
            })}
            <div ref={loadMoreRef} Style={'padding:20px'} ></div>
        </div>
    )
}

export default Movies
