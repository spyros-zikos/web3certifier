'use client';

import React, { useState } from 'react';
import Sidebar from './_components/Sidebar';
import CreatingExams from './_components/CreatingExams';
import SettingUpRewards from './_components/SettingUpRewards';
import CustomRewards from './_components/CustomRewards';
import VideoTutorials from './_components/VideoTutorials';
import { useSearchParams } from 'next/navigation';

export enum Page {
    CreatingExams = "creating_exams",
    SettingUpRewards = "setting_up_rewards",
    CustomRewards = "custom_rewards",
    VideoTutorials = "video_tutorials",
}

const DocsPage = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || Page.CreatingExams;

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-8">
                {page === Page.CreatingExams && <CreatingExams />}
                {page === Page.SettingUpRewards && <SettingUpRewards />}
                {page === Page.CustomRewards && <CustomRewards />}
                {page === Page.VideoTutorials && <VideoTutorials />}
            </div>
        </div>
    );
};

export default DocsPage;