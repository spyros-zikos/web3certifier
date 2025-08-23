// 1. Checks if exam exists and is open
// 2. Checks if user is verified
// 3. Checks if user has alreay claimed by checking the database
// 4. Stores the address of the user in the database
// 5. Sends funds to user
import { NextResponse } from "next/server";
import { connectToDatabase } from "~~/services/mongodb";
import { wagmiReadFromContractAsync } from "~~/utils/wagmi/wagmiReadAsync";
import { sendFundsToUser } from "../../../helpers";

interface IFaucetRequestBody {
    chainId: number;
    examId: bigint;
    user: string;
}

export async function POST(request: Request) {
    let client;
    try {
        const { db, client: connectedClient } = await connectToDatabase();
        client = connectedClient;

        const body: IFaucetRequestBody = await request.json();
        const { chainId: chainIdString, examId: examIdString, user } = body;
        const chainId = Number(chainIdString);
        const examId = BigInt(examIdString);

        if (examId === undefined || !chainId || !user) {
            return NextResponse.json({ error: "Invalid request. The 'examId', 'chainId', and 'user' are required." }, { status: 400 });
        }

        // 1. Check if exam exists and is open

        const lastExamId = await wagmiReadFromContractAsync({
            functionName: 'getLastExamId',
            chainId: chainId
        }) as any;

        if (lastExamId <= examId) {
            return NextResponse.json({ message: "Exam does not exist" }, { status: 400 });
        }

        const status = await wagmiReadFromContractAsync({
            functionName: "getExamStatus",
            args: [examId],
            chainId: chainId
        }) as any;

        if (status !== 0) {
            return NextResponse.json({ message: "Exam is not open" }, { status: 400 });
        }

        // 2. Check if user is verified
        let isVerifiedOnCelo = false;
        try {
            isVerifiedOnCelo = await wagmiReadFromContractAsync({
                functionName: "getIsVerifiedOnCelo",
                args: [user],
                chainId: chainId
            }) as any;
        }
        catch (error: any) {
            console.log(error);
        }

        const needsVerification = (chainId == 42220) && !isVerifiedOnCelo;
        if (needsVerification) {
            return NextResponse.json({ message: "User is not verified" }, { status: 401 });
        }

        // 3. Check if user has already claimed faucet funds
        const submitAnswersFaucet = await db.collection("submit_answers_faucet").findOne({ chainId, examId, user });
        if (submitAnswersFaucet) {
            return NextResponse.json({ message: "User has already claimed faucet funds" }, { status: 402 });
        }

        // 4. Insert the document into the 'submit_answers_faucet' collection
        const insertionResult = await db.collection("submit_answers_faucet").insertOne({
            chainId,
            examId,
            user,
        })

        // 5. Send funds to user
        return await sendFundsToUser(chainId, user, insertionResult.insertedId.toString(), "0.00001", "0.01");
    }
    catch (error: any) {
        console.error("Failed to fund user:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
