
interface Exam {
    id: BigInt;
    name: string;
    description: string;
    endTime: BigInt;
    status: number;
    questions: readonly string[];
    answers: readonly BigInt[];
    price: BigInt;
    baseScore: BigInt;
    imageUrl: string;
    users: readonly string[];
    etherAccumulated: BigInt;
    certifier: string;
}