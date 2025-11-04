'use client';
import React, { useState } from 'react';
import { Trophy, Star, Gift, Lock, CheckCircle2 } from 'lucide-react';

export default function MilestoneRoadmap() {
    const [currentProgress, setCurrentProgress] = useState(0);

    const milestones = [
        {
            id: 1,
            title: "Getting Started",
            description: "Complete your profile",
            points: 10,
            prize: "Welcome Badge",
            icon: Star
        },
        {
            id: 2,
            title: "First Steps",
            description: "Complete 5 tasks",
            points: 25,
            prize: "Bronze Trophy",
            icon: Trophy
        },
        {
            id: 3,
            title: "Making Progress",
            description: "Reach 50 points",
            points: 50,
            prize: "Silver Badge",
            icon: Gift
        },
        {
            id: 4,
            title: "Going Strong",
            description: "Complete 20 tasks",
            points: 75,
            prize: "Gold Trophy",
            icon: Trophy
        },
        {
            id: 5,
            title: "Master Level",
            description: "Reach 100 points",
            points: 100,
            prize: "Diamond Crown",
            icon: Star
        }
    ];

    const getMilestoneStatus = (points: any) => {
        if (currentProgress >= points) return 'completed';
        if (currentProgress >= points - 15) return 'active';
        return 'locked';
    };

    const progressPercentage = (currentProgress / 100) * 100;

    return (
        <div className="min-h-screen bg-base-200 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-neutral mb-4">Your Journey</h1>
                    <p className="text-neutral mb-6">Track your progress and unlock amazing prizes!</p>
                    
                    <div className="bg-secondary rounded-lg p-6 shadow-lg mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-base-100">Current Points</span>
                            <span className="text-2xl font-bold text-base-100">{currentProgress}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div 
                                className="bg-base-100 h-full rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        
                        <div className="mt-6 flex gap-3 justify-center">
                            <button
                                onClick={() => setCurrentProgress(Math.min(100, currentProgress + 10))}
                                className="px-4 py-2 bg-base-100 text-white rounded-lg"
                            >
                                Add 10 Points
                            </button>
                            <button
                                onClick={() => setCurrentProgress(Math.max(0, currentProgress - 10))}
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                            >
                                Remove 10
                            </button>
                            <button
                                onClick={() => setCurrentProgress(0)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                            >
                                Reset
                            </button>
                        </div>

                    </div>
                </div>

                <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-base-100" />
                    
                    <div className="space-y-8">
                        {milestones.map((milestone, index) => {
                        const status = getMilestoneStatus(milestone.points);
                        const Icon = milestone.icon;
                        
                        return (
                            <div key={milestone.id} className="relative flex items-start gap-6">
                                <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                                    status === 'completed' 
                                    ? 'bg-primary' 
                                    : status === 'active'
                                    ? 'bg-base-100'
                                    : 'bg-base-300'
                                }`}>
                                    {status === 'completed' ? (
                                    <CheckCircle2 className="w-8 h-8" />
                                    ) : status === 'locked' ? (
                                    <Lock className="w-8 h-8 text-base-200" />
                                    ) : (
                                    <Icon className="w-8 h-8" />
                                    )}
                                </div>

                                <div className={`flex-1 bg-neutral rounded-xl shadow-lg p-6 ${
                                    status === 'active' ? 'border-2 border-base-100' : ''
                                }`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-base-200">{milestone.title}</h3>
                                            <p className="text-base-300">{milestone.description}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            status === 'completed'
                                            ? 'bg-primary text-neutral'
                                            : status === 'active'
                                            ? 'bg-base-100 text-neutral'
                                            : 'bg-base-300 text-neutral'
                                        }`}>
                                            {milestone.points} pts
                                        </span>
                                    </div>
                                    
                                    <div className="mt-4 flex items-center gap-2">
                                        <Gift className={`w-5 h-5 ${
                                            status === 'completed' ? 'text-primary' : 'text-base-300'
                                        }`} />
                                        <span className={`font-medium ${
                                            status === 'completed' ? 'text-primary' : 'text-base-300'
                                        }`}>
                                            Prize: {milestone.prize}
                                        </span>
                                        {status === 'completed' && (
                                            <span className="ml-auto text-primary font-semibold">✓ Unlocked!</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                        })}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <div className="bg-secondary rounded-lg p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-base-100 mb-2">
                        🎉 {milestones.filter(m => currentProgress >= m.points).length} of {milestones.length} Milestones Completed!
                        </h3>
                        <p className="text-neutral">
                        {currentProgress >= 100 
                            ? "Congratulations! You've completed all milestones!" 
                            : `Keep going! ${100 - currentProgress} points until the next milestone.`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}