import React from 'react';
// FIX: Import the JSX type from react to resolve the "Cannot find namespace 'JSX'" error.
import type { JSX } from 'react';

export const MageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14a1 1 0 0 1 .6-.9l5.5-2.8a1 1 0 0 0 0-1.8L4.6 5.9A1 1 0 0 1 4 5V4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1h1a1 1 0 0 1 1 1v1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9a1 1 0 0 1-1-1H6a1 1 0 0 1-1-1v-.5L2 9.4a1 1 0 0 0 0 1.8l2.5 1.3A1 1 0 0 1 4 13v1z" />
    <path d="M15 6a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V6zM9 20a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1z" />
    <path d="M15 13a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1z" />
  </svg>
);

export const RogueIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.4 2.6 5 11l-3 3 3 3 11-8.4" />
    <path d="m5 11 3 3" />
    <path d="M17.8 15.8 21 19l-3 3-3.2-3.2" />
    <path d="m15.8 17.8 3-3" />
  </svg>
);

export const ArtisanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="m10 14 2 2 4-4" />
  </svg>
);

export const PythonIcon = () => <img src="https://www.python.org/static/favicon.ico" alt="Python" className="h-8 w-8" />;
export const CSharpIcon = () => <div className="h-8 w-8 bg-purple-600 text-white flex items-center justify-center rounded-md font-bold text-lg">C#</div>;
export const CppIcon = () => <div className="h-8 w-8 bg-blue-700 text-white flex items-center justify-center rounded-md font-bold text-sm">C++</div>;
export const PhpIcon = () => <div className="h-8 w-8 bg-indigo-400 text-white flex items-center justify-center rounded-md font-bold text-sm">PHP</div>;
export const HtmlCssIcon = () => <div className="h-8 w-8 bg-orange-500 text-white flex items-center justify-center rounded-md font-bold text-sm">5</div>;
export const IdaProIcon = () => <div className="h-8 w-8 bg-red-600 text-white flex items-center justify-center rounded-md font-bold text-sm">IDA</div>;

export const StatIcon = ({ icon }: { icon: string }) => {
    const icons: { [key: string]: JSX.Element } = {
        intelligence: <path d="M12 2a2 2 0 0 0-2 2c0 .3.1.6.2.9L8 8.1V9c0 1.1-.9 2-2 2H3c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-.9l2.2-3.2c.1.3.2.6.2.9a2 2 0 1 0 4 0c0-.3-.1-.6-.2-.9l2.2 3.2v.9c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2-2v-.9l-2.2-3.2c-.1.3-.2.6-.2.9a2 2 0 0 0-2-2z" />,
        dexterity: <path d="m12 14 4-4" /><path d="M16 10h5v5" /><path d="M16 10s-2 2-4 4-4 4-4 4" /><path d="M8 14s-2 2-4 4-4 4-4 4h5v-5" />,
        stamina: <path d="M13 10h4.5a2.5 2.5 0 0 0 0-5H13V2a1 1 0 0 0-2 0v3H6.5a2.5 2.5 0 0 0 0 5H11v10a1 1 0 0 0 2 0v-5z" />,
        lore: <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />,
    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icons[icon]}
        </svg>
    );
};
