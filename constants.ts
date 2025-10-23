
import type { PlayerClass, LearningPath } from './types';
import { MageIcon, RogueIcon, ArtisanIcon, PythonIcon, CSharpIcon, CppIcon, PhpIcon, HtmlCssIcon, IdaProIcon } from './components/icons';
import React from 'react';

export const PLAYER_CLASSES: PlayerClass[] = [
  {
    id: 'mage',
    name: 'Mage',
    description: 'Masters of logic and abstraction, Mages excel at complex algorithms and data structures.',
    pros: 'High Intelligence & Lore. Gains bonus XP from algorithm-heavy quests.',
    cons: 'Low Stamina. Debugging complex logical errors can be mentally taxing.',
    baseStats: { intelligence: 15, dexterity: 8, stamina: 7, lore: 10 },
    icon: React.createElement(MageIcon),
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description: 'Swift and precise, Rogues are experts in scripting, automation, and finding clever shortcuts.',
    pros: 'High Dexterity. Excels at writing clean, efficient code quickly.',
    cons: 'Low Lore. May overlook deeper theoretical concepts.',
    baseStats: { intelligence: 10, dexterity: 15, stamina: 8, lore: 7 },
    icon: React.createElement(RogueIcon),
  },
  {
    id: 'artisan',
    name: 'Artisan',
    description: 'Patient and thorough builders, Artisans create robust, well-documented, and maintainable systems.',
    pros: 'High Stamina. Can work on large codebases for long periods without burnout.',
    cons: 'Low Dexterity. Slower initial development speed due to meticulous planning.',
    baseStats: { intelligence: 8, dexterity: 7, stamina: 15, lore: 10 },
    icon: React.createElement(ArtisanIcon),
  },
];

export const LEARNING_PATHS: LearningPath[] = [
  { id: 'python', name: 'Python', description: 'The versatile language of serpents, ideal for scripting, data science, and web backends.', icon: React.createElement(PythonIcon) },
  { id: 'csharp', name: 'C#', description: 'The structured language of the .NET kingdom, perfect for game development and enterprise applications.', icon: React.createElement(CSharpIcon) },
  { id: 'cpp', name: 'C++', description: 'The ancient and powerful language, offering raw performance for systems programming and high-frequency trading.', icon: React.createElement(CppIcon) },
  { id: 'php', name: 'PHP', description: 'The pragmatic language that powers a vast portion of the web, known for its straightforwardness.', icon: React.createElement(PhpIcon) },
  { id: 'html_css', name: 'HTML & CSS', description: 'The twin arts of structure and style, the foundation of all web sorcery.', icon: React.createElement(HtmlCssIcon) },
  { id: 'ida_pro', name: 'IDA Pro', description: 'The arcane art of reverse engineering, deciphering the secrets of compiled binaries.', icon: React.createElement(IdaProIcon) },
];

export const XP_PER_LEVEL = 100;
export const POINTS_PER_LEVEL = 2;
