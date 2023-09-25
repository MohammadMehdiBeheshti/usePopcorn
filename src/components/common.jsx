import { useState, useEffect } from "react";

// Component Categories
//! #Presentational Components:
// Logo
export function Logo() {
	return (
		<h2 className="text-[2.5rem] font-bold">
			<span className="text-5xl">🍿</span> usePopcorn
		</h2>
	);
}

// Numeral Results
export function NumResult({ movies = "X" }) {
	return (
		<span className="block">
			Found <b>{movies}</b> results
		</span>
	);
}

// Movie Box
export function MovieBox({ img, name, year, x, onClick, onX }) {
	return (
		<li
			className="p-[2rem] flex justify-between items-center rounded-xl cursor-pointer hover:bg-neutral-focus"
			onClick={onClick}
		>
			<div className="flex items-center">
				<img
					src={img}
					alt="Movie"
					loading="lazy"
					className="w-[6rem] rounded-xl"
				/>
				<section className="ml-[2rem]">
					<h4 className="font-bold text-[1.8rem]">{name}</h4>
					<p className="mt-[0.5rem]">📅{year}</p>
				</section>
			</div>
			{x && <span onClick={onX}>❌</span>}
		</li>
	);
}

// Watched Movies Stats
export function WatchedMoviesStat({ watchedMovies }) {
	if (!watchedMovies.length) return;
	const numOfWatchedMovies = watchedMovies.length;
	const avgScore =
		watchedMovies
			.map((each) =>
				parseInt(each.imdbRating) ? parseInt(each.imdbRating) : 0
			)
			.reduce((acc, curr) => acc + curr) / numOfWatchedMovies;
	const avgDuration =
		watchedMovies
			.map((each) => (parseInt(each.Runtime) ? parseInt(each.Runtime) : 0))
			.reduce((acc, curr) => acc + curr) / numOfWatchedMovies;

	return (
		<section className="w-full h-[8rem] p-[1rem] rounded-xl bg-[#445069] shadow-xl">
			<h3 className="text-[2rem]">Movies you watched</h3>
			<div className="flex gap-[2rem]">
				<span>#️⃣{numOfWatchedMovies} movies</span>
				<span>⭐{avgScore.toFixed(0)}</span>
				<span>🌟0.0</span>
				<span>⏲️{avgDuration.toFixed(0)}</span>
			</div>
		</section>
	);
}

// Loading Indicator
export function Loading() {
	return <span className="center font-bold">Loading...</span>;
}

// Error Message
export function ErrorMessage({ message }) {
	return <span className="center text-red-600 font-bold">🛑{message}</span>;
}

//? #Stateful Components:
// Visibility Toggle
export function VisToggle({
	active = true,
	right = true,
	bgColor = "#020",
	color = "#ffffff",
	iText = "+",
	oText = "-",
	onClick,
}) {
	return (
		<button
			className={`w-[2rem] h-[2rem] text-center rounded-full z-[3] absolute top-2 ${
				right ? "right-2" : "left-2"
			}`}
			style={{ color, backgroundColor: bgColor }}
			onClick={onClick}
		>
			{active ? iText : oText}
		</button>
	);
}

// Search Input
export function SearchInput({ onInput, value }) {
	return (
		<input
			type="search"
			name="searchBar"
			placeholder="Search movies..."
			className="input w-[30%] text-[1.6rem] input-bordered input-lg bg-base-100"
			value={value}
			onInput={onInput}
		/>
	);
}

//* Structural Components:
// Main
export function Main({ children }) {
	return (
		<main className="flex justify-center gap-[2rem] mt-[2rem]">{children}</main>
	);
}

// Navbar
export function Navbar({ children }) {
	return (
		<header>
			<nav className="navbar px-[2rem] py-[1.2rem] rounded-xl justify-between bg-primary">
				{children}
			</nav>
		</header>
	);
}

// Box
export function Box({ children }) {
	const [visibility, setVisibility] = useState(true);

	return (
		<aside className="w-[35rem] h-[59rem] rounded-xl bg-neutral relative overflow-y-scroll">
			{visibility && <ul>{children}</ul>}
			<VisToggle active={visibility} onClick={() => setVisibility((v) => !v)} />
		</aside>
	);
}

// MovieBox Info
export function MovieInfo({ movie, onClose, callBackFnc }) {
	const {
		Poster,
		Title,
		Released,
		Runtime,
		Genre,
		imdbRating,
		Plot,
		Actors,
		Director,
	} = movie;

	useEffect(() => {
		const callBack = (e) => {
			console.log("clicked");

			if (e.key === "Escape") {
				callBackFnc();
				console.log("Escaped");
			}
		};

		document.addEventListener("keydown", callBack);

		return () => {
			document.removeEventListener("keydown", callBack);
		};
	}, [callBackFnc]);

	return (
		<>
			<section className="flex items-center rounded-xl bg-[#445069] overflow-hidden relative">
				<img src={Poster} alt="Movie poster" className="w-[12rem]" />
				<div className="mx-auto">
					<h3 className="text-[2rem] font-bold mb-[1rem]">{Title}</h3>
					<p className="mb-[1rem]">
						{Released} . {Runtime}
					</p>
					<p className="mb-[1rem]">{Genre}</p>
					<p className="mb-[1rem]">⭐ {imdbRating} IMDB rating</p>
				</div>
			</section>

			<section className="flex justify-center my-[2rem]">
				<StarRating maxRatio={10} />
			</section>

			<section className="mx-[2rem] text-[1.2rem] text-gray-300">
				<p className="mb-[2rem]">{Plot}</p>
				<p className="mb-[2rem]">{Actors}</p>
				<p>
					Directed by <b>{Director}</b>
				</p>
			</section>

			<VisToggle
				right={false}
				bgColor="#fefefe"
				color="#000000"
				iText="<"
				onClick={onClose}
			/>
		</>
	);
}

// Star Rating (Separated from above)
const ratingCap = {
	1: "Terrible",
	2: "Not that good",
	3: "Conventional",
	4: "Fine",
	5: "Excellent",
};

export default function StarRating({
	maxRatio = 5,
	color = "#F1C93B",
	size = 24,
	defaultPoint = 0,
	cap = false,
}) {
	const [point, setPoint] = useState(defaultPoint);
	const [hoverPoint, setHoverPoint] = useState(0);

	return (
		<div className="flex items-center">
			{Array.from({ length: maxRatio }, (_, i) => (
				<Star
					key={i + 1}
					color={color}
					size={size}
					fill={(hoverPoint || point) >= i + 1}
					onClick={() => setPoint(i + 1)}
					onMouseEnter={() => setHoverPoint(i + 1)}
					onMouseLeave={() => setHoverPoint(point)}
				/>
			))}
			<span className={`ml-[1rem] block text-[#F1C93B]`}>
				{cap && maxRatio === 5 ? ratingCap[point] : point || null}
			</span>
		</div>
	);
}

function Star({ fill, color, size, onClick, onMouseEnter, onMouseLeave }) {
	return fill ? (
		<svg
			role="button"
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			style={{ fill: color, cursor: "pointer" }}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"></path>
		</svg>
	) : (
		<svg
			role="button"
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			style={{ fill: color, cursor: "pointer" }}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<path d="m6.516 14.323-1.49 6.452a.998.998 0 0 0 1.529 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082a1 1 0 0 0-.59-1.74l-5.701-.454-2.467-5.461a.998.998 0 0 0-1.822 0L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.214 4.107zm2.853-4.326a.998.998 0 0 0 .832-.586L12 5.43l1.799 3.981a.998.998 0 0 0 .832.586l3.972.315-3.271 2.944c-.284.256-.397.65-.293 1.018l1.253 4.385-3.736-2.491a.995.995 0 0 0-1.109 0l-3.904 2.603 1.05-4.546a1 1 0 0 0-.276-.94l-3.038-2.962 4.09-.326z"></path>
		</svg>
	);
}
