import React, { useState, useCallback, useEffect } from 'react';
import type { PlayerClass, LearningPath, GameStage, Stats, Lesson, CompletedQuest } from './types';
import { PLAYER_CLASSES, LEARNING_PATHS, XP_PER_LEVEL, POINTS_PER_LEVEL } from './constants';
import { generateLesson, evaluateCode } from './services/geminiService';

// --- Helper Components (Defined outside App to prevent re-creation on re-renders) ---

interface ClassCardProps {
  playerClass: PlayerClass;
  onSelect: (playerClass: PlayerClass) => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ playerClass, onSelect }) => (
  <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6 hover:border-purple-500 hover:scale-105 transition-all duration-300 cursor-pointer text-center flex flex-col items-center shadow-lg">
    {playerClass.icon}
    <h3 className="text-2xl font-bold mt-4 text-purple-400">{playerClass.name}</h3>
    <p className="mt-2 text-sm text-gray-400 h-16">{playerClass.description}</p>
    <div className="text-left mt-4 w-full text-xs">
      <p><strong className="text-green-400">Pros:</strong> {playerClass.pros}</p>
      <p className="mt-1"><strong className="text-red-400">Cons:</strong> {playerClass.cons}</p>
    </div>
    <button onClick={() => onSelect(playerClass)} className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
      Choose {playerClass.name}
    </button>
  </div>
);

interface PathCardProps {
    path: LearningPath;
    onSelect: (path: LearningPath) => void;
}

const PathCard: React.FC<PathCardProps> = ({ path, onSelect }) => (
    <div 
        onClick={() => onSelect(path)}
        className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6 hover:border-amber-500 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center text-center shadow-lg h-full"
    >
        <div className="flex items-center justify-center h-16 w-16">{path.icon}</div>
        <h3 className="text-2xl font-bold mt-4 text-amber-400">{path.name}</h3>
        <p className="mt-2 text-sm text-gray-400 flex-grow">{path.description}</p>
        <button className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            Begin Path
        </button>
    </div>
);

// --- Main App Component ---

export default function App() {
  const [gameStage, setGameStage] = useState<GameStage>('classSelection');
  const [playerClass, setPlayerClass] = useState<PlayerClass | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [playerStats, setPlayerStats] = useState<Stats | null>(null);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<CompletedQuest[]>([]);

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean | null } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClassSelect = (selectedClass: PlayerClass) => {
    setPlayerClass(selectedClass);
    setPlayerStats(selectedClass.baseStats);
    setGameStage('pathSelection');
  };

  const handlePathSelect = (selectedPath: LearningPath) => {
    setLearningPath(selectedPath);
    setGameStage('learning');
  };
  
  const fetchNextLesson = useCallback(async () => {
      if (!learningPath) return;
      setIsLoading(true);
      setFeedback(null);
      setUserCode('');
      const lesson = await generateLesson(learningPath.name, level);
      setCurrentLesson(lesson);
      setIsLoading(false);
  }, [learningPath, level]);

  useEffect(() => {
    if (gameStage === 'learning' && !currentLesson && !isLoading) {
      fetchNextLesson();
    }
  }, [gameStage, currentLesson, isLoading, fetchNextLesson]);

  const handleSubmitCode = async () => {
    if (!learningPath || !currentLesson) return;
    setIsLoading(true);
    const result = await evaluateCode(learningPath.name, currentLesson.task, userCode);
    setFeedback({ message: result.feedback, isCorrect: result.isCorrect });

    if (result.isCorrect) {
        const xpGained = 20 + (playerStats?.lore || 0);
        
        const newQuest: CompletedQuest = {
            title: currentLesson.title,
            xpGained: xpGained,
        };
        setCompletedQuests(prev => [...prev, newQuest]);

        const newXp = xp + xpGained;
        if (newXp >= XP_PER_LEVEL) {
            setLevel(level + 1);
            setXp(newXp % XP_PER_LEVEL);
            setAvailablePoints(prev => prev + POINTS_PER_LEVEL);
            setGameStage('levelUp');
        } else {
            setXp(newXp);
        }
    }
    setIsLoading(false);
  };
  
  const handleNextQuest = () => {
    setFeedback(null);
    setCurrentLesson(null); // This will trigger the useEffect to fetch the next lesson
  }

  const renderContent = () => {
    switch (gameStage) {
      case 'classSelection':
        return (
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-2">CodeQuest RPG</h1>
                <p className="text-xl text-gray-400 mb-10">Choose Your Archetype, Adventurer</p>
                <div className="grid md:grid-cols-3 gap-8">
                    {PLAYER_CLASSES.map(pc => <ClassCard key={pc.id} playerClass={pc} onSelect={handleClassSelect} />)}
                </div>
            </div>
        );
      case 'pathSelection':
        return (
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-2">Select Your Path</h1>
                <p className="text-xl text-gray-400 mb-10">The journey of a thousand lines begins with a single language.</p>
                <div className="grid md:grid-cols-3 gap-8">
                    {LEARNING_PATHS.map(path => <PathCard key={path.id} path={path} onSelect={handlePathSelect} />)}
                </div>
            </div>
        );
      case 'learning':
         return (
            <div className="grid lg:grid-cols-3 gap-6 h-full">
                <CharacterSheet stats={playerStats} level={level} xp={xp} playerClass={playerClass} completedQuests={completedQuests} />
                <main className="lg:col-span-2 bg-gray-800/50 p-6 rounded-lg border border-gray-700 backdrop-blur-sm flex flex-col">
                    {isLoading && !currentLesson && <div className="text-center p-10"><h2 className="text-2xl animate-pulse">Summoning a new quest...</h2></div>}
                    {currentLesson && (
                        <>
                            <h2 className="text-3xl font-bold text-amber-300">{currentLesson.title}</h2>
                            <p className="mt-4 text-gray-300 italic">"{currentLesson.narrative}"</p>
                            <p className="mt-4 text-gray-200 font-bold">Your Task:</p>
                            <p className="text-gray-300">{currentLesson.task}</p>
                            {currentLesson.exampleCode && (
                                <div className="mt-4 bg-gray-900 p-3 rounded-md border border-gray-600">
                                    <p className="text-sm text-gray-400 mb-2">An ancient scroll reveals an example:</p>
                                    <pre className="font-code text-cyan-300 text-sm"><code>{currentLesson.exampleCode}</code></pre>
                                </div>
                            )}
                            <textarea
                                value={userCode}
                                onChange={e => setUserCode(e.target.value)}
                                placeholder="Inscribe your solution here..."
                                className="font-code w-full h-48 mt-4 bg-gray-900 p-4 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white flex-grow"
                                disabled={isLoading || feedback?.isCorrect === true}
                            />
                            {feedback && (
                                <div className={`mt-4 p-4 rounded-md border ${feedback.isCorrect ? 'bg-green-900/50 border-green-500' : 'bg-red-900/50 border-red-500'}`}>
                                    <p className="font-bold">{feedback.isCorrect ? 'Success!' : 'A Setback...'}</p>
                                    <p>{feedback.message}</p>
                                </div>
                            )}

                            <div className="mt-auto pt-4">
                                {feedback?.isCorrect ? (
                                     <button onClick={handleNextQuest} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                                        Embark on Next Quest!
                                    </button>
                                ) : (
                                    <button onClick={handleSubmitCode} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                                        {isLoading ? 'The Oracle is thinking...' : 'Submit to the Oracle'}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        );
      case 'levelUp':
        return <LevelUpModal 
                    level={level} 
                    points={availablePoints} 
                    stats={playerStats!} 
                    onConfirm={(newStats) => {
                        setPlayerStats(newStats);
                        setAvailablePoints(0);
                        setCurrentLesson(null); // Get new quest
                        setGameStage('learning');
                    }} 
                />
      default:
        return <div>Error: Unknown game state.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] p-4 sm:p-8">
        <div className="container mx-auto max-w-7xl h-full">
            {renderContent()}
        </div>
    </div>
  );
}

// --- Character Sheet Component ---
import { StatIcon } from './components/icons';

interface CharacterSheetProps {
    stats: Stats | null;
    level: number;
    xp: number;
    playerClass: PlayerClass | null;
    completedQuests: CompletedQuest[];
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ stats, level, xp, playerClass, completedQuests }) => {
    if (!stats || !playerClass) return null;

    const xpPercentage = (xp / XP_PER_LEVEL) * 100;

    return (
        <aside className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 backdrop-blur-sm self-start">
            <h2 className="text-2xl font-bold text-center text-purple-300">{playerClass.name} Adept</h2>
            <div className="text-center text-gray-400">Level {level}</div>
            
            <div className="mt-4">
                <p className="text-sm text-gray-400">XP: {xp} / {XP_PER_LEVEL}</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                    <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: `${xpPercentage}%` }}></div>
                </div>
            </div>

            <h3 className="mt-6 font-bold border-b border-gray-600 pb-1 mb-3 text-lg text-gray-300">Attributes</h3>
            <ul className="space-y-2">
                {Object.entries(stats).map(([key, value]) => (
                    <li key={key} className="flex items-center capitalize text-gray-300">
                        <StatIcon icon={key} /> {key}: <span className="font-bold ml-auto text-white">{value}</span>
                    </li>
                ))}
            </ul>

            <h3 className="mt-6 font-bold border-b border-gray-600 pb-1 mb-3 text-lg text-gray-300">Quest Log</h3>
            {completedQuests.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {completedQuests.slice().reverse().map((quest, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-700/50 rounded-md">
                            <p className="font-bold text-amber-300">{quest.title}</p>
                            <p className="text-xs text-gray-400">Reward: {quest.xpGained} XP</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 italic">No quests completed yet.</p>
            )}
        </aside>
    );
};


// --- Level Up Modal Component ---

interface LevelUpModalProps {
    level: number;
    points: number;
    stats: Stats;
    onConfirm: (newStats: Stats) => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, points, stats, onConfirm }) => {
    const [currentPoints, setCurrentPoints] = useState(points);
    const [tempStats, setTempStats] = useState<Stats>(stats);

    const handleStatChange = (stat: keyof Stats, amount: number) => {
        if (amount > 0 && currentPoints > 0) {
            setTempStats(prev => ({ ...prev, [stat]: prev[stat] + amount }));
            setCurrentPoints(prev => prev - amount);
        } else if (amount < 0 && tempStats[stat] > stats[stat]) {
            setTempStats(prev => ({ ...prev, [stat]: prev[stat] + amount }));
            setCurrentPoints(prev => prev - amount);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-gray-800 border-2 border-amber-400 rounded-xl p-8 max-w-md w-full text-center shadow-2xl shadow-amber-500/10">
                <h1 className="text-4xl font-bold text-amber-300">Level Up!</h1>
                <p className="text-lg mt-2 text-gray-300">You have reached Level {level}!</p>
                <p className="mt-4 text-gray-200">You have <span className="font-bold text-2xl text-green-400">{currentPoints}</span> attribute points to distribute.</p>

                <div className="mt-6 space-y-3 text-left">
                    {Object.entries(tempStats).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
                            <span className="capitalize font-bold text-lg flex items-center"><StatIcon icon={key} /> {key}</span>
                            <div className="flex items-center gap-3">
                                <button onClick={() => handleStatChange(key as keyof Stats, -1)} disabled={tempStats[key as keyof Stats] <= stats[key as keyof Stats]} className="font-bold text-xl bg-gray-600 rounded-full h-8 w-8 disabled:opacity-50">-</button>
                                <span className="font-bold text-xl w-8 text-center">{value}</span>
                                <button onClick={() => handleStatChange(key as keyof Stats, 1)} disabled={currentPoints <= 0} className="font-bold text-xl bg-gray-600 rounded-full h-8 w-8 disabled:opacity-50">+</button>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => onConfirm(tempStats)} 
                    disabled={currentPoints > 0}
                    className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
                    {currentPoints > 0 ? `Distribute all ${currentPoints} points` : 'Confirm and Continue'}
                </button>
            </div>
        </div>
    );
};