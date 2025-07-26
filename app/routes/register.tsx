import { RegisterPage } from "app/pages/register";
import { PublicOnlyRoute } from "app/components/core/protected-route";

export function meta() {
  return [
    { title: "OnlyArts - Register" },
    { name: "description", content: "Create your OnlyArts account" },
  ];
}

export default function Register() {
  return (
    <PublicOnlyRoute>
      <RegisterPage />
    </PublicOnlyRoute>
  );
}
