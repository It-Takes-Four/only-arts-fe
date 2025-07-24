import { RegisterPage } from "app/pages/register";

export function meta() {
  return [
    { title: "OnlyArts - Register" },
    { name: "description", content: "Create your OnlyArts account" },
  ];
}

export default function Register() {
  return <RegisterPage />;
}
