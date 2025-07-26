import { ArtistRegistrationPage } from "app/pages/artist";

export function meta() {
  return [
    { title: "OnlyArts - Become an Artist" },
    { name: "description", content: "Join OnlyArts as an artist and start sharing your creative work" },
  ];
}

export default function BecomeArtist() {
  return <ArtistRegistrationPage />;
}
