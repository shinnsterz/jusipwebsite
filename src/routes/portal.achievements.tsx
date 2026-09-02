import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portal/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Crew On Set!" },
      { name: "description", content: "Track your on-set achievements and production milestones." },
      { property: "og:title", content: "Achievements — Crew On Set!" },
      { property: "og:description", content: "Track your on-set achievements and production milestones." },
    ],
  }),
  component: AchievementsPage,
});

import { useMemo, useState } from "react";
import {
  Award,
  Camera,
  CheckCircle2,
  Clapperboard,
  Crown,
  Film,
  Lock,
  Medal,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";

type Achievement = {
  name: string;
  description: string;
  date?: string;
  unlocked: boolean;
  icon: typeof Star;
  progress?: string;
  percent?: number;
  requirement?: string;
};

type Leader = {
  name: string;
  level: number;
  score: number;
  xp: number;
  productions: number;
  rating: number;
  role: string;
  legendary?: boolean;
};

const achievements: Achievement[] = [
  {
    name: "Perfect Take",
    description: "Earn a 100% production rating.",
    date: "Aug 02, 2026",
    unlocked: true,
    icon: Star,
    requirement: "Earn a perfect 100% production rating.",
  },
  {
    name: "Box Office Hit",
    description: "Score over 100,000 in one production.",
    date: "Jul 19, 2026",
    unlocked: true,
    icon: Trophy,
    requirement: "Score more than 100,000 points in a single production.",
  },
  {
    name: "First Day on Set",
    description: "Complete your first production.",
    date: "Mar 14, 2025",
    unlocked: true,
    icon: Clapperboard,
    requirement: "Complete your first production.",
  },
  {
    name: "One More Take",
    description: "Replay a production five times.",
    date: "Jun 04, 2026",
    unlocked: true,
    icon: Camera,
    requirement: "Replay any production five times.",
  },
  {
    name: "Production Veteran",
    description: "Complete 100 productions.",
    progress: "87/100 Productions",
    percent: 87,
    unlocked: false,
    icon: Film,
    requirement: "Complete 100 productions.",
  },
  {
    name: "Department Head",
    description: "Reach Crew Level 50.",
    progress: "27/50 Crew Level",
    percent: 54,
    unlocked: false,
    icon: Award,
    requirement: "Reach Crew Level 50.",
  },
  {
    name: "Legendary Crew",
    description: "Work with ten legendary players.",
    progress: "2/10 Legendary Crew",
    percent: 20,
    unlocked: false,
    icon: Users,
    requirement: "Work with ten legendary crew members.",
  },
  {
    name: "Flawless Reel",
    description: "Earn ten perfect scores.",
    progress: "3/10 Perfect Scores",
    percent: 30,
    unlocked: false,
    icon: Crown,
    requirement: "Earn ten perfect production scores.",
  },
];

const globalLeaders: Leader[] = [
  {
    name: "FRAMEPERFECT",
    level: 42,
    score: 1284920,
    xp: 9820,
    productions: 126,
    rating: 98,
    role: "Director",
    legendary: true,
  },
  {
    name: "BOOMBUDDY",
    level: 39,
    score: 1120480,
    xp: 9140,
    productions: 118,
    rating: 96,
    role: "AV Technician",
  },
  {
    name: "CAMERA_PRO",
    level: 27,
    score: 984250,
    xp: 7020,
    productions: 87,
    rating: 94,
    role: "Cameraman",
  },
  {
    name: "DOLLYDASH",
    level: 31,
    score: 921860,
    xp: 7780,
    productions: 102,
    rating: 93,
    role: "Cameraman",
  },
  {
    name: "LIGHTLEAK",
    level: 29,
    score: 887420,
    xp: 7410,
    productions: 95,
    rating: 92,
    role: "Editor",
  },
];

const roleLeaders: Leader[] = [
  {
    name: "FRAMEPERFECT",
    level: 42,
    score: 1284920,
    xp: 9820,
    productions: 126,
    rating: 98,
    role: "Director",
    legendary: true,
  },
  {
    name: "CAMERA_PRO",
    level: 27,
    score: 984250,
    xp: 7020,
    productions: 87,
    rating: 94,
    role: "Cameraman",
  },
  {
    name: "BOOMBUDDY",
    level: 39,
    score: 1120480,
    xp: 9140,
    productions: 118,
    rating: 96,
    role: "AV Technician",
  },
  {
    name: "LIGHTLEAK",
    level: 29,
    score: 887420,
    xp: 7410,
    productions: 95,
    rating: 92,
    role: "Editor",
  },
];

const friendLeaders: Leader[] = [
  {
    name: "CAMERA_PRO",
    level: 27,
    score: 984250,
    xp: 7020,
    productions: 87,
    rating: 94,
    role: "Cameraman",
  },
  {
    name: "FRAMEPERFECT",
    level: 42,
    score: 1284920,
    xp: 9820,
    productions: 126,
    rating: 98,
    role: "Director",
    legendary: true,
  },
  {
    name: "DOLLYDASH",
    level: 31,
    score: 921860,
    xp: 7780,
    productions: 102,
    rating: 93,
    role: "Cameraman",
  },
];

const formatNumber = (value: number) => value.toLocaleString();

function AchievementsPage() {
  const [filter, setFilter] = useState("All");
  const [achievementSort, setAchievementSort] = useState("Recent");

  const [leaderTab, setLeaderTab] = useState("Global");
  const [leaderSort, setLeaderSort] = useState("Total Score");

  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const [selectedLeader, setSelectedLeader] =
    useState<Leader | null>(null);

  const shownAchievements = useMemo(() => {
    const filtered = achievements.filter((item) => {
      if (filter === "Unlocked") {
        return item.unlocked;
      }

      if (filter === "Locked") {
        return !item.unlocked;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (a.unlocked && b.unlocked) {
        const dateA = new Date(a.date ?? 0).getTime();
        const dateB = new Date(b.date ?? 0).getTime();

        if (achievementSort === "Oldest") {
          return dateA - dateB;
        }

        return dateB - dateA;
      }

      if (a.unlocked && !b.unlocked) {
        return -1;
      }

      if (!a.unlocked && b.unlocked) {
        return 1;
      }

      return 0;
    });
  }, [filter, achievementSort]);

  const currentLeaders = useMemo(() => {
    let data: Leader[];

    if (leaderTab === "Roles") {
      data = roleLeaders;
    } else if (leaderTab === "Friends") {
      data = friendLeaders;
    } else {
      data = globalLeaders;
    }

    return [...data].sort((a, b) => {
      if (leaderSort === "XP") {
        return b.xp - a.xp;
      }

      if (leaderSort === "Productions") {
        return b.productions - a.productions;
      }

      if (leaderSort === "Rating") {
        return b.rating - a.rating;
      }

      return b.score - a.score;
    });
  }, [leaderTab, leaderSort]);

  return (
    <div className="min-h-screen bg-[#0d121c] px-4 pb-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] pt-8 sm:pt-10">

        {/* =========================================================
            PAGE HEADER
        ========================================================= */}

        <header>
          <p className="text-xs font-black tracking-[.18em] text-coral">
            MILESTONES
          </p>

          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
            My Achievements
          </h1>
        </header>

        {/* =========================================================
            ACHIEVEMENTS
        ========================================================= */}

        <section className="mt-7">

          <div className="flex flex-col justify-between gap-4 border-b border-white/[0.07] sm:flex-row sm:items-end">

            <div className="flex gap-6">

              {["All", "Unlocked", "Locked"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`border-b-2 pb-3 text-xs font-black uppercase tracking-[0.1em] transition ${
                    filter === tab
                      ? "border-coral text-white"
                      : "border-transparent text-white/35 hover:text-white/70"
                  }`}
                >
                  {tab}
                </button>
              ))}

            </div>

            <select
              value={achievementSort}
              onChange={(e) =>
                setAchievementSort(e.target.value)
              }
              className="mb-2 rounded-md border border-white/10 bg-[#151c29] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white/70 outline-none transition focus:border-coral"
            >
              <option value="Recent">
                Recent
              </option>

              <option value="Oldest">
                Oldest
              </option>
            </select>

          </div>

          {/* ACHIEVEMENT CARDS */}

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {shownAchievements.map((achievement) => {
              const AchievementIcon = achievement.icon;

              return (
                <button
                  key={achievement.name}
                  type="button"
                  onClick={() =>
                    setSelectedAchievement(achievement)
                  }
                  className={`group rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-1 ${
                    achievement.unlocked
                      ? "border-yellow/20 bg-[#151c29] hover:border-yellow/40 hover:bg-[#182131]"
                      : "border-white/[0.06] bg-[#151c29] opacity-60 hover:opacity-100"
                  }`}
                >

                  <div className="flex items-start gap-4">

                    <div
                      className={`grid size-14 shrink-0 place-items-center rounded-lg ${
                        achievement.unlocked
                          ? "bg-yellow text-[#0d121c] shadow-lg"
                          : "bg-white/[0.06] text-white/25"
                      }`}
                    >
                      <AchievementIcon className="size-7" />
                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <h3 className="font-black uppercase text-white">
                          {achievement.name}
                        </h3>

                        {achievement.unlocked ? (
                          <Medal className="size-4 shrink-0 text-yellow" />
                        ) : (
                          <Lock className="size-3.5 shrink-0 text-white/25" />
                        )}

                      </div>

                      <p className="mt-1 text-sm leading-relaxed text-white/45">
                        {achievement.description}
                      </p>

                    </div>

                  </div>

                  {achievement.unlocked ? (
                    <div className="mt-5 flex items-center justify-between">

                      <p className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                        Unlocked {achievement.date}
                      </p>

                      <CheckCircle2 className="size-4 text-emerald-300" />

                    </div>
                  ) : (
                    <div className="mt-5">

                      <div className="mb-2 flex justify-between text-[10px] font-black uppercase text-white/30">

                        <span>
                          {achievement.progress}
                        </span>

                        <span>
                          {achievement.percent}%
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/10">

                        <div
                          className="h-full rounded-full bg-coral transition-all duration-500"
                          style={{
                            width: `${achievement.percent}%`,
                          }}
                        />

                      </div>

                    </div>
                  )}

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-white/20 transition-colors group-hover:text-coral">
                    View details →
                  </p>

                </button>
              );
            })}

          </div>

          {shownAchievements.length === 0 && (
            <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#151c29] p-10 text-center">

              <Trophy className="mx-auto size-10 text-white/20" />

              <h3 className="mt-4 font-black uppercase text-white">
                No achievements found
              </h3>

              <p className="mt-2 text-sm text-white/35">
                Try switching to another achievement filter.
              </p>

            </div>
          )}

        </section>

        {/* =========================================================
            LEADERBOARDS
        ========================================================= */}

        <section className="mt-12">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <h2 className="text-2xl font-black uppercase text-white">
                Leaderboards
              </h2>

              <div className="mt-3 flex gap-5">

                {["Global", "Roles", "Friends"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setLeaderTab(tab)}
                    className={`border-b-2 pb-2 text-xs font-black uppercase tracking-[0.1em] transition ${
                      leaderTab === tab
                        ? "border-coral text-white"
                        : "border-transparent text-white/35 hover:text-white/70"
                    }`}
                  >
                    {tab}
                  </button>
                ))}

              </div>

            </div>

            <select
              value={leaderSort}
              onChange={(e) =>
                setLeaderSort(e.target.value)
              }
              className="rounded-md border border-white/10 bg-[#151c29] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white/70 outline-none transition focus:border-coral"
            >
              <option value="Total Score">
                Total Score
              </option>

              <option value="XP">
                XP
              </option>

              <option value="Productions">
                Productions
              </option>

              <option value="Rating">
                Rating
              </option>
            </select>

          </div>

          {leaderTab === "Roles" && (
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/35">
              <Target className="size-4" />
              Showing top crew members across their primary roles.
            </div>
          )}

          {leaderTab === "Friends" &&
            currentLeaders.length > 0 && (
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/35">
                <Users className="size-4" />
                Comparing your performance with your friends.
              </div>
            )}

          {/* TABLE */}

          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#151c29]">

            <table className="min-w-[700px] w-full text-left">

              <thead className="border-b border-white/[0.07] bg-white/[0.025]">

                <tr>

                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-white/30">
                    Rank
                  </th>

                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-white/30">
                    Player
                  </th>

                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-white/30">
                    Level
                  </th>

                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-white/30">
                    Role
                  </th>

                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-white/30">
                    Productions
                  </th>

                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-white/30">
                    Rating
                  </th>

                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-wider text-white/30">
                    Score
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentLeaders.map((leader, index) => {

                  const isCurrentPlayer =
                    leader.name === "CAMERA_PRO";

                  return (
                    <tr
                      key={leader.name}
                      onClick={() =>
                        setSelectedLeader(leader)
                      }
                      className={`cursor-pointer border-b border-white/[0.05] transition-colors hover:bg-white/[0.035] ${
                        isCurrentPlayer
                          ? "bg-yellow/[0.05]"
                          : ""
                      }`}
                    >

                      <td className="px-5 py-4">

                        <span
                          className={`grid size-8 place-items-center rounded-md font-black ${
                            index === 0
                              ? "bg-yellow text-[#0d121c]"
                              : "bg-white/[0.06] text-white/60"
                          }`}
                        >
                          {index + 1}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="grid size-9 place-items-center rounded-full bg-coral text-xs font-black text-white">
                            {leader.name.slice(0, 2)}
                          </div>

                          <div>

                            <div className="flex items-center gap-2">

                              <strong className="text-white">
                                {leader.name}
                              </strong>

                              {leader.legendary && (
                                <Crown className="size-3.5 text-yellow" />
                              )}

                              {isCurrentPlayer && (
                                <span className="rounded-full border border-yellow/20 bg-yellow/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-yellow">
                                  You
                                </span>
                              )}

                            </div>

                            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-white/25">
                              {leader.role}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4 text-sm text-white/55">
                        Level {leader.level}
                      </td>

                      <td className="px-5 py-4 text-sm text-white/55">
                        {leader.role}
                      </td>

                      <td className="px-5 py-4 text-sm text-white/55">
                        {leader.productions}
                      </td>

                      <td className="px-5 py-4 text-sm text-white/55">
                        {leader.rating}%
                      </td>

                      <td className="px-5 py-4 font-black text-white">
                        {formatNumber(leader.score)}
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

            {currentLeaders.length === 0 && (
              <div className="p-10 text-center">

                <Users className="mx-auto size-9 text-white/20" />

                <h3 className="mt-3 font-black uppercase text-white">
                  No friends yet
                </h3>

                <p className="mt-1 text-sm text-white/35">
                  Add crew members as friends to compare your
                  leaderboard performance.
                </p>

              </div>
            )}

          </div>

        </section>

        {/* =========================================================
            ACHIEVEMENT MODAL
        ========================================================= */}

        {selectedAchievement && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-[#05080d]/80 p-4 backdrop-blur-md"
            onMouseDown={() =>
              setSelectedAchievement(null)
            }
          >

            <div
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#151c29] p-6 text-white shadow-2xl shadow-black/50"
              onMouseDown={(e) =>
                e.stopPropagation()
              }
            >

              {/* X */}

              <button
                type="button"
                aria-label="Close achievement"
                onClick={() =>
                  setSelectedAchievement(null)
                }
                className="absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-white/[0.06] text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>

              {/* CENTERED ICON */}

              <div className="flex justify-center pt-2">

                <div
                  className={`grid size-16 place-items-center rounded-xl ${
                    selectedAchievement.unlocked
                      ? "bg-yellow text-[#0d121c] shadow-lg"
                      : "bg-white/[0.06] text-white/25"
                  }`}
                >
                  <selectedAchievement.icon className="size-8" />
                </div>

              </div>

              {/* CENTERED TITLE */}

              <div className="mt-5 text-center">

                <div className="flex items-center justify-center gap-2">

                  <h2 className="text-xl font-black uppercase text-white">
                    {selectedAchievement.name}
                  </h2>

                  {selectedAchievement.unlocked && (
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-300" />
                  )}

                </div>

                <p className="mt-2 text-sm leading-relaxed text-white/45">
                  {selectedAchievement.description}
                </p>

              </div>

              {/* REQUIREMENT */}

              <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.035] p-4 text-center">

                <p className="text-[10px] font-black uppercase tracking-wider text-white/30">
                  Requirement
                </p>

                <p className="mt-1 text-sm font-bold text-white/80">
                  {selectedAchievement.requirement}
                </p>

              </div>

              {/* UNLOCKED */}

              {selectedAchievement.unlocked ? (

                <div className="mt-5 flex items-center justify-center gap-2 text-sm font-black text-emerald-300">

                  <Medal className="size-5" />

                  <span>
                    Unlocked on {selectedAchievement.date}
                  </span>

                </div>

              ) : (

                <div className="mt-5">

                  <div className="flex justify-between text-xs font-black uppercase text-white/30">

                    <span>
                      {selectedAchievement.progress}
                    </span>

                    <span>
                      {selectedAchievement.percent}%
                    </span>

                  </div>

                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full rounded-full bg-coral transition-all duration-500"
                      style={{
                        width: `${selectedAchievement.percent}%`,
                      }}
                    />

                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* =========================================================
            PLAYER MODAL
        ========================================================= */}

        {selectedLeader && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-[#05080d]/80 p-4 backdrop-blur-md"
            onMouseDown={() =>
              setSelectedLeader(null)
            }
          >

            <div
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#151c29] p-6 text-white shadow-2xl shadow-black/50"
              onMouseDown={(e) =>
                e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                  <div className="grid size-16 place-items-center rounded-full bg-coral text-lg font-black text-white">
                    {selectedLeader.name.slice(0, 2)}
                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <h2 className="text-xl font-black">
                        {selectedLeader.name}
                      </h2>

                      {selectedLeader.legendary && (
                        <Crown className="size-5 text-yellow" />
                      )}

                    </div>

                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/30">
                      {selectedLeader.role} · Level{" "}
                      {selectedLeader.level}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedLeader(null)
                  }
                  className="grid size-9 place-items-center rounded-full bg-white/[0.06] text-white/40 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="size-5" />
                </button>

              </div>

              {/* STATS */}

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.035] p-4">

                  <TrendingUp className="size-4 text-coral" />

                  <p className="mt-3 text-[9px] font-black uppercase tracking-wider text-white/30">
                    Score
                  </p>

                  <p className="mt-1 text-lg font-black text-white">
                    {formatNumber(selectedLeader.score)}
                  </p>

                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.035] p-4">

                  <Star className="size-4 text-coral" />

                  <p className="mt-3 text-[9px] font-black uppercase tracking-wider text-white/30">
                    XP
                  </p>

                  <p className="mt-1 text-lg font-black text-white">
                    {formatNumber(selectedLeader.xp)}
                  </p>

                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.035] p-4">

                  <Film className="size-4 text-coral" />

                  <p className="mt-3 text-[9px] font-black uppercase tracking-wider text-white/30">
                    Productions
                  </p>

                  <p className="mt-1 text-lg font-black text-white">
                    {selectedLeader.productions}
                  </p>

                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.035] p-4">

                  <Award className="size-4 text-coral" />

                  <p className="mt-3 text-[9px] font-black uppercase tracking-wider text-white/30">
                    Rating
                  </p>

                  <p className="mt-1 text-lg font-black text-white">
                    {selectedLeader.rating}%
                  </p>

                </div>

              </div>

              {/* CAREER */}

              <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.035] p-4">

                <p className="text-[10px] font-black uppercase tracking-wider text-white/30">
                  Career Overview
                </p>

                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {selectedLeader.name} is a Level{" "}
                  {selectedLeader.level}{" "}
                  {selectedLeader.role.toLowerCase()} with{" "}
                  {selectedLeader.productions} completed
                  productions and an average production
                  rating of {selectedLeader.rating}%.
                </p>

              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setSelectedLeader(null)
                }
                className="mt-6 w-full rounded-md bg-white/[0.06] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                Close
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}