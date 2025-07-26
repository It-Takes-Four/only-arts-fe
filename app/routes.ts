import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route("/login", "routes/login.tsx"),
    route("/register", "routes/register.tsx"),
    route("/dev-test", "routes/dev-test.tsx"),
    layout("layouts/layout.tsx", [
        index("routes/home.tsx"),
        route("/profile", "routes/profile.tsx"),
        route("/settings", "routes/settings.tsx"),
        route("/become-artist", "routes/become-artist.tsx"),
    ]),
] satisfies RouteConfig;
