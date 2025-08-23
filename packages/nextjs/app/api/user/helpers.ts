import { NextResponse } from "next/server";
import { createWalletClient, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { transports } from "~~/utils/wagmi/config";
import { getChainFromChainNumber } from "~~/utils/wagmi/getChainFromChainNumber";

export async function userHasClaimedFaucet(request: Request, db: any, collectionName: string) {
    try {
        const url = new URL(request.url);
        const chainId = Number(url.searchParams.get('chainId'));
        const examId = Number(url.searchParams.get('examId'));
        const user = url.searchParams.get('user');

        if (examId === undefined || !chainId || !user) {
            return NextResponse.json({ error: "Invalid request. The 'examId', 'chainId', and 'user' are required." }, { status: 400 });
        }

        // Check if user has already claimed faucet funds
        const claimCertificateFaucet = await db.collection(collectionName).findOne({ chainId, examId, user });

        return new Response(JSON.stringify(claimCertificateFaucet ? true : false), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function sendFundsToUser(
    chainId: number, user: string, insertedId: string, ethAmount: string, celoAmount: string
) {
    const privateKey: any = `0x${process.env.FAUCET_PRIVATE_KEY}`;
    if (!privateKey) {
        return NextResponse.json({ message: "Private key not found" }, { status: 500 });
    }
    const account = privateKeyToAccount(privateKey);

    const walletClient = createWalletClient({
        account,
        chain: getChainFromChainNumber(chainId),
        transport: transports[getChainFromChainNumber(chainId).id],
    })

    const amount = chainId === 42220 ? parseEther(celoAmount) : parseEther(ethAmount);
    const hash = await walletClient.sendTransaction({
        to: user,
        value: amount
    })

    return NextResponse.json(
        { message: "Faucet funds sent", documentId: insertedId, "transactionHash": hash },
        { status: 200 }
    );
}