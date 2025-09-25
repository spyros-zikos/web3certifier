// Checks if user has alreay claimed by checking the database
import { connectToDatabase } from "~~/services/mongodb";
import { userHasClaimedFaucet } from "../../../helpers";

export async function GET(request: Request) {
    const { db } = await connectToDatabase();
    return await userHasClaimedFaucet(request, db, "claim_certificate_faucet");
}
