'use client';

import { useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';

export default function Footer() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <footer
      className={`text-center text-sm py-6 border-t ${
        darkMode
          ? 'bg-gray-800 border-gray-700 text-gray-300'
          : 'bg-gray-50 border-gray-200 text-gray-600'
      }`}
    >
      <p>&copy; {new Date().getFullYear()} Money Manager. All rights reserved.</p>
    </footer>
  );
}
