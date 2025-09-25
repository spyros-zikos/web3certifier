import { wagmiReadFromContractAsync } from "~~/utils/wagmi/wagmiReadAsync";

export async function getScoresOfUsersWithStatus(
    chainId: number,
    examId: number,
    isValidStatus: (status: any) => boolean
) {
    const exam: Exam | undefined = await wagmiReadFromContractAsync({
        functionName: "getExam",
        args: [BigInt(examId)],
        chainId: chainId || 11155111
    }) as any;

    const usersThatSucceededOrFailed: any[] = [];

    if (exam)
        for (const user of exam.users) {
            const status = await wagmiReadFromContractAsync({
                functionName: "getUserStatus",
                args: [user, BigInt(examId)],
                chainId: chainId || 11155111
            }) as any;
            if (isValidStatus(status)) usersThatSucceededOrFailed.push(user);
        }
    
    if (usersThatSucceededOrFailed.length == 0) return 0;

    const scores: number[] = [];
    
    for (const user of usersThatSucceededOrFailed) {
        const score = await wagmiReadFromContractAsync({
            functionName: "getUserScore",
            args: [BigInt(examId), user],
            chainId: chainId || 11155111
        }) as any;
        scores.push(Number(score));
    }

    if (scores.length == 0) return 0;

    const avgScore = Number(scores.reduce((a, b) => Number(a) + Number(b), 0)) / scores.length;

    return avgScore;
}