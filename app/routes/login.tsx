import { LoginPage } from "app/pages/login";

export function meta() {
  return [
    { title: "OnlyArts - Login" },
    { name: "description", content: "Sign in to your OnlyArts account" },
  ];
}

export default function Login() {
  return <LoginPage />;
}
