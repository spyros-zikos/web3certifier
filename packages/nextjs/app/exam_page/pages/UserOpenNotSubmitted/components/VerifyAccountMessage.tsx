import { Box } from "@chakra-ui/react"
import Link from "next/link"
import { IdentitySDK } from '@goodsdks/citizen-sdk';


const handleVerifyClick = async (
    publicClient: any, walletClient: any
) => {
    try {
        if (!publicClient || !walletClient) {
            console.error("Clients not available");
            return;
        }
        const identitySDK = await IdentitySDK.init({
            publicClient: publicClient,
            walletClient: walletClient,
            env: "production" // or "staging" or "development"
        });
        
        const fvLink = await identitySDK.generateFVLink(false, window.location.href);
        window.open(fvLink);
    } catch (error) {
        console.error("Failed to generate FV link:", error);
    }
};

const VerifyAccountMessage = (
    { publicClient, walletClient }: { publicClient: any, walletClient: any }
) => {
    return <div>
        To prevent multiple submissions from the same person, please use a GoodDollar verified account.<br />
        You can either&nbsp;
            <Box display="inline" onClick={() => handleVerifyClick(publicClient, walletClient)} fontStyle="italic" textDecoration="underline" cursor="pointer">
                verify that this account belongs to a unique person
            </Box>
            &nbsp;or&nbsp;
            <Box display="inline" fontStyle="italic" textDecoration="underline" cursor="pointer">
                <Link href="https://goodwallet.xyz" target="_blank">
                create a new verified account
                </Link>
            </Box>.
        {"\n\n"}
    </div>
}

export default VerifyAccountMessage