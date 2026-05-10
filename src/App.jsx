import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home";
import LevelSelect from "./components/LevelSelect";
import GameScreen from "./components/GameScreen";
import RewardScreen from "./components/RewardScreen";
import Collection from "./components/Collection";
import ProgressProfile from "./components/ProgressProfile";
import Settings from "./components/Settings";
import Characters from "./components/Characters";
import { PageShell } from "./components/Layout";
import { useProgress } from "./hooks/useProgress";

export default function App() {
  const progressApi = useProgress();
  const { progress, updateSettings } = progressApi;
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <PageShell progress={progress} updateSettings={updateSettings} hideNav={isHome} hideTopBar={isHome}>
      <Routes>
        <Route path="/" element={<Home progress={progress} />} />
        <Route path="/niveles" element={<LevelSelect progress={progress} />} />
        <Route
          path="/juego/:levelId"
          element={
            <GameScreen
              progress={progress}
              completeGame={progressApi.completeGame}
              completeLevel={progressApi.completeLevel}
            />
          }
        />
        <Route path="/recompensa/:levelId" element={<RewardScreen progress={progress} />} />
        <Route
          path="/coleccion"
          element={<Collection progress={progress} completedRewards={progressApi.completedRewards} />}
        />
        <Route path="/progreso" element={<ProgressProfile progress={progress} />} />
        <Route
          path="/personajes"
          element={<Characters unlockedCharacters={progressApi.unlockedCharacters} progress={progress} />}
        />
        <Route
          path="/ajustes"
          element={
            <Settings
              progress={progress}
              updateSettings={updateSettings}
              resetProgress={progressApi.resetProgress}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageShell>
  );
}
