// src/hooks/useMovies.js
import { useEffect, useState, useCallback, useRef } from 'react';
import { createAsyncThunk } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from 'react-redux';
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER, ENDPOINT, API_KEY } from '../constants'
import { createSearchParams, useNavigate } from 'react-router-dom';
import { setPage } from '../data/moviesSlice';
import { useInView } from 'react-intersection-observer';

export const fetchMovies = createAsyncThunk('fetch-movies', async (apiUrl) => {
  const response = await fetch(apiUrl)
  return response.json()
})

const useMovies = (searchParams, setSearchParams) => {
  const dispatch = useDispatch();
  const { movies, fetchStatus, hasMore, page } = useSelector((state) => state.movies);
  const searchQuery = searchParams.get('search');

  const isInitialMount = useRef(true);
  const navigate = useNavigate();

  const [videoKey, setVideoKey] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const getSearchResults = useCallback(
    (query) => {
      if (query !== '' && query !== undefined && query.length > 2) {
        dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${query}&page=${page}`));
        setSearchParams(createSearchParams({ search: query }));
      } else {
        dispatch(fetchMovies(`${ENDPOINT_DISCOVER}`));
        setSearchParams();
      }
    },
    [dispatch, setSearchParams, page]
  );

  const searchMovies = useCallback((query) => {
    navigate('/');
    getSearchResults(query);
  }, [navigate, getSearchResults]);

  const { ref, inView } = useInView({
    threshold: 0,
  });

   /** Load more movies when end of the page reached */
   const loadMoreMovies = useCallback(
    () => {
         if (fetchStatus !== 'loading' && hasMore ) {
            const nextPage = page + 1;
            const endpoint = searchQuery ? ENDPOINT_SEARCH : ENDPOINT_DISCOVER;
            dispatch(setPage(nextPage));
            dispatch(fetchMovies(`${endpoint}&query=${searchQuery}&page=${nextPage}`));
    }
  }, [dispatch, fetchStatus, hasMore, page, searchQuery]);

  const viewTrailer = async (movie) => {
    const URL = `${ENDPOINT}/movie/${movie.id}?api_key=${API_KEY}&append_to_response=videos`;
    setVideoKey(null);
    const videoData = await fetch(URL).then((response) => response.json());

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find((vid) => vid.type === 'Trailer');
      setVideoKey(trailer ? trailer.key : undefined);
    }
    openModal();
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      getSearchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }
    if (inView && !isInitialMount.current) {
      loadMoreMovies();
    }  
}, [dispatch, getSearchResults,inView, loadMoreMovies]);


  return {
    movies,
    fetchStatus,
    videoKey,
    modalIsOpen,
    openModal,
    closeModal,
    searchMovies,
    loadMoreMovies,
    viewTrailer,
    loadMoreRef: ref,
  };
};

export default useMovies;
