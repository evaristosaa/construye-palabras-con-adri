import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home";
import LevelSelect from "./components/LevelSelect";
import GameScreen from "./components/GameScreen";
import RewardScreen from "./components/RewardScreen";
import Achievements from "./components/Achievements";
import Settings from "./components/Settings";
import PrimaryHub from "./components/PrimaryHub";
import PrimaryGame, { PrimaryAdventure } from "./components/PrimaryGame";
import StoryStudio from "./components/StoryStudio";
import MathWorkshop from "./components/MathWorkshop";
import SubjectWorkshop from "./components/SubjectWorkshop";
import SnackAdventure from "./components/SnackAdventure";
import { PageShell } from "./components/Layout";
import { useProgress } from "./hooks/useProgress";

export default function App() {
  const progressApi = useProgress();
  const { progress, updateSettings } = progressApi;
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isPrimaryGame = location.pathname.startsWith("/primaria/mision/") || location.pathname.startsWith("/primaria/taller/") || ["/primaria/aventura", "/primaria/crea", "/primaria/mates", "/primaria/merienda"].includes(location.pathname);
  const isPrimaryHub = location.pathname === "/primaria";
  const isCompactPage = ["/logros", "/ajustes"].includes(location.pathname);

  return (
    <PageShell progress={progress} updateSettings={updateSettings} hideNav={isHome || isPrimaryGame} hideTopBar={isHome || isPrimaryGame} screenLayout={isPrimaryGame || isPrimaryHub || isCompactPage} primaryLayout={isHome || location.pathname.startsWith("/primaria") || isCompactPage}>
      <Routes>
        <Route path="/" element={<Home progress={progress} />} />
        <Route path="/primaria" element={<PrimaryHub progress={progress} />} />
        <Route path="/primaria/merienda" element={<SnackAdventure progress={progress} completeGame={progressApi.completeGame} attemptPrimaryActivity={progressApi.attemptPrimaryActivity} saveSnackSession={progressApi.saveSnackSession}/>} />
        <Route path="/primaria/crea" element={<StoryStudio progress={progress}/>} />
        <Route path="/primaria/taller/:subjectId" element={<SubjectWorkshop progress={progress} completeGame={progressApi.completeGame} attemptPrimaryActivity={progressApi.attemptPrimaryActivity}/>} />
        <Route path="/primaria/mates" element={<MathWorkshop progress={progress} completeGame={progressApi.completeGame} attemptPrimaryActivity={progressApi.attemptPrimaryActivity}/>} />
        <Route path="/primaria/aventura" element={<PrimaryAdventure progress={progress} completeGame={progressApi.completeGame} attemptPrimaryActivity={progressApi.attemptPrimaryActivity} />} />
        <Route path="/primaria/mision/:missionId" element={<PrimaryGame progress={progress} completeGame={progressApi.completeGame} completePrimaryMission={progressApi.completePrimaryMission} attemptPrimaryActivity={progressApi.attemptPrimaryActivity} />} />
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
        <Route path="/logros" element={<Achievements progress={progress}/>} />
        <Route path="/coleccion" element={<Navigate to="/logros" replace/>}/>
        <Route path="/progreso" element={<Navigate to="/logros" replace/>}/>
        <Route
          path="/ajustes"
          element={
            <Settings
              progress={progress}
              updateSettings={updateSettings}
              resetProgress={progressApi.resetProgress}
              restoreProgress={progressApi.restoreProgress}
              storageIssue={progressApi.storageIssue}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageShell>
  );
}
