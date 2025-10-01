// 1. Checks if user has submitted
// 2. Checks if user has alreay claimed by checking the database
// 3. Checks if the exam is featured
// 4. Stores the address of the user in the database
// 5. Sends funds to user
import { NextResponse } from "next/server";
import { connectToDatabase } from "~~/services/mongodb";
import { wagmiReadFromContractAsync } from "~~/utils/wagmi/wagmiReadAsync";
import { sendFundsToUser } from "../../../helpers";
import { getFeaturedExams } from "~~/app/api/explore_page/featured_exams/route";

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

        // 1. Check if user has submitted
        const status = await wagmiReadFromContractAsync({
            functionName: "getUserStatus",
            args: [user, BigInt(examId)],
            chainId: chainId
        }) as any;

        if (status !== 1) {
            return NextResponse.json({ message: "User status is not 'submitted'" }, { status: 401 });
        }

        // 2. Check if user has already claimed faucet funds
        const claimCertificateFaucet = await db.collection("claim_certificate_faucet").findOne({ chainId, examId, user });
        if (claimCertificateFaucet) {
            return NextResponse.json({ message: "User has already claimed faucet funds" }, { status: 402 });
        }

        // 3. Check if the exam is featured
        const featuredExamIds = await getFeaturedExams(chainId, db);
        const featuredExamIdsArray = featuredExamIds.split(",");
        const isFeatured = featuredExamIdsArray.includes(examId.toString());
        if (!isFeatured) {
            return NextResponse.json({ message: "Exam is not featured" }, { status: 403 });
        }

        // 4. Insert the document into the 'claim_certificate_faucet' collection
        const insertionResult = await db.collection("claim_certificate_faucet").insertOne({
            chainId,
            examId,
            user,
        })

        // 5. Send funds to user
        return await sendFundsToUser(chainId, user, insertionResult.insertedId.toString(), "0.00001", "0.03");
    }
    catch (error: any) {
        console.error("Failed fund user:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
