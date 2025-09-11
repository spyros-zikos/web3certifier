import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const CustomRewards: React.FC = () => {
  return (
    <div>
      <h1 className="text-red-500 text-4xl font-bold mb-6">Coming Soon!</h1>
      <h2 className="text-2xl font-semibold mb-4">Setting Up Custom Rewards through Foundry Repository</h2>
      <p className="mb-4">Placeholder introduction text about custom rewards requiring coding.</p>
      <ol className="list-decimal pl-6 space-y-2">
        <li className="flex items-center">
          <ChevronRightIcon className="w-4 h-4 mr-2" />
          Step 1: Clone the repository - placeholder.
        </li>
        <li className="flex items-center">
          <ChevronRightIcon className="w-4 h-4 mr-2" />
          Step 2: Install dependencies - placeholder.
        </li>
        <li className="flex items-center">
          <ChevronRightIcon className="w-4 h-4 mr-2" />
          Step 3: Code custom criteria - placeholder.
        </li>
        <li className="flex items-center">
          <ChevronRightIcon className="w-4 h-4 mr-2" />
          Step 4: Deploy - placeholder.
        </li>
      </ol>
      <pre className="bg-gray-200 p-4 rounded mt-4">
        <code>// Placeholder code example</code>
      </pre>
    </div>
  );
};

export default CustomRewards;