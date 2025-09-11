import React from 'react';
import { PlayIcon } from '@heroicons/react/24/outline';

const VideoTutorials: React.FC = () => {
  return (
    <div>
      <h1 className="text-red-500 text-4xl font-bold mb-6">Coming Soon!</h1>
      <h2 className="text-2xl font-semibold mb-4">Video Tutorials</h2>
      <p className="mb-4">Placeholder text about video tutorials.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Tutorial 1: Creating Exams</h3>
          <a href="#" className="flex items-center text-blue-600 hover:underline">
            <PlayIcon className="w-5 h-5 mr-2" />
            Watch Video
          </a>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Tutorial 2: Setting Up Rewards</h3>
          <a href="#" className="flex items-center text-blue-600 hover:underline">
            <PlayIcon className="w-5 h-5 mr-2" />
            Watch Video
          </a>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2">Tutorial 3: Custom Rewards</h3>
          <a href="#" className="flex items-center text-blue-600 hover:underline">
            <PlayIcon className="w-5 h-5 mr-2" />
            Watch Video
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoTutorials;