import { LandingPage } from "app/pages/landing";

export function meta() {
  return [
    { title: "OnlyArts - Where Artists Create Magic" },
    { name: "description", content: "Join a vibrant community of digital artists. Showcase your creativity, connect with art lovers, and turn your passion into success." },
  ];
}

export default function Landing() {
  return <LandingPage />;
}
