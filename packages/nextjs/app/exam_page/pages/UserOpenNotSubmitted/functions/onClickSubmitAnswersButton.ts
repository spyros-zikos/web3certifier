import { chainsToContracts, cookieExpirationTime, getPasswordCookieName, ZERO_ADDRESS } from "~~/constants";
import Cookies from 'js-cookie';
import { getHashAndPassword, keyLength } from "~~/app/exam_page/helperFunctions/PasswordManagement";
import { handleSubmitAnswers } from "~~/app/exam_page/helperFunctions/Handlers";
import { getUserAnswersFromLocalStorage } from "~~/utils/handleLocalStorage";

const onClickSubmitAnswersButton = async (
    blockNumber: any,
    canClaimEngagementRewards: boolean,
    engagementRewards: any,
    chain: any,
    inviter: string | null,
    address: string | undefined,
    exam: any,
    examPriceInEth: bigint,
    submitAnswers: any
) => {
    // answers from local storage
    const answers: number[] = getUserAnswersFromLocalStorage(chain, exam);
    // random key
    const randomKey = Math.floor((10**keyLength) * Math.random());
    // get hash to submit and password to store in cookie
    const [hashedAnswerToSubmit, userPassword] = getHashAndPassword(answers, randomKey, address);

    // const currentBlock = await engagementRewards?.getCurrentBlockNumber();
    const validUntilBlock = (blockNumber.data || 1000000000n) + 600n // Valid for 600 blocks

    try {
        let signature = "0x";
        if (canClaimEngagementRewards)
            signature = await engagementRewards?.signClaim(
                chainsToContracts[chain?.id]["Certifier"].address,
                inviter || ZERO_ADDRESS,
                validUntilBlock
            ) as any;
        
        console.log("id, hashedAnswer, examPrice, inviter, validUntilBlock, signature:",
            exam.id, hashedAnswerToSubmit, examPriceInEth, inviter, validUntilBlock, signature);
            
        console.log(userPassword);

        // store the password cookie on every click to avoid stupid tx errors
        const passwordCookie = getPasswordCookieName(chain, exam?.id, address);
        Cookies.set(passwordCookie || "", userPassword || "", { expires: cookieExpirationTime });

        if (hashedAnswerToSubmit && exam && (exam.price > 0 ? examPriceInEth : true) && answers.length === exam?.questions?.length)
            handleSubmitAnswers(submitAnswers, exam.id, hashedAnswerToSubmit, examPriceInEth!, inviter || ZERO_ADDRESS, validUntilBlock, signature);
    } catch (error) {
        console.log(error);
    }
}

export default onClickSubmitAnswersButton