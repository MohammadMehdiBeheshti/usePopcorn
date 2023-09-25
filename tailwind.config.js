/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		fontFamily: {
			bold: "bold",
			medium: "medium",
		},
	},
	// eslint-disable-next-line no-undef
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["light", "dark"],
		darkTheme: "dark",
		base: true,
		styled: true,
	},
};
