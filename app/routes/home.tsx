import { Welcome } from "../pages/welcome/welcome";

export function meta() {
  return [
    { title: "OnlyArts - Home" },
    { name: "description", content: "Welcome to OnlyArts - Your creative platform" },
  ];
}

export default function Home() {
  return <Welcome />;
}
