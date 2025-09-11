'use client';

import React from 'react';
import Sidebar from './_components/Sidebar';
import CreatingExams from './_components/CreatingExams';
import SettingUpRewards from './_components/SettingUpRewards';
import CustomRewards from './_components/CustomRewards';
import VideoTutorials from './_components/VideoTutorials';
import { useSearchParams } from 'next/navigation';
import { DocsPage } from '~~/types/DocsPage';


const Page = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || DocsPage.CreatingExams;

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-8">
                {page === DocsPage.CreatingExams && <CreatingExams />}
                {page === DocsPage.SettingUpRewards && <SettingUpRewards />}
                {page === DocsPage.CustomRewards && <CustomRewards />}
                {page === DocsPage.VideoTutorials && <VideoTutorials />}
            </div>
        </div>
    );
};

export default Page;