import { QuizContextProvider } from "@/contexts/useUser.context";
import "./src/shared/style/global.css";

import { Routes } from "@/routes";

export default function App() {
  return (
    <QuizContextProvider>
      <Routes />
    </QuizContextProvider>

  )
}