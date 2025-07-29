import { LoginPage } from "app/pages/login";
import { PublicOnlyRoute } from "app/components/core/protected-route";

export function meta() {
  return [
    { title: "OnlyArts - Login" },
    { name: "description", content: "Sign in to your OnlyArts account" },
  ];
}

export default function Login() {
  return (
    <PublicOnlyRoute>
      <LoginPage />
    </PublicOnlyRoute>
  );
}
