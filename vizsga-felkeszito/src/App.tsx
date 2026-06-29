import { useState, useEffect } from "react";
import { TETELEK_DATA } from "./data/tetelekData";
import type { Topic } from "./data/tetelekData";
import { getRenderedMarkdown, hasMarkdown } from "./content/tetelekContent";

// Badge Interface
interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  condition: (xp: number, completedTopics: number[], simGrades: number[]) => boolean;
}

const BADGES: Badge[] = [
  {
    id: "first_step",
    title: "Első Lépés",
    icon: "🚀",
    description: "Szerezz legalább 50 XP-t a felkészülés során.",
    condition: (xp) => xp >= 50,
  },
  {
    id: "web_architect",
    title: "Web Építész",
    icon: "🌐",
    description: "Teljesítsd az 1. tételt (Web architektúra).",
    condition: (_, completed) => completed.includes(1),
  },
  {
    id: "html_master",
    title: "HTML Lovag",
    icon: "🧱",
    description: "Teljesítsd a 2. tételt (HTML/CSS).",
    condition: (_, completed) => completed.includes(2),
  },
  {
    id: "js_ninja",
    title: "JS Túlélő",
    icon: "🥷",
    description: "Teljesítsd a 3. és 4. JavaScript tételeket.",
    condition: (_, completed) => completed.includes(3) && completed.includes(4),
  },
  {
    id: "ts_guru",
    title: "Típus Guru",
    icon: "🛡️",
    description: "Teljesítsd a 5., 6. és 7. TypeScript tételeket.",
    condition: (_, completed) => completed.includes(5) && completed.includes(6) && completed.includes(7),
  },
  {
    id: "react_wizard",
    title: "React Varázsló",
    icon: "⚛️",
    description: "Teljesítsd a 8., 9. és 10. React tételeket.",
    condition: (_, completed) => completed.includes(8) && completed.includes(9) && completed.includes(10),
  },
  {
    id: "android_master",
    title: "Android Mester",
    icon: "🤖",
    description: "Teljesítsd mind a 6 Android tételt (11–16).",
    condition: (_, completed) =>
      [11, 12, 13, 14, 15, 16].every((id) => completed.includes(id)),
  },
  {
    id: "mock_champ",
    title: "Sikeres ZV",
    icon: "🎓",
    description: "Szerezz jeles (5) osztályzatot a szóbeli szimulátorban.",
    condition: (_, __, grades) => grades.includes(5),
  },
  {
    id: "xp_lord",
    title: "XP Halmozó",
    icon: "👑",
    description: "Érd el az 1000 XP-s szintet.",
    condition: (xp) => xp >= 1000,
  },
];

// LocalStorage Keys
const XP_KEY = "zv_prep_xp";
const COMPLETED_KEY = "zv_prep_completed_topics";
const SOLVED_QUIZZES_KEY = "zv_prep_solved_quizzes";
const LEARNED_CARDS_KEY = "zv_prep_learned_cards";
const SIM_GRADES_KEY = "zv_prep_sim_grades";
const STREAK_KEY = "zv_prep_streak";
const LAST_STUDY_DATE_KEY = "zv_prep_last_study_date";

interface OralQuestionCardProps {
  q: { question: string; answer: string };
  idx: number;
  topicId: number;
}

function OralQuestionCard({ q, idx, topicId }: OralQuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      className={`oral-card ${isExpanded ? "expanded" : ""}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="oral-card-trigger">
        <span>{q.question}</span>
        <span className="oral-icon-arrow">▼</span>
      </div>
      {isExpanded && (
        <div className="oral-card-content">
          <p style={{ color: "var(--text-primary)" }}>{q.answer}</p>
          <div className="oral-note">
            <div className="oral-note-title">💡 Vizsga tipp</div>
            <div>
              {getExamTipForTopic(topicId, idx)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  // Navigation State
  const [activePage, setActivePage] = useState<"study" | "simulator" | "dashboard">("study");
  const [selectedTopicId, setSelectedTopicId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"summary" | "full" | "quiz" | "oral" | "flashcard">("summary");

  // User Stats State
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem(XP_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [completedTopics, setCompletedTopics] = useState<number[]>(() => {
    const saved = localStorage.getItem(COMPLETED_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [solvedQuizzes, setSolvedQuizzes] = useState<number[]>(() => {
    const saved = localStorage.getItem(SOLVED_QUIZZES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [learnedCards, setLearnedCards] = useState<string[]>(() => {
    const saved = localStorage.getItem(LEARNED_CARDS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [simGrades, setSimGrades] = useState<number[]>(() => {
    const saved = localStorage.getItem(SIM_GRADES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem(STREAK_KEY);
    return saved ? parseInt(saved, 10) : 1;
  });

  // Quiz Interaction State
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Flashcards State
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [cardFlipped, setCardFlipped] = useState<boolean>(false);

  // Simulator State
  const [simState, setSimState] = useState<"idle" | "drawing" | "question" | "reveal" | "feedback">("idle");
  const [simTopic, setSimTopic] = useState<Topic | null>(null);
  const [simQuestion, setSimQuestion] = useState<{ question: string; answer: string } | null>(null);
  const [userWrittenAnswer, setUserWrittenAnswer] = useState<string>("");
  const [chosenGrade, setChosenGrade] = useState<number | null>(null);

  // Load and update active topic data
  const currentTopic = TETELEK_DATA.find((t) => t.id === selectedTopicId) || TETELEK_DATA[0];

  // Save state on change
  useEffect(() => {
    localStorage.setItem(XP_KEY, xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedTopics));
  }, [completedTopics]);

  useEffect(() => {
    localStorage.setItem(SOLVED_QUIZZES_KEY, JSON.stringify(solvedQuizzes));
  }, [solvedQuizzes]);

  useEffect(() => {
    localStorage.setItem(LEARNED_CARDS_KEY, JSON.stringify(learnedCards));
  }, [learnedCards]);

  useEffect(() => {
    localStorage.setItem(SIM_GRADES_KEY, JSON.stringify(simGrades));
  }, [simGrades]);

  useEffect(() => {
    localStorage.setItem(STREAK_KEY, streak.toString());
  }, [streak]);

  // Handle Streak & Daily check-in logic
  useEffect(() => {
    const lastDateStr = localStorage.getItem(LAST_STUDY_DATE_KEY);
    const today = new Date().toDateString();

    if (lastDateStr) {
      if (lastDateStr !== today) {
        const lastDate = new Date(lastDateStr);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Increment streak
          setStreak((prev) => prev + 1);
        } else if (diffDays > 1) {
          // Reset streak
          setStreak(1);
        }
        localStorage.setItem(LAST_STUDY_DATE_KEY, today);
      }
    } else {
      localStorage.setItem(LAST_STUDY_DATE_KEY, today);
    }
  }, []);

  // Check if topic completion conditions are met
  const checkTopicCompletion = (topicId: number, newlySolvedQuizzes = solvedQuizzes, newlyLearnedCards = learnedCards) => {
    const topic = TETELEK_DATA.find((t) => t.id === topicId);
    if (!topic || completedTopics.includes(topicId)) return;

    // Must solve quiz
    const quizSolved = newlySolvedQuizzes.includes(topicId);
    // Must learn all flashcards
    const allCardsLearned = topic.flashcards.every((card) =>
      newlyLearnedCards.includes(`${topicId}_${card.question}`)
    );

    if (quizSolved && allCardsLearned) {
      setCompletedTopics((prev) => [...prev, topicId]);
      setXp((prev) => prev + 100); // 100 XP completion bonus!
    }
  };

  // Handle tab switching resets
  const handleTabChange = (tab: "summary" | "full" | "quiz" | "oral" | "flashcard") => {
    setActiveTab(tab);
    if (tab === "quiz") {
      setSelectedAnswer(null);
      setQuizSubmitted(false);
    } else if (tab === "flashcard") {
      setCurrentCardIndex(0);
      setCardFlipped(false);
    }
  };

  const handleTopicChange = (topicId: number) => {
    setSelectedTopicId(topicId);
    handleTabChange("summary");
  };

  // Handle Quiz Submission
  const handleQuizSubmit = (optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(optionIndex);
    setQuizSubmitted(true);

    if (optionIndex === currentTopic.quiz.correctIndex) {
      const isFirstSolve = !solvedQuizzes.includes(selectedTopicId);
      if (isFirstSolve) {
        const nextSolved = [...solvedQuizzes, selectedTopicId];
        setSolvedQuizzes(nextSolved);
        setXp((prev) => prev + 50); // Correct answer: +50 XP
        checkTopicCompletion(selectedTopicId, nextSolved);
      }
    }
  };

  // Handle Flashcard Action
  const handleFlashcardEvaluate = (status: "know" | "unsure" | "unknown") => {
    const cardId = `${selectedTopicId}_${currentTopic.flashcards[currentCardIndex].question}`;
    let nextLearned = [...learnedCards];

    if (status === "know") {
      if (!learnedCards.includes(cardId)) {
        nextLearned = [...learnedCards, cardId];
        setLearnedCards(nextLearned);
        setXp((prev) => prev + 15); // Learned card: +15 XP
        checkTopicCompletion(selectedTopicId, solvedQuizzes, nextLearned);
      }
    } else {
      if (learnedCards.includes(cardId)) {
        nextLearned = learnedCards.filter((id) => id !== cardId);
        setLearnedCards(nextLearned);
      }
    }

    // Go to next card after evaluation
    setCardFlipped(false);
    setTimeout(() => {
      if (currentCardIndex < currentTopic.flashcards.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
      } else {
        // Wrap around or restart
        setCurrentCardIndex(0);
      }
    }, 200);
  };

  // Simulator Actions
  const startSimulatorSession = () => {
    setSimState("drawing");
    setUserWrittenAnswer("");
    setChosenGrade(null);

    // Simulated delay for drawing a topic
    setTimeout(() => {
      const randomTopic = TETELEK_DATA[Math.floor(Math.random() * TETELEK_DATA.length)];
      const randomQuestion = randomTopic.oralQuestions[Math.floor(Math.random() * randomTopic.oralQuestions.length)];

      setSimTopic(randomTopic);
      setSimQuestion(randomQuestion);
      setSimState("question");
    }, 1500);
  };

  const handleSimulatorEvaluate = (grade: number) => {
    setChosenGrade(grade);
    setSimGrades((prev) => [...prev, grade]);

    let xpGain = 0;
    if (grade === 5) xpGain = 150;
    else if (grade === 4) xpGain = 100;
    else if (grade === 3) xpGain = 50;
    else if (grade === 2) xpGain = 20;

    setXp((prev) => prev + xpGain);
    setSimState("feedback");
  };

  const recoverStreak = () => {
    setStreak((prev) => prev + 1);
    setXp((prev) => Math.max(0, prev - 30)); // Streak recovery costs 30 XP
  };

  // Calculate Overall Progress
  const totalCompletionPercent = Math.round((completedTopics.length / TETELEK_DATA.length) * 100);

  return (
    <div className="app-container">
      {/* Sidebar Panel */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="logo-icon">🔮</span>
            <h1 className="logo-text">ZV Felkészítő</h1>
          </div>
          <p className="logo-subtitle">Kliensalkalmazások (1-16)</p>
        </div>

        {/* User Progress and Stats */}
        <div className="progress-panel">
          <div className="progress-header">
            <span>Felkészültség</span>
            <span className="progress-percentage">{totalCompletionPercent}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${totalCompletionPercent}%` }}></div>
          </div>
          <div className="stats-row">
            <div className="stat-box">
              <span className="stat-icon">⭐</span>
              <div className="stat-info">
                <span className="stat-val">{xp}</span>
                <span className="stat-label">Total XP</span>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">🔥</span>
              <div className="stat-info">
                <span className="stat-val">{streak} nap</span>
                <span className="stat-label">Streak</span>
                {streak === 0 && xp >= 30 && (
                  <button className="recover-btn" onClick={recoverStreak}>
                    Mentés (-30XP)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* List of Topics */}
        <nav className="sidebar-list">
          <h2 className="sidebar-list-header">Tételek listája</h2>
          {TETELEK_DATA.map((topic) => {
            const isActive = selectedTopicId === topic.id && activePage === "study";
            const isCompleted = completedTopics.includes(topic.id);
            return (
              <button
                key={topic.id}
                className={`topic-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                onClick={() => {
                  setActivePage("study");
                  handleTopicChange(topic.id);
                }}
              >
                <div className="topic-badge-icon">
                  {isCompleted ? "✓" : topic.id}
                </div>
                <div className="topic-info">
                  <div className="topic-num">{topic.id}. tétel</div>
                  <div className="topic-title">{topic.title.replace(/^\d+\.\s+tétel\s*–\s*/, "")}</div>
                </div>
                <div className="status-dot"></div>
              </button>
            );
          })}
        </nav>

        {/* Navigation buttons at bottom */}
        <div className="sidebar-footer">
          <button
            className={`nav-button ${activePage === "simulator" ? "active" : ""}`}
            onClick={() => setActivePage("simulator")}
          >
            🏛️ Szóbeli Szimulátor
          </button>
          <button
            className={`nav-button ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => setActivePage("dashboard")}
          >
            🏆 Eredménytábla
          </button>
        </div>
      </aside>

      {/* Main Panel View */}
      <main className="main-content">
        {activePage === "study" && (
          <>
            {/* Header section */}
            <header className="content-header">
              <div className="topic-badge-pill">{currentTopic.id}. tétel</div>
              <h2 className="content-title">{currentTopic.title}</h2>
              <p className="text-secondary" style={{ fontSize: "0.95rem" }}>
                Készülj fel a záróvizsga szóbeli elméleti és gyakorlati számonkérésére.
              </p>
            </header>

            {/* Tab selector bar */}
            <div className="tabs-container">
              <button
                className={`tab-btn ${activeTab === "summary" ? "active" : ""}`}
                onClick={() => handleTabChange("summary")}
              >
                📖 1. Lényeg (Vázlat)
              </button>
              <button
                className={`tab-btn ${activeTab === "full" ? "active" : ""}`}
                onClick={() => handleTabChange("full")}
              >
                📚 2. Teljes kidolgozás
              </button>
              <button
                className={`tab-btn ${activeTab === "quiz" ? "active" : ""}`}
                onClick={() => handleTabChange("quiz")}
              >
                🛠️ 3. Kód & Gyakorlat
              </button>
              <button
                className={`tab-btn ${activeTab === "oral" ? "active" : ""}`}
                onClick={() => handleTabChange("oral")}
              >
                🗣️ 4. ZV Kérdések
              </button>
              <button
                className={`tab-btn ${activeTab === "flashcard" ? "active" : ""}`}
                onClick={() => handleTabChange("flashcard")}
              >
                ⚡ 5. Aktív Felidézés
              </button>
            </div>

            {/* Tab content displays */}
            <div className="tab-panel">
              {/* Theory Summary Tab */}
              {activeTab === "summary" && (
                <div className="summary-card">
                  <ul className="summary-list">
                    {currentTopic.summary.map((point, index) => (
                      <li key={index} className="summary-item">
                        <div className="summary-bullet">{index + 1}</div>
                        <div className="summary-text">{point}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full Markdown Elaboration Tab (teljes kidolgozás, veszteségmentes) */}
              {activeTab === "full" && (
                <div className="full-md-card">
                  {hasMarkdown(currentTopic.id) ? (
                    <div
                      className="markdown-body"
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        const link = target.closest("a.wikilink") as HTMLElement | null;
                        if (link) {
                          e.preventDefault();
                          const t = parseInt(link.dataset.tetel || "", 10);
                          if (t && TETELEK_DATA.some((x) => x.id === t)) {
                            setSelectedTopicId(t);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }
                      }}
                      dangerouslySetInnerHTML={{ __html: getRenderedMarkdown(currentTopic.id) }}
                    />
                  ) : (
                    <p className="text-secondary">Ehhez a tételhez még nincs teljes kidolgozás betöltve.</p>
                  )}
                </div>
              )}

              {/* Quiz / Practical Tab */}
              {activeTab === "quiz" && (
                <div className="quiz-container">
                  {/* Code Snippet Box */}
                  <div className="code-presentation">
                    <div className="code-presentation-header">
                      <span>PÉLDA KÓD ÉS ALKALMAZÁS</span>
                      <span className="code-lang-tag">
                        {currentTopic.id <= 2 ? "HTML/CSS" : currentTopic.id <= 4 ? "JavaScript" : currentTopic.id <= 7 ? "TypeScript" : currentTopic.id <= 10 ? "React/TSX" : "Kotlin/Android"}
                      </span>
                    </div>
                    <code className="code-body">
                      {getCodeExampleForTopic(currentTopic.id)}
                    </code>
                  </div>

                  {/* Quiz Option Box */}
                  <div className="quiz-card">
                    <h3 className="quiz-title">Gyakorlati Kérdés</h3>
                    <p className="quiz-question">{currentTopic.quiz.question}</p>
                    <div className="quiz-options">
                      {currentTopic.quiz.options.map((option, idx) => {
                        let btnClass = "";
                        if (quizSubmitted) {
                          if (idx === currentTopic.quiz.correctIndex) {
                            btnClass = "correct";
                          } else if (idx === selectedAnswer) {
                            btnClass = "wrong";
                          }
                        } else if (selectedAnswer === idx) {
                          btnClass = "selected";
                        }
                        return (
                          <button
                            key={idx}
                            className={`quiz-option-btn ${btnClass}`}
                            disabled={quizSubmitted}
                            onClick={() => handleQuizSubmit(idx)}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="quiz-feedback">
                        <div
                          className={`quiz-feedback-title ${
                            selectedAnswer === currentTopic.quiz.correctIndex ? "correct" : "wrong"
                          }`}
                        >
                          {selectedAnswer === currentTopic.quiz.correctIndex
                            ? "🎉 Helyes válasz! (+50 XP)"
                            : "❌ Sajnos nem talált."}
                        </div>
                        <div className="quiz-feedback-text">{currentTopic.quiz.explanation}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tricky Oral Questions Tab */}
              {activeTab === "oral" && (
                <div className="oral-questions-grid">
                  <p className="text-secondary" style={{ marginBottom: "16px", fontSize: "0.9rem" }}>
                    A vizsgáztatók (BME tanszéki tanárok) kedvelt keresztkérdései ehhez a tételhez. Kattints a kártyákra a válasz kibontásához!
                  </p>
                  {currentTopic.oralQuestions.map((q, idx) => (
                    <OralQuestionCard
                      key={idx}
                      q={q}
                      idx={idx}
                      topicId={currentTopic.id}
                    />
                  ))}
                </div>
              )}

              {/* Flashcards Tab */}
              {activeTab === "flashcard" && (
                <div className="flashcards-container">
                  <div className="card-navigator">
                    <span>
                      Kártya: {currentCardIndex + 1} / {currentTopic.flashcards.length}
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="nav-arrow-btn"
                        disabled={currentCardIndex === 0}
                        onClick={() => {
                          setCardFlipped(false);
                          setCurrentCardIndex((prev) => prev - 1);
                        }}
                      >
                        ◀ Előző
                      </button>
                      <button
                        className="nav-arrow-btn"
                        disabled={currentCardIndex === currentTopic.flashcards.length - 1}
                        onClick={() => {
                          setCardFlipped(false);
                          setCurrentCardIndex((prev) => prev + 1);
                        }}
                      >
                        Következő ▶
                      </button>
                    </div>
                  </div>

                  <div
                    className={`card-flip-wrapper ${cardFlipped ? "flipped" : ""}`}
                    onClick={() => setCardFlipped(!cardFlipped)}
                  >
                    <div className="card-flip-inner">
                      {/* Front Side */}
                      <div className="card-side card-front">
                        <span className="card-meta">Aktív Felidézés</span>
                        <div className="card-question">
                          {currentTopic.flashcards[currentCardIndex].question}
                        </div>
                        <span className="card-instruction">Kattints a megfordításhoz</span>
                      </div>

                      {/* Back Side */}
                      <div className="card-side card-back">
                        <span className="card-meta">Helyes Válasz</span>
                        <div className="card-answer">
                          {currentTopic.flashcards[currentCardIndex].answer}
                        </div>
                        <span className="card-instruction">Kattints a megfordításhoz</span>
                      </div>
                    </div>
                  </div>

                  {cardFlipped && (
                    <div className="eval-panel">
                      <span className="eval-label">Őszintén, tudtad a helyes választ?</span>
                      <div className="eval-buttons">
                        <button className="eval-btn danger" onClick={() => handleFlashcardEvaluate("unknown")}>
                          Egyáltalán nem (0 XP)
                        </button>
                        <button className="eval-btn warning" onClick={() => handleFlashcardEvaluate("unsure")}>
                          Bizonytalan (0 XP)
                        </button>
                        <button className="eval-btn success" onClick={() => handleFlashcardEvaluate("know")}>
                          Teljesen tudom (+15 XP)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Oral Exam Simulator Screen */}
        {activePage === "simulator" && (
          <div className="simulator-container">
            <header className="content-header" style={{ textAlign: "center" }}>
              <div className="topic-badge-pill" style={{ background: "rgba(6, 182, 212, 0.12)", color: "var(--secondary)" }}>ZV Szimulátor</div>
              <h2 className="content-title">Szóbeli Államvizsga Szimuláció</h2>
              <p className="text-secondary" style={{ fontSize: "0.95rem" }}>
                Húzz egy véletlenszerű tételt mind a 16-ból, fogalmazd meg a válaszod, majd értékeld magad a hivatalos BME követelményrendszer alapján.
              </p>
            </header>

            <div className="sim-panel">
              <div className="examiner-avatar">🧑‍🏫</div>
              <h3 className="examiner-name">Dr. BME Kliensalkalmazások</h3>
              <p className="examiner-title">Záróvizsga Bizottság Elnöke</p>

              {simState === "idle" && (
                <>
                  <div className="speech-bubble">
                    "Köszöntöm a záróvizsgán. Ha felkészült, kérem húzzon egy tétellapot az asztalról, majd kezdje meg a kifejtést."
                  </div>
                  <button className="sim-start-btn" onClick={startSimulatorSession}>
                    🎴 Húzás a tételekből!
                  </button>
                </>
              )}

              {simState === "drawing" && (
                <div className="speech-bubble" style={{ padding: "40px" }}>
                  <div className="logo-icon" style={{ fontSize: "2rem", marginBottom: "16px" }}>🃏</div>
                  <div>Tétel húzása folyamatban...</div>
                </div>
              )}

              {(simState === "question" || simState === "reveal" || simState === "feedback") && simTopic && simQuestion && (
                <>
                  <div className="drawn-tétel-tag">
                    📚 Húzott tétel: {simTopic.id}. Tétel
                  </div>
                  <div className="speech-bubble">
                    "A húzott tétele alapján kérem fejtse ki a következőt: <strong>{simQuestion.question}</strong>"
                  </div>

                  {simState === "question" && (
                    <>
                      <textarea
                        className="user-answer-input"
                        placeholder="Gépeld be a kulcsszavakat, vázlatodat vagy a teljes feleletedet ide..."
                        value={userWrittenAnswer}
                        onChange={(e) => setUserWrittenAnswer(e.target.value)}
                      />
                      <button
                        className="sim-start-btn"
                        style={{ background: "linear-gradient(135deg, var(--secondary), #0891b2)" }}
                        onClick={() => setSimState("reveal")}
                      >
                        🔍 Felelet befejezése & Válaszvázlat megnyitása
                      </button>
                    </>
                  )}

                  {(simState === "reveal" || simState === "feedback") && (
                    <div className="criteria-section">
                      <div className="criteria-title">Hivatalos BME Értékelőlap</div>
                      <p className="text-secondary" style={{ fontSize: "0.85rem", marginBottom: "16px" }}>
                        Hasonlítsd össze az elmondott/leírt válaszodat a vizsgakövetelményekkel:
                      </p>

                      <div className="criteria-list">
                        <div className="criteria-item">
                          <div className="grade-badge grade-5">Jeles (5) szint</div>
                          <div className="criteria-content">{simQuestion.answer}</div>
                        </div>
                        <div className="criteria-item">
                          <div className="grade-badge grade-3">Közepes (3) szint</div>
                          <div className="criteria-content">
                            A fogalmat nagyjából ismeri, de hiányoznak a pontos részletek és a mélyebb architektúrális megértés.
                          </div>
                        </div>
                      </div>

                      {simState === "reveal" && (
                        <div className="grade-selector">
                          <span className="eval-label">Értékeld a feleletedet a fenti szempontok alapján:</span>
                          <div className="grade-btn-row">
                            <button className="grade-btn g5" onClick={() => handleSimulatorEvaluate(5)}>
                              Jeles (5)
                            </button>
                            <button className="grade-btn" style={{ borderColor: "rgba(6, 182, 212, 0.3)" }} onClick={() => handleSimulatorEvaluate(4)}>
                              Jó (4)
                            </button>
                            <button className="grade-btn" style={{ borderColor: "rgba(245, 158, 11, 0.3)" }} onClick={() => handleSimulatorEvaluate(3)}>
                              Közepes (3)
                            </button>
                            <button className="grade-btn g2" onClick={() => handleSimulatorEvaluate(2)}>
                              Elégséges (2) / Elégtelen (1)
                            </button>
                          </div>
                        </div>
                      )}

                      {simState === "feedback" && chosenGrade !== null && (
                        <div className="quiz-feedback" style={{ marginTop: "24px", textAlign: "center" }}>
                          <div className="quiz-feedback-title correct" style={{ justifyContent: "center" }}>
                            🎉 Felelet elmentve! Osztályzat: {chosenGrade}
                          </div>
                          <p className="quiz-feedback-text">
                            A feleletért kapott XP sikeresen jóváírva az egyenlegeden. Folytasd a felkészülést!
                          </p>
                          <button
                            className="sim-start-btn"
                            style={{ marginTop: "16px" }}
                            onClick={() => setSimState("idle")}
                          >
                            🔄 Következő vizsgázó / Új tétel húzása
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Gamified Achievements Dashboard Screen */}
        {activePage === "dashboard" && (
          <div className="simulator-container">
            <header className="content-header" style={{ textAlign: "center" }}>
              <div className="topic-badge-pill">Dicsőségfal</div>
              <h2 className="content-title">Eredményeid és Kitüntetéseid</h2>
              <p className="text-secondary" style={{ fontSize: "0.95rem" }}>
                Kövesd nyomon a felkészülési mérföldköveidet és az elért kitüntetéseket.
              </p>
            </header>

            <div className="sim-panel" style={{ textAlign: "left", alignItems: "stretch" }}>
              <h3 className="examiner-name" style={{ marginBottom: "16px" }}>Statisztikák</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
                <div className="stat-box" style={{ padding: "16px" }}>
                  <span className="stat-icon" style={{ fontSize: "1.8rem" }}>✔️</span>
                  <div className="stat-info">
                    <span className="stat-val" style={{ fontSize: "1.2rem" }}>{completedTopics.length} / {TETELEK_DATA.length}</span>
                    <span className="stat-label">Befejezett tételek</span>
                  </div>
                </div>
                <div className="stat-box" style={{ padding: "16px" }}>
                  <span className="stat-icon" style={{ fontSize: "1.8rem" }}>🎯</span>
                  <div className="stat-info">
                    <span className="stat-val" style={{ fontSize: "1.2rem" }}>{solvedQuizzes.length} / {TETELEK_DATA.length}</span>
                    <span className="stat-label">Megoldott kódos kvízek</span>
                  </div>
                </div>
                <div className="stat-box" style={{ padding: "16px" }}>
                  <span className="stat-icon" style={{ fontSize: "1.8rem" }}>💡</span>
                  <div className="stat-info">
                    <span className="stat-val" style={{ fontSize: "1.2rem" }}>{learnedCards.length} db</span>
                    <span className="stat-label">Megtanult flashcard</span>
                  </div>
                </div>
                <div className="stat-box" style={{ padding: "16px" }}>
                  <span className="stat-icon" style={{ fontSize: "1.8rem" }}>🏫</span>
                  <div className="stat-info">
                    <span className="stat-val" style={{ fontSize: "1.2rem" }}>{simGrades.length} alkalom</span>
                    <span className="stat-label">Szóbeli szimulációk száma</span>
                  </div>
                </div>
              </div>

              <h3 className="examiner-name" style={{ marginBottom: "8px" }}>Elért kitüntetések (Badges)</h3>
              <p className="text-secondary" style={{ fontSize: "0.85rem", marginBottom: "16px" }}>
                Bizonyos mérföldkövek teljesítése után automatikusan feloldódnak a dicsőség-jelvények.
              </p>

              <div className="badges-container">
                {BADGES.map((badge) => {
                  const isUnlocked = badge.condition(xp, completedTopics, simGrades);
                  return (
                    <div key={badge.id} className={`badge-item ${isUnlocked ? "unlocked" : ""}`}>
                      <span className="badge-icon">{badge.icon}</span>
                      <span className="badge-title">{badge.title}</span>
                      <span className="badge-desc">{badge.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helpers for dynamic code generation depending on topic ID
function getCodeExampleForTopic(id: number): string {
  switch (id) {
    case 1:
      return `// A webszerver (pl. IIS/Nginx) által fogadott nyers HTTP Request csomag:
GET /api/users/profile HTTP/1.1
Host: aut.bme.hu
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)

// A válasz (Response):
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: sessionId=xyz12345; HttpOnly; SameSite=Strict; Secure

{
  "name": "Kovács János",
  "role": "student"
}`;
    case 2:
      return `/* HTML oldalváz és űrlap címke összekötés */
<form action="/register" method="POST">
  <!-- ID és 'for' attribútumok tökéletes párosítása -->
  <label for="user-email">E-mail cím:</label>
  <input type="email" id="user-email" name="email" required />
  
  <button type="submit">Regisztráció</button>
</form>

/* CSS Selector specifikussági teszt kód */
body div.container section#profile .info-card p.intro {
  color: #a855f7; /* Milyen specifikusságú ez a szelektor? */
}`;
    case 3:
      return `// JavaScript típusok és laza/szigorú összehasonlítások
let age = "24";
let increment = 1;

// Implicit típuskonverziós tesztek:
let total = age + increment;     // "241" (string)
let math = Number(age) + increment; // 25 (number)

console.log(null == undefined);  // true (laza egyenlőség)
console.log(null === undefined); // false (szigorú egyenlőség)
console.log(typeof null);        // "object" (hírhedt nyelv-szintű bug!)`;
    case 4:
      return `// Prototípus-lánc és az eseményhurok (Event Loop) this kezelése
function User(name) {
  this.name = name;
}
// Metódus elhelyezése a prototípuson (minden példány eléri)
User.prototype.sayHi = function() {
  console.log("Szia, a nevem: " + this.name);
};

const user = new User("Peti");
user.sayHi(); // "Szia, a nevem: Peti"

// Arrow function lexikális this példa egy időzítőben:
function Counter() {
  this.count = 0;
  setInterval(() => {
    this.count++; // Az arrow fv miatt 'this' a Counter példány marad!
  }, 1000);
}`;
    case 5:
      return `// TypeScript strukturális kompatibilitás és típusok
interface Point {
  x: number;
  y: number;
}

class Location3D {
  constructor(public x: number, public y: number, public z: number) {}
}

// Strukturálisan kompatibilis, mivel a Location3D-nek van x és y tagja!
const p: Point = new Location3D(10, 20, 30); // OK!

// Unió és metszet típusok
type LoadingState = "idle" | "loading" | "success" | "error"; // Unió
type Entity = { id: string } & { name: string }; // Metszet`;
    case 6:
      return `// strictNullChecks és Type Narrowing (típus szűkítés)
function formatLength(input: string | null | undefined): number {
  // A strictNullChecks miatt nem hívható input.length szűkítés nélkül!
  
  if (input === null || input === undefined) {
    return 0; // Itt a típus null | undefined
  }
  
  // Itt a fordító tudja, hogy az input csak string lehet (Type Narrowing)
  return input.length; 
}

// Null Coalescing vs OR operátor
const val = 0;
const test1 = val || 10; // 10 (mivel a 0 falsy)
const test2 = val ?? 10; // 0 (mivel a 0 nem null/undefined)`;
    case 7:
      return `// TypeScript Generikusok és Metaprogramozás Dekorátorokkal
interface Lengthwise {
  length: number;
}

// Generikus típus korlátozással (constraint)
function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // OK, a típus-kényszer garantálja a length létezését
  return arg;
}

// Dekorátor függvény osztály metódusára:
function logged(originalMethod: any, context: ClassMethodDecoratorContext) {
  return function(this: any, ...args: any[]) {
    console.log("Hívás előtt");
    return originalMethod.apply(this, args);
  };
}`;
    case 8:
      return `// controlled component és a useSyncExternalStore Hook
import { useState, useSyncExternalStore } from "react";

// 1. Controlled Component (Vezérelt input)
function ControlledInput() {
  const [val, setVal] = useState("");
  return <input value={val} onChange={(e) => setVal(e.target.value)} />;
}

// 2. useSyncExternalStore (Külső store-ra való szinkron feliratkozás)
const store = {
  subscribe: (cb: () => void) => { /* feliratkozási logika */ return () => {}; },
  getSnapshot: () => "store_value"
};

function StoreConsumer() {
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  return <div>Store értéke: {state}</div>;
}`;
    case 9:
      return `// Függvénykomponensek életciklusa a useEffect hook segítségével
import { useEffect, useState } from "react";

function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    // 1. componentDidMount szimuláció (üres függőségi tömbbel [])
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    // 2. componentWillUnmount szimuláció (takarító cleanup függvény visszaadása)
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Csak egyszer fut le az első render után

  return <div>Aktuális idő: {time}</div>;
}`;
    case 10:
      return `// Aszinkron kérések kezelése és a mounted flag minta
import { useState, useEffect } from "react";

function Profile({ userId }: { userId: string }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true; // Flag a memóriaszivárgás és figyelmeztetések ellen

    async function fetchData() {
      const res = await fetch(\`/api/user/\${userId}\`);
      const json = await res.json();
      
      if (mounted) {
        setData(json); // Csak akkor frissítünk, ha még létezik a komponens!
      }
    }
    fetchData();

    return () => {
      mounted = false; // Cleanup: False-ra állítjuk, ha unmountol a komponens
    };
  }, [userId]); // Újrafut, ha változik a userId

  return <div>{data ? data.name : "Betöltés..."}</div>;
}`;
    case 11:
      return `// AndroidManifest.xml – a komponensek és a belépési pont deklarálása
<manifest package="hu.bme.aut.android.example"
          android:versionCode="1" android:versionName="1.0">
  <uses-sdk android:minSdkVersion="21" />
  <uses-permission android:name="android.permission.INTERNET" />

  <application android:icon="@drawable/ic_launcher"
               android:label="@string/app_name">
    <activity android:name=".MainActivity">
      <!-- Ez teszi a launcher (indító) Activity-vé: -->
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>
    </activity>
    <service android:name=".DownloadService" />
    <receiver android:name=".BootReceiver" />
  </application>
</manifest>`;
    case 12:
      return `// Explicit Intent: saját Activity indítása adatátadással + eredménnyel
val intent = Intent(this, DetailsActivity::class.java)
intent.putExtra("productId", 42)
startActivityForResult(intent, REQ_DETAILS)

// A hívott Activity visszajelez a finish() előtt:
setResult(Activity.RESULT_OK, Intent().putExtra("done", true))
finish()

// A hívó feldolgozza az eredményt:
override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
  if (requestCode == REQ_DETAILS && resultCode == Activity.RESULT_OK) {
    val done = data?.getBooleanExtra("done", false)
  }
}

// Implicit Intent: beépített tárcsázó megnyitása konkrét számmal
startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:0630-123-4567")))`;
    case 13:
      return `// Erőforrás elérése kódból és a Fragment dinamikus csatolása
val title: String = getString(R.string.app_name)   // R.típus.név
imageView.setImageResource(R.drawable.logo)

// res/values/strings.xml      -> alapértelmezett (pl. angol)
// res/values-hu/strings.xml   -> magyar lokalizáció (qualifier: -hu)

// Fragment dinamikus betöltése FragmentTransaction-nel:
val fragment = DetailsFragment.newInstance(itemId)
supportFragmentManager.beginTransaction()
  .replace(R.id.fragmentContainer, fragment, DetailsFragment.TAG)
  .addToBackStack(null)   // a Vissza gombbal visszaléphető
  .commit()`;
    case 14:
      return `// Room (ORM) – entitás, DAO, adatbázis + RecyclerView Adapter
@Entity(tableName = "todo")
data class Todo(
  @PrimaryKey(autoGenerate = true) val id: Long = 0,
  @ColumnInfo(name = "title") val title: String
)

@Dao
interface TodoDao {
  @Query("SELECT * FROM todo") fun getAll(): List<Todo>
  @Insert fun insert(todo: Todo)
}

// RecyclerView.Adapter – a ViewHolder minta kötelező:
class TodoAdapter(val items: List<Todo>) : RecyclerView.Adapter<TodoAdapter.VH>() {
  class VH(view: View) : RecyclerView.ViewHolder(view) {
    val tvTitle: TextView = view.findViewById(R.id.tvTitle)
  }
  override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
    val v = LayoutInflater.from(parent.context).inflate(R.layout.row, parent, false)
    return VH(v)
  }
  override fun onBindViewHolder(h: VH, pos: Int) { h.tvTitle.text = items[pos].title }
  override fun getItemCount() = items.size
}`;
    case 15:
      return `// Hálózati hívás háttérszálon (coroutine) + futásidejű engedélykérés
viewModelScope.launch(Dispatchers.IO) {
  val response = api.getRates("EUR")   // Retrofit, suspend
  withContext(Dispatchers.Main) {
    tvResult.text = response.base       // UI frissítés a fő szálon!
  }
}

// Veszélyes engedély futásidejű kérése:
if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
      != PackageManager.PERMISSION_GRANTED) {
  ActivityCompat.requestPermissions(this,
    arrayOf(Manifest.permission.CAMERA), REQ_CAMERA)
}

override fun onRequestPermissionsResult(
  requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
  if (requestCode == REQ_CAMERA &&
      grantResults.firstOrNull() == PackageManager.PERMISSION_GRANTED) {
    // engedélyezve
  }
}`;
    case 16:
      return `// Jetpack Compose: State Hoisting + Recomposition + Flow a ViewModelből
@Composable
fun Counter() {
  // rememberSaveable: túléli a képernyő-elforgatást is
  var count by rememberSaveable { mutableStateOf(0) }
  // Csak ez a Text komponálódik újra, ami a count-tól függ:
  Button(onClick = { count++ }) { Text("Kattintások: $count") }
}

// MVI/MVVM: a ViewModel Flow-ban adja az állapotot, a UI begyűjti
class TodoViewModel : ViewModel() {
  private val _state = MutableStateFlow<TodoState>(TodoState.Loading)
  val state = _state.asStateFlow()
}

@Composable
fun TodoScreen(vm: TodoViewModel = viewModel()) {
  val state by vm.state.collectAsStateWithLifecycle()
  when (state) {
    is TodoState.Loading -> CircularProgressIndicator()
    is TodoState.Result  -> { /* lista LazyColumn-ban */ }
    is TodoState.Error   -> Text("Hiba")
  }
}`;
    default:
      return "";
  }
}

// Helper to provide detailed exam tips/gotchas for the oral questions
function getExamTipForTopic(topicId: number, questionIdx: number): string {
  if (topicId === 1) {
    if (questionIdx === 0) {
      return "A vizsgáztató gyakran belekérdez: 'Mi történik, ha letiltjuk a cookie-kat a böngészőben?' - Ekkor elbukik a session ID visszaküldése. A válasz az, hogy ekkor URL paraméterekbe ágyazva vagy egyedi HTTP fejlécekkel (pl. JWT tokennel) tudjuk továbbítani az állapotot.";
    }
    return "Fontos kiemelni: a webszerver szoftver szoftveres szinten portot foglal (80/443), URL-t fordít fizikai fájl-elérésre, és eldönti, hogy statikusan csak fájlt küld vissza, vagy átadja a kérést az alkalmazásszervernek (pl. ASP.NET core processznek) feldolgozásra.";
  }
  if (topicId === 2) {
    if (questionIdx === 0) {
      return "Ügyelj rá, hogy a vizsgán ne keverd össze: a label 'for' attribútuma az input *ID*-jára kell mutasson, nem pedig a *name* attribútumra! A name a szerveroldali form-beküldéshez kell, az ID a kliensoldali label-kapcsolathoz és CSS/JS eléréshez.";
    }
    return "A 'setCustomValidity(msg)' egy fontos kulcsszó. Ha beállítod, a böngésző automatikusan érvénytelennek tekinti az inputot és nem engedi elküldeni a formot. Ha újra valid a mező, le kell tisztázni egy üres stringgel: 'setCustomValidity('')'!";
  }
  if (topicId === 3) {
    if (questionIdx === 0) {
      return "Sok diák elbukja ezt a kérdést. Mindig mondd el, hogy a laza egyenlőség (==) laza konverziója miatt a JS tele van váratlan egyenlőségekkel (pl. '[] == false' igaz), ezért a szakmai best practice mindig a szigorú egyenlőség (===) használata, ami típusegyezést is megkövetel.";
    }
    return "A 'first-class citizen' kifejezésért plusz pont jár. Említsd meg a 'magasabb rendű függvény' (Higher-Order Function) fogalmát is, ami olyan függvény, ami függvényt kap paraméterül (pl. callbackek) vagy függvénnyel tér vissza.";
  }
  if (topicId === 4) {
    if (questionIdx === 0) {
      return "Gyakori kérdés: 'Hogyan tudsz egy arrow function-nek saját this-t adni?' - Trükkös kérdés, a válasz: SEHOGY. Sem a bind(), sem a call() nem tudja felülírni a nyílfüggvény lexikális this-ét. Ezért van az, hogy osztály-metódusnak írva nem lehet tetszőlegesen felülbírálni.";
    }
    return "Mondd el pontosan: a Promise *all* a leggyakoribb, de ha egy is elszáll, a többi eredményét elveszítjük. Ha mindenképp látni akarjuk mindnek a kimenetelét (pl. külön-külön sikerült-e betölteni az adatokat a dashboardon), akkor a *Promise.allSettled* a helyes választás.";
  }
  if (topicId === 5) {
    if (questionIdx === 0) {
      return "A strukturális kompatibilitásnál hozd fel a 'duck typing' analógiát: 'Ha úgy jár, mint egy kacsa, és úgy hápog, mint egy kacsa, akkor az egy kacsa.' A TypeScript nem vizsgálja az osztályok származási vonalát nominálisan, csak a publikus interfészüket.";
    }
    return "Mindig említsd meg a 'type narrowing' (típusszűkítés) fontosságát az unióknál. Ha van egy uniód, pl. 'number | string', a fordító nem engedi a string metódusokat (pl. toUpperCase) futtatni, amíg egy 'typeof === string' vizsgálattal le nem szűkíted a típust.";
  }
  if (topicId === 6) {
    if (questionIdx === 0) {
      return "Sokan összekeverik a '??' és a '||' működését. A vizsgáztató szeret olyan példákat felírni, ahol a beállított érték egy '0' szám vagy egy üres string '', és megkérdezi mi történik. A '||' ilyenkor lecserélné a default értékre, ami hibás működéshez vezethet (pl. 0 pontot nem tud beállítani).";
    }
    return "Hangsúlyozd, hogy a TS-ben az overload szignatúrák *csak a fordítónak* szólnak. A fordítás után keletkező JS-ben csak egy darab függvény lesz, aminek a testében neked kell kézzel megvizsgálnod a paraméterek típusait (typeof-fal vagy if-ekkel) és aszerint elágaznod.";
  }
  if (topicId === 7) {
    if (questionIdx === 0) {
      return "Nagy piros pont jár azért, ha elmondod: az interfész deklaráció-összeolvadása (declaration merging) teszi lehetővé, hogy a külső könyvtárak típusait utólagosan kibővítsük (pl. a global window objektumhoz új tulajdonságot adjunk hozzá, amit egy script hozott be).";
    }
    return "Említsd meg, hogy a dekorátorok az ES szabvány részei lettek, de a TypeScriptben a használatukhoz be kell kapcsolni az 'experimentalDecorators' flaget a tsconfig.json-ben (vagy a modern Standard dekorátorokat kell használni az újabb tsc verziókban).";
  }
  if (topicId === 8) {
    if (questionIdx === 0) {
      return "A useSyncExternalStore hooknál a vizsgáztató rámutathat a getSnapshot fontosságára: ha a getSnapshot minden híváskor új objektumot hoz létre (nincs cache-elve / nem immutable), a React végtelen újrarenderelési ciklusba kerül, mert azt hiszi, a store folyamatosan változik!";
    }
    return "A controlled component lényege a 'single source of truth' (az igazság egyetlen forrása). Ha az input nem controlled, akkor a HTML DOM és a React state külön életet él, ami űrlapok visszaállításakor (reset) vagy külső adatmódosításnál inkonzisztenciát okoz.";
  }
  if (topicId === 9) {
    if (questionIdx === 0) {
      return "A 'this' elvesztése a JS alapvető sajátossága. Mindig magyarázd el: ha átadjuk a handleClick függvény referenciáját a gombnak, a gomb kattintásakor a JS motor sima függvényként hívja meg (kontextus nélkül), így a 'this' undefined lesz. Ezért kell bind vagy arrow function.";
    }
    return "Nevezd meg a 'React.ComponentType' típust a szóbeli feleletedben! Ezzel jelzed a vizsgáztatónak, hogy tisztában vagy a TypeScript típusrendszerével és a komponensek típusos paraméterezésével a generikus Listáknál.";
  }
  if (topicId === 10) {
    if (questionIdx === 0) {
      return "A 'hookok szabályai' (Rules of Hooks) kulcsfontosságú tétel. Mindig említsd meg: (1) Csak a legfelső szinten hívhatók (nem lehet if, for, callback); (2) Csak React függvénykomponensekből vagy egyéni (custom) hookokból hívhatók meg. Ez a fix hívási sorrend miatt van.";
    }
    return "A 'mounted flag' egy klasszikus mintafeladat a BME laborokon. Magyarázd el a vizsgáztatónak: a React 18 Concurrent módjában a komponensek még könnyebben unmountolódhatnak adatlekérés közben, ezért ez a minta elengedhetetlen a stabil, hibaüzenet-mentes kódfutáshoz.";
  }
  if (topicId === 11) {
    if (questionIdx === 0) {
      return "Plusz pont jár, ha tudod: az Android NEM szabványos Java bytecode-ot futtat. A fordító Dalvik bytecode-ot készít a classes.dex-be, amit régen a Dalvik, ma az ART (Android Runtime) hajt végre. Említsd meg azt is, hogy az apk visszafejthető (dex2jar), ezért éles appnál obfuszkálni érdemes.";
    }
    return "A vizsgáztató kedvenc 'csapdája': melyik komponenst NEM kötelező a Manifestben deklarálni? A válasz a Broadcast Receiver, mert az kódból (registerReceiver) is regisztrálható, sőt bizonyos eseményekre (pl. TIME_TICK) csak így. A többi (Activity, Service, Content Provider) láthatatlan a rendszernek Manifest-bejegyzés nélkül.";
  }
  if (topicId === 12) {
    if (questionIdx === 0) {
      return "A leggyakoribb buktató az A->B váltás sorrendje. Hangsúlyozd: NEM A.onStop() fut le először! A sorrend A.onPause() -> B.onCreate/onStart/onResume -> A.onStop(). Ebből következik a gyakorlati szabály: ha B az A adatát olvassa, a mentésnek A.onPause()-ában kell megtörténnie, nem onStop()-ban.";
    }
    return "Ne keverd össze: az onSaveInstanceState() Bundle-jébe CSAK átmeneti UI-állapot való (pl. egy félig beírt szöveg), NEM perzisztens adat (az DB/SharedPreferences). Említsd meg, hogy a Vissza gombnál nincs onSaveInstanceState, mert ott a felhasználó szándékosan zárja be az Activity-t.";
  }
  if (topicId === 13) {
    if (questionIdx === 0) {
      return "Az R.java-t soha nem szabad kézzel szerkeszteni – ezt mindig mondd ki. A vizsgáztató szereti megkérdezni: mi történik, ha hiányzik a lokalizált erőforrás? A rendszer az alapértelmezett (minősítő nélküli) res/values-ra esik vissza, ezért ennek mindig teljesnek kell lennie.";
    }
    return "A Fragmentnél a kulcs az onCreateView és a View binding élettartama: a binding CSAK onCreateView és onDestroyView között érvényes, ezért onDestroyView-ban nullázni kell (memóriaszivárgás ellen). A kommunikációnál nevezd meg az 'Activity mint közvetítő' + interfész mintát.";
  }
  if (topicId === 14) {
    if (questionIdx === 0) {
      return "A Room kapcsán emeld ki: ez csak egy absztrakciós réteg az SQLite FÖLÖTT, nem külön adatbázis. A három annotáció (@Entity, @Dao, @Database) fordításidőben generál kódot, ezért fordításkor ellenőrzi az SQL-t is. A DB-műveletet mindig háttérszálon kell végezni.";
    }
    return "A RecyclerView-nál a varázsszó a 'ViewHolder minta' és az 'újrahasznosítás'. Mondd el: a kigörgetett sor view-ját nem dobja el, hanem újra felhasználja, és csak az adatot köti be újra (onBindViewHolder), így nincs folyamatos findViewById. A külső adatmegosztáshoz a Content Provider az ajánlott (nem a világ-módú fájl).";
  }
  if (topicId === 15) {
    if (questionIdx === 0) {
      return "Két dolgot kell összekötni: (1) a hosszú hálózati hívás a fő szálon ANR-t okoz (~5 mp), ezért háttérszálra kell tenni; (2) DE a UI-t csak a fő szálból szabad módosítani, ezért az eredménnyel vissza kell térni (runOnUiThread / Retrofit Callback / Coroutine Main). A két irányt sokan összekeverik.";
    }
    return "Az engedélyeknél a kulcs a 2015-ös (Android 6 / API 23) váltás: előtte telepítéskor mind, utána a VESZÉLYES engedélyeket futásidőben. Sorold fel a 4-5 lépést (checkSelfPermission -> rationale -> requestPermissions -> onRequestPermissionsResult), és hogy a user bármikor visszavonhatja a beállításokban.";
  }
  if (topicId === 16) {
    if (questionIdx === 0) {
      return "A Recompositionnél a 'miért hatékony' a lényeg: NEM a teljes felületet rajzolja újra, csak azt a Composable-t, ami a megváltozott állapotot használja. Kösd be az 5 szabályt (tetszőleges sorrend, párhuzamosság, kihagyás, optimista/megszakítható, gyakori futás) és az ebből fakadó követelményt: idempotens, mellékhatás-mentes Composable-ek.";
    }
    return "A háttérfolyamatoknál állítsd szembe a Thread-et (drága) a Coroutine-nal (olcsó, szekvenciálisan írt aszinkron kód). Nevezd meg a Dispatchereket (IO/Default/Main) és a viewModelScope-ot. A Flow-nál a kulcsmondat: a suspend EGY értéket ad vissza, a Flow TÖBBET emittál egymás után (producer -> collect a consumernél).";
  }
  return "";
}
