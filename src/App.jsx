import { useState, useEffect } from "react";
import {
	WatchedMoviesStat,
	ErrorMessage,
	SearchInput,
	MovieInfo,
	NumResult,
	MovieBox,
	Loading,
	Navbar,
	Logo,
	Main,
	Box,
} from "./components/common";

// Just getting started to learn useEffect.

export default function App() {
	const [movies, setMovies] = useState([]);
	const [watchedMovies, setWatchedMovies] = useState([]);
	const [selectedMovie, setSelectedMovie] = useState({});
	const [movieID, setMovieID] = useState("");
	const [query, setQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const controller = new AbortController();

		const fetchMovies = async () => {
			try {
				if (query.length < 3) return;
				setIsLoading(true);
				setError("");
				const response = await fetch(
					`http://www.omdbapi.com/?apikey=281f7cdf&s=${query ? query : ""}`,
					{ signal: controller.signal }
				);
				if (!response.ok) throw new Error("Movie not found");
				const data = await response.json();
				if (data.Response === "False") throw new Error("Movie not found");
				setMovies(data.Search);
				setError("");
			} catch (err) {
				if (err.name !== "AbortError") setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};
		fetchMovies();

		return () => controller.abort();
	}, [query]);

	useEffect(() => {
		const searchMovieByID = async () => {
			try {
				const response = await fetch(
					`http://www.omdbapi.com/?apikey=281f7cdf&i=${movieID}`
				);
				const data = await response.json();
				if (data.Response === "False") throw new Error("ID not found");
				setSelectedMovie(data);
			} catch (err) {
				console.error(err.message);
			}
		};
		movieID && searchMovieByID();
	}, [movieID]);

	useEffect(() => {
		const title = selectedMovie.Title
			? `Movie: ${selectedMovie.Title}`
			: "usePopcorn";
		document.title = title;
	}, [selectedMovie]);

	const handleCloseButton = () => {
		setMovieID("");
		setWatchedMovies((m) => [...m, selectedMovie]);
		setSelectedMovie({});
	};

	return (
		<>
			<Navbar>
				<Logo />
				<SearchInput
					onInput={(e) => setQuery(e.currentTarget.value)}
					value={query}
				/>
				<NumResult movies={movies.length} />
			</Navbar>

			<Main>
				<Box>
					{!error &&
						!isLoading &&
						movies.length !== 0 &&
						movies.map((each, i) => (
							<MovieBox
								img={each.Poster}
								name={each.Title}
								year={each.Year}
								key={i + 1}
								onClick={() => setMovieID(each.imdbID)}
							/>
						))}
					{error && !isLoading && <ErrorMessage message={error} />}
					{isLoading && <Loading />}
				</Box>

				<Box>
					{!movieID && <WatchedMoviesStat watchedMovies={watchedMovies} />}
					{!movieID &&
						watchedMovies.length !== 0 &&
						watchedMovies.map((each, i) => (
							<MovieBox
								img={each.Poster}
								name={each.Title}
								year={each.Year}
								x={true}
								onX={() => {
									setWatchedMovies((m) =>
										[...m].filter((movie) => movie.imdbID !== each.imdbID)
									);
								}}
								key={i + 1}
							/>
						))}
					{movieID && (
						<MovieInfo
							movie={selectedMovie}
							onClose={handleCloseButton}
							callBackFnc={handleCloseButton}
						/>
					)}
				</Box>
			</Main>
		</>
	);
}
