import React from 'react';
import { BookOpenIcon, CogIcon, CodeBracketIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { Page } from '../page';
import { Box } from '@chakra-ui/react';

const Sidebar = () => {
  return (
        <Box w="56" bg="lighterBlack" borderRight="solid 2px" borderColor="neutral" className="border-r border-gray-200 p-6 pb-0">
            <h2 className="text-xl font-semibold mb-6">Documentation</h2>
            <nav>
                <ul className="space-y-4">
                <li>
                    <div onClick={() => window.location.href = `/docs?page=${Page.CreatingExams}`} className="flex items-center hover:cursor-pointer">
                        <BookOpenIcon className="w-5 h-5 mr-2" />
                        Creating Exams
                    </div>
                </li>
                <li>
                    <div onClick={() => window.location.href = `/docs?page=${Page.SettingUpRewards}`} className="flex items-center hover:cursor-pointer">
                        <CogIcon className="w-5 h-5 mr-2" />
                        Setting Up Rewards
                    </div>
                </li>
                <li>
                    <div onClick={() => window.location.href = `/docs?page=${Page.CustomRewards}`} className="flex items-center hover:cursor-pointer">
                        <CodeBracketIcon className="w-5 h-5 mr-2" />
                        Custom Rewards
                    </div>
                </li>
                <li>
                    <div onClick={() => window.location.href = `/docs?page=${Page.VideoTutorials}`} className="flex items-center hover:cursor-pointer">
                        <VideoCameraIcon className="w-5 h-5 mr-2" />
                        Video Tutorials
                    </div>
                </li>
                </ul>
            </nav>
        </Box>
    );
};

export default Sidebar;