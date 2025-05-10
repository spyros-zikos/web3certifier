interface Exam {
    id: bigint;
    name: string;
    description: string;
    endTime: bigint;
    questions: readonly string[];
    answers: string;
    price: bigint;
    baseScore: bigint;
    imageUrl: string;
    users: readonly string[];
    etherAccumulated: bigint;
    certifier: string;
    tokenIds: readonly bigint[];
    maxSubmissions: bigint;
    numberOfSubmissions: bigint;
    userClaimsWithPassword: boolean;
}