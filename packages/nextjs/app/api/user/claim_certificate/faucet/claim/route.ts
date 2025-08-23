// 1. Checks if user has submitted
// 2. Checks if user has alreay claimed by checking the database
// 3. Stores the address of the user in the database
// 4. Sends funds to user
import { NextResponse } from "next/server";
import { connectToDatabase } from "~~/services/mongodb";
import { wagmiReadFromContractAsync } from "~~/utils/wagmi/wagmiReadAsync";
import { getChainFromChainNumber } from "~~/utils/wagmi/getChainFromChainNumber";
import { createWalletClient, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { transports } from "~~/utils/wagmi/config";

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

        if (status === 0) {
            return NextResponse.json({ message: "User has not submitted" }, { status: 401 });
        }

        // 2. Check if user has already claimed faucet funds
        const claimCertificateFaucet = await db.collection("claim_certificate_faucet").findOne({ chainId, examId, user });
        if (claimCertificateFaucet) {
            return NextResponse.json({ message: "User has already claimed faucet funds" }, { status: 402 });
        }

        // 3. Insert the document into the 'claim_certificate_faucet' collection
        const insertionResult = await db.collection("claim_certificate_faucet").insertOne({
            chainId,
            examId,
            user,
        })

        // 4. Send funds to user
        const privateKey: any = `0x${process.env.CLAIM_CERTIFICATE_FAUCET_PRIVATE_KEY}`;
        if (!privateKey) {
            return NextResponse.json({ message: "Private key not found" }, { status: 500 });
        }
        const account = privateKeyToAccount(privateKey);

        const walletClient = createWalletClient({
            account,
            chain: getChainFromChainNumber(chainId),
            transport: transports[getChainFromChainNumber(chainId).id],
        })

        const amount = chainId === 42220 ? parseEther("0.04") : parseEther("0.00001");
        const hash = await walletClient.sendTransaction({
            to: user,
            value: amount
        })

        return NextResponse.json(
            { message: "Faucet funds sent", documentId: insertionResult.insertedId, "transactionHash": hash },
            { status: 200 }
        );
    }
    catch (error: any) {
        console.error("Failed to create exam:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
