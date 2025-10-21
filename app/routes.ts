import {
	index,
	layout,
	route,
	type RouteConfig,
} from "@react-router/dev/routes";

export default [
	route("/landing", "routes/landing.tsx"),
	route("/login", "routes/login.tsx"),
	route("/register", "routes/register.tsx"),
	route("/dev-test", "routes/dev-test.tsx"),
	route("/b-canvas", "routes/b-canvas.tsx"),
	layout("layouts/layout.tsx", [
		index("routes/home.tsx"),
		route("/profile", "routes/profile.tsx"),
		route("/artist/:artistId", "routes/artist.tsx"),
		route("/settings", "routes/settings.tsx"),
		route("/explore", "routes/explore.tsx"),
		route("/search", "routes/search.tsx"),
		route("/purchased-collections", "routes/purchased-collections.tsx"),
		route("/become-artist", "routes/become-artist.tsx"),
		route("/collection/:collectionId", "routes/collection.tsx"),
		route("/artist-studio", "routes/artist-studio.tsx"),
		route("/art/:artworkId", "routes/art.tsx"),
	]),
] satisfies RouteConfig;
