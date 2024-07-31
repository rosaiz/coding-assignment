import { Routes, Route, useSearchParams, useNavigate } from "react-router-dom"
import useMovies from './hooks/useMovies';
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import Modal from './components/Modal'
import YoutubePlayer from './components/YoutubePlayer'
import './app.scss'
import 'reactjs-popup/dist/index.css'

const App = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    movies,
    videoKey,
    modalIsOpen,
    closeModal,
    searchMovies,
    viewTrailer,
    loadMoreRef,
  } = useMovies(searchParams, setSearchParams, navigate);

  return (
    <div className="App">
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />

      <div className="container">

        <div style={{ padding: "30px" }}>
            <h2>Movies library</h2>
        </div>
        {videoKey ? (
          <Modal isOpen={modalIsOpen} onClose={closeModal}>
            <YoutubePlayer videoKey={videoKey} />
          </Modal>
        ):(
          <Modal isOpen={modalIsOpen} onClose={closeModal}>
            <h6>Trailer not available </h6>
          </Modal>
        )}

        <Routes>
          <Route path="/" element={<Movies loadMoreRef={loadMoreRef} movies={movies} viewTrailer={viewTrailer} />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  );
}

export default App
