import { HomePage } from "../pages/home";

export function meta() {
  return [
    { title: "OnlyArts - Home" },
    { name: "description", content: "Welcome to OnlyArts - Your creative platform" },
  ];
}

export default function Home() {
  return <HomePage />;
}
