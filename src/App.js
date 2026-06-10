import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [prompt, setPrompt] = useState("");
const [aiResponse, setAiResponse] = useState("");
const [loading, setLoading] = useState(false);

  useEffect(() => {

    axios
      .get(
        "https://api.themoviedb.org/3/movie/popular?api_key=6664a87813547bbafda6d61e4d81c9b5"
      )
      .then((response) => {
        setMovies(response.data.results);
      });

  }, []);

  const searchMovies = () => {

    axios
      .get(
        `https://api.themoviedb.org/3/search/movie?api_key=6664a87813547bbafda6d61e4d81c9b5&query=${search}`
      )
      .then((response) => {
        setMovies(response.data.results);
      });

  };
  const getRecommendation = async () => {

  try {

    setLoading(true);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `
Recommend 5 movies for: ${prompt}

Rules:
- Do not use numbering
- Do not use *
- Do not use bullet points
- Return one movie per line
- Format exactly:

Movie Name - reason

Example:
Interstellar - Emotional sci-fi story about family and sacrifice.
Arrival - Thoughtful science fiction with strong emotional themes.
`
          

          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    setAiResponse(
      response.data.choices[0].message.content
    );

  } catch (error) {

    console.error(error);
    setAiResponse("Unable to get recommendations.");

  } finally {

    setLoading(false);

  }
};

  return (

    <div>

      <nav className="navbar navbar-dark bg-dark px-3">
        <h2 className="text-white">🎬 CineMind AI</h2>
      </nav>

      <div className="container mt-4">

        <h1 className="mb-4">
          Popular Movies
        </h1>
        <input
  type="text"
  className="form-control search-box"
  placeholder="Search movies..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      searchMovies();
    }
  }}
/>


        <button
          className="btn btn-dark mt-2"
          onClick={searchMovies}
        >
          Search
        </button>

        <div className="mt-4">

          <div className="mt-4">

  <h3>AI Movie Assistant</h3>

  <input
  type="text"
  className="form-control"
  placeholder="Example: emotional sci-fi movies"
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      getRecommendation();
    }
  }}
/>

  <button
    className="btn btn-success mt-2"
    onClick={getRecommendation}
  >
    Ask AI
  </button>

  <div className="card p-3 ai-box mt-3">

    {loading ? (
      <p>Thinking...</p>
    ) : (
      <p>{aiResponse}</p>
    )}

  </div>

</div>
 
     </div>

        <div className="row mt-4">

          {movies.map((movie) => (

            <div className="col-md-3 mb-4" key={movie.id}>

              <div
                className="card h-100 movie-card"
                onClick={() => setSelectedMovie(movie)}
              >

                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  className="card-img-top"
                  alt={movie.title}
                />

                <div className="card-body">

                  <h5>{movie.title}</h5>

                  <p>⭐ {movie.vote_average}</p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {selectedMovie && (

        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >

          <div className="modal-dialog modal-lg">

            <div className="modal-content bg-dark text-white">

              <div className="modal-header">

                <h5 className="modal-title">
                  {selectedMovie.title}
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedMovie(null)}
                ></button>

              </div>

              <div className="modal-body text-center">

                <img
                  src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                  className="img-fluid mb-3"
                  style={{ maxHeight: "500px" }}
                />

                <p>
                  ⭐ {selectedMovie.vote_average}
                </p>

                <p>
                  {selectedMovie.overview}
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default App;