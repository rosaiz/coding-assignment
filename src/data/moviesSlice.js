import { createSlice, createAction } from "@reduxjs/toolkit"
import { fetchMovies } from '../hooks/useMovies';


export const setPage = createAction('movies/setPage');

const moviesSlice = createSlice({
    name: 'movies',
    initialState: { 
        movies: [],
        page: 1,
        hasMore: true,
        fetchStatus: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(fetchMovies.pending, (state) => {
            state.fetchStatus = 'loading';
          })
          .addCase(fetchMovies.fulfilled, (state, action) => {
            const { results, page, total_pages } = action.payload;
            if (!results || results.length === 0) {
              state.movies = [];
              state.page = 1;
              state.hasMore = false;
            } else {
              state.movies = page === 1 ? results : [...state.movies, ...results];
              state.hasMore = page < total_pages;
            }
            state.page = page;
            state.fetchStatus = 'success';
          })
          .addCase(fetchMovies.rejected, (state) => {
            state.fetchStatus = 'error';
          })
          .addCase(setPage, (state, action) => {
            state.page = action.payload;
          });
      }
})

export default moviesSlice
