import { Web3 } from "web3";

export const keyLength = 10;

const VerifyAccountMessage = () => {
    return <div>{"\n"}You need to verify your account.{"\n"}Click on the &quot;CLAIM NOW&quot; button <a className="text-base-100" target="_blank" rel="noopener noreferrer" href='https://gooddapp.org/#/claim'>here</a>.</div>
}

// Cookies
export function getHashedAnswerAndMessageWithCookies(
    answers: bigint[], randomKey: number, address?: string, needsVerification?: boolean
): [
    message: any, hashedAnswer: string|undefined, userPassword: string
] {
    const web3 = window.ethereum ? new Web3(window.ethereum) : new Web3();
    
    // message
    const message = <div>The system uses cookies to store your password. This means that you can claim your certificate only from this device.{needsVerification ? <VerifyAccountMessage /> : ""}</div>

    // Get answers as string
    const answersAsString: string = answers ? getAnswersAsString(answers) : "0";
    // Get hash of answers, key and address
    const hashedAnswer = address ? web3.utils.soliditySha3(answersAsString, randomKey, address) : '';

    // password
    const userPassword = answersAsString + String(randomKey).padStart(keyLength, '0');

    return [message, hashedAnswer, userPassword];
}

// Retrieve password
export function getVariablesFromCookies(
    password: string, address?: string, userHashedSubmittedAnswer?: string
): [
    key: number, answers: string, passwordHashGood: boolean
] {
    const web3 = window.ethereum ? new Web3(window.ethereum) : new Web3();
    // Get answers from password
    const answers: string = password.substring(0, password.length - keyLength);
    // Get key from password
    const key = parseInt(password.substring(password.length - keyLength));

    /// passwordHashGood
    // Get hash
    const hashFromInputedPassword = (answers && key && address) ?  web3.utils.soliditySha3(answers, key, address) : '0x0';
    // Check hash
    const passwordHashGood = hashFromInputedPassword === userHashedSubmittedAnswer;

    return [key, answers, passwordHashGood]
}


function getAnswersAsString(answersArray: any) {
    let result = '';
    for (let i = 0; i < answersArray.length; i++) {
        result += answersArray[i];
    }
    return result;
}
