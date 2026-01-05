'use client';
import React, { useEffect, useState } from 'react';
import { Trophy, Ban, Gift, Lock, CheckCircle2 } from 'lucide-react';
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import { useNonUndefinedAccount } from '~~/utils/NonUndefinedAccount';
import { wagmiReadFromContractAsync } from '~~/utils/wagmi/wagmiReadAsync';
import { ZERO_ADDRESS } from '~~/constants';
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite';
import { Timer } from '../exam_page/_components';
import getTimeLeft from '../../utils/GetTimeLeft';
import { Spinner } from '~~/components';

export default function MilestoneRoadmap() {
    const TEST = false;

    const [mockProgress, setMockProgress] = useState(0n);
    const [xpPrizes, setXpPrizes] = useState<any>([]);
    const [claimedXpPrizes, setClaimedXpPrizes] = useState<any>([]);
    const [timeNow, setTimeNow] = useState(Date.now());

    const { address, chain } = useNonUndefinedAccount();
    
    const userXP: bigint = wagmiReadFromContract({
        functionName: "getUserXp",
        args: [address],
    }).data;
    const currentProgress = TEST ? mockProgress : (userXP ? userXP : 0n);

    const xpPoints: bigint[] = wagmiReadFromContract({
        contractName: "XpPrizes",
        functionName: "getXpPoints",
    }).data;

    const prizeTokenAddress: string = wagmiReadFromContract({
        contractName: "XpPrizes",
        functionName: "getPrizeToken",
    }).data;

    const tokenSymbol: string  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: prizeTokenAddress ? prizeTokenAddress : ZERO_ADDRESS,
        functionName: "symbol",
    }).data;

    const expirationTimestamp: bigint = wagmiReadFromContract({
        contractName: "XpPrizes",
        functionName: "getExpirationTimestamp",
    }).data;

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeNow(Date.now());
        }, 1000); // update every second
    
        return () => clearInterval(interval); // cleanup
    }, []);

    useEffect(() => {
        (async () => {
            if (!xpPoints) {
                return;
            }
            const xpPrizes: any = [];
            const claimedXpPrizes: any = [];
            for (let i = 0; i < xpPoints.length; i++) {
                const xpPrize = await wagmiReadFromContractAsync({
                    contractName: "XpPrizes",
                    functionName: "getXpPrize",
                    args: [xpPoints[i]],
                    chainId: chain?.id
                });
                xpPrizes.push(xpPrize);
                const claimed = await wagmiReadFromContractAsync({
                    contractName: "XpPrizes",
                    functionName: "getUserHasClaimed",
                    args: [address, xpPoints[i]],
                    chainId: chain?.id
                });
                if (claimed) claimedXpPrizes.push(xpPoints[i]);
            }
            setXpPrizes(xpPrizes);
            setClaimedXpPrizes(claimedXpPrizes);
        })();
    }, [xpPoints]);

    const getMilestoneStatus = (index: any) => {
        if (claimedXpPrizes.includes(xpPoints[index])) return 'claimed';
        if (xpPrizes[index]?.availablePrizes <= 0) return 'notAvailable';
        if (currentProgress >= xpPoints[index]) return 'available';
        return 'locked';
    };

    const { writeContractAsync: claim } = wagmiWriteToContract();
    function handleClaim(index: number) {
        try {
            claim({
                contractName: 'XpPrizes',
                functionName: 'claim',
                args: [xpPoints[index]],
            });
        } catch (error) {
            console.error("Error claiming xp:", error);
        }
    }

    const progressPercentage = (Number(currentProgress) / 100) * 100;

    if (userXP === undefined || xpPoints === undefined) return <Spinner />
    
    return (
        <div className="min-h-screen bg-base-200 p-8">
            <style>{`
                .animate-scale-pulse {
                    animation: scalePulse 1.5s ease-in-out infinite;
                }
                
                @keyframes scalePulse {
                    0% {
                    transform: scale(1);
                    }
                    50% {
                    transform: scale(1.1);
                    }
                    100% {
                    transform: scale(1);
                    }
                }
            `}</style>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-neutral mb-4">Your Journey <div className="text-base-300 inline">(Beta)</div></h1>
                    <p className="text-neutral mb-6">Track your progress and unlock amazing prizes!</p>
                    
                    <div className="bg-secondary rounded-lg p-6 shadow-lg my-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-base-100">Current Points</span>
                            <span className="text-2xl font-bold text-base-100">{currentProgress.toString()}/{xpPoints ? xpPoints[xpPoints.length - 1].toString() : 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div 
                                className="bg-base-100 h-full rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        
                        {TEST && <div className="mt-6 flex gap-3 justify-center">
                            <button
                                onClick={() => setMockProgress(BigInt(Math.min(100, Number(currentProgress) + 10)))}
                            >
                                Add 10
                            </button>
                            <button
                                onClick={() => setMockProgress(BigInt(Math.max(0, Number(currentProgress) - 10)))}
                            >
                                Remove 10
                            </button>
                        </div>}
                    </div>
                </div>

                {expirationTimestamp && 
                <div className="mb-12 w-[60%] mx-auto">
                    <Timer 
                        message="Time Left" 
                        timeLeft={getTimeLeft(timeNow, expirationTimestamp)}
                        bgColor={"lighterBlack"}
                    />
                </div>}

                <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-base-100" />
                    
                    <div className="space-y-8">
                        {xpPrizes.map((xpPrize: any, index: number) => {
                        const status = getMilestoneStatus(index);
                        
                        return (
                            <div key={index} className="relative flex items-start gap-6">
                                <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                                    status === 'claimed' ? 'bg-primary' 
                                    : status === 'notAvailable' ? 'bg-base-300'
                                    : status === 'available' ? 'bg-base-100'
                                    : 'bg-base-300'
                                }`}>
                                    {status === 'claimed' ? <CheckCircle2 className="w-8 h-8" />
                                    : status === 'notAvailable' ? <Ban className="w-8 h-8 text-base-200" />
                                    : status === 'locked' ? <Lock className="w-8 h-8 text-base-200" />
                                    : <Trophy className="w-8 h-8 animate-scale-pulse inline-block" onClick={() => handleClaim(index)} />}
                                </div>

                                <div className={`flex-1 bg-neutral rounded-xl shadow-lg p-6 ${
                                    status === 'available' ? 'border-2 border-base-100' : ''
                                }`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-base-200">{xpPrize?.title}</h3>
                                            <p className="text-base-300">{xpPrize?.description}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            status === 'claimed' ? 'bg-primary text-neutral'
                                            : status === 'notAvailable' ? 'bg-base-300 text-neutral'
                                            : status === 'available' ? 'bg-base-100 text-neutral'
                                            : 'bg-base-300 text-neutral'
                                        }`}>
                                            {xpPoints[index].toString()} pts
                                        </span>
                                    </div>
                                    
                                    <div className="mt-4 flex items-center gap-2">
                                        <Gift className={`w-5 h-5 ${
                                            status === 'claimed' ? 'text-primary' :
                                            status === 'available' ? 'text-base-100'
                                            : 'text-base-300'
                                        }`} />
                                        <span className={`font-medium ${
                                            status === 'claimed' ? 'text-primary' :
                                            status === 'available' ? 'text-base-100'
                                            : 'text-base-300'
                                        }`}>
                                            Prize: {(xpPrize?.prizeAmount/BigInt(1e18)).toString()} {tokenSymbol} ({xpPrize?.availablePrizes.toString()} left)
                                        </span>
                                        {status === 'claimed' && (
                                            <span className="ml-auto text-primary font-semibold">✓ Claimed!</span>
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
                        🎉 {xpPrizes.filter((_: any, i: any) => currentProgress >= xpPoints[i]).length} of {xpPrizes.length} Milestones Completed!
                        </h3>
                        <p className="text-neutral">
                        {currentProgress >= ((xpPrizes && xpPrizes.length >= 1) ? xpPoints[xpPrizes.length - 1] : 0)
                            ? "Congratulations! You've completed all milestones!" 
                            : `Keep going! ${(xpPoints[xpPrizes.length - 1] - currentProgress).toString()} points until the final milestone.`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}