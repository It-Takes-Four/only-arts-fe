import DevTestPage from "../pages/dev-test";

export function meta() {
  return [
    { title: "OnlyArts - Dev Test" },
    { name: "description", content: "Development testing page" },
  ];
}

export default function DevTest() {
  return <DevTestPage />;
}
