import { BusinessModelCanvasPage } from "../pages/business-model-canvas";

export function meta() {
  return [
    { title: "OnlyArts - Business Model Canvas" },
    { name: "description", content: "OnlyArts Business Model Canvas - A comprehensive overview of how OnlyArts creates, delivers, and captures value in the Web3 digital art ecosystem." },
  ];
}

export default function BCanvas() {
  return <BusinessModelCanvasPage />;
}

