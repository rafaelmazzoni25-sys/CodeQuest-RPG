
import type { JSX } from 'react';

export interface Stats {
  intelligence: number;
  dexterity: number;
  stamina: number;
  lore: number;
}

export interface PlayerClass {
  id: 'mage' | 'rogue' | 'artisan';
  name: string;
  description: string;
  pros: string;
  cons: string;
  baseStats: Stats;
  icon: JSX.Element;
}

export interface LearningPath {
  id: 'python' | 'csharp' | 'cpp' | 'php' | 'html_css' | 'ida_pro';
  name: string;
  description: string;
  icon: JSX.Element;
}

export interface Lesson {
  title: string;
  narrative: string;
  task: string;
  exampleCode?: string;
}

export interface EvaluationResult {
  isCorrect: boolean;
  feedback: string;
}

export type GameStage = 'classSelection' | 'pathSelection' | 'learning' | 'levelUp';
