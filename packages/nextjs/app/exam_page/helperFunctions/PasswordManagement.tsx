import { Web3 } from "web3";
import Cookies from 'js-cookie';

export const keyLength = 10;

// Password

export function getHashedAnswerAndMessageWithPassword(
    answers: bigint[], randomKey: number, address?: string, needsVerification?: boolean
): [
    message: any, hashedAnswer: string|undefined
] {
    const web3 = window.ethereum ? new Web3(window.ethereum) : new Web3();
    
    // Get answers as number
    const answersAsNumber: bigint = answers ? getAnswersAsNumber(answers) : BigInt(0);
    // Get hash of answers, key and address
    const hashedAnswer = address ? web3.utils.soliditySha3(answersAsNumber, randomKey, address) : '';

    // message
    const userPassword = String(answersAsNumber) + String(randomKey).padStart(keyLength, '0');
    const message = <div>Your password is {userPassword}. Copy it and store it. You&apos;ll need it to claim your certificate.{needsVerification ? <div>{"\n\n"}You need to verify your account. You can do this <a href='https://gooddapp.org/#/claim'>here</a>.</div> : ""}</div>

    return [message, hashedAnswer];
}

export function getVariablesFromPasswordOrCookies(
    password: string, exam?: Exam, address?: string, userHashedSubmittedAnswer?: string
): [
    key: number, answersArray: bigint[], numberOfCorrectAnswers: number, passwordHashGood: boolean
] {
    const web3 = window.ethereum ? new Web3(window.ethereum) : new Web3();

    // Get answers as integer from password
    let answersInt = parseInt(password.substring(0, password.length - keyLength));
    const answersIntCopy = answersInt;

    /// key
    // Get key from password
    const key = parseInt(password.substring(password.length - keyLength));
    
    /// answersArray
    // Get list with answers
    const answersArray: bigint[] = [];
    for (let i = 0; i < password.length - keyLength; i++) {
        answersArray.push(BigInt(answersInt % 10));
        answersInt = Math.floor(answersInt / 10);
    }

    /// numberOfCorrectAnswers
    // Get number of correct answers from the password
    const numberOfCorrectAnswers = answersArray.filter((answer: any, i: any) => answer === exam?.answers[i]).length;

    /// passwordHashGood
    // Get hash
    const hashFromInputedPassword = (answersIntCopy && key && address) ?  web3.utils.soliditySha3(answersIntCopy, key, address) : '0x0';
    // Check hash
    const passwordHashGood = hashFromInputedPassword === userHashedSubmittedAnswer;

    return [key, answersArray, numberOfCorrectAnswers, passwordHashGood]
}

// Cookies

export function getHashedAnswerAndMessageWithCookies(
    answers: bigint[], randomKey: number, examId: bigint, updateCookie: boolean, chainId?: number, address?: string, needsVerification?: boolean
): [
    message: any, hashedAnswer: string|undefined
] {
    const web3 = window.ethereum ? new Web3(window.ethereum) : new Web3();
    
    // Get answers as number
    const answersAsNumber: bigint = answers ? getAnswersAsNumber(answers) : BigInt(0);
    // Get hash of answers, key and address
    const hashedAnswer = address ? web3.utils.soliditySha3(answersAsNumber, randomKey, address) : '';

    // message
    const userPassword = String(answersAsNumber) + String(randomKey).padStart(keyLength, '0');
    if (updateCookie)
        Cookies.set(`w3c.${chainId}.${examId}.${address}`, userPassword, { expires: 1000 });
    const message = <div>The system uses cookies to store your password. This means that you can claim your certificate only from this device.{needsVerification ? <div>{"\n\n"}You need to verify your account. You can do this <a href='https://gooddapp.org/#/claim'>here</a>.</div> : ""}</div>

    return [message, hashedAnswer];
}


function getAnswersAsNumber(answersArray: any) {
    let result = BigInt(0);
    for (let i = 0; i < answersArray.length; i++) {
        result += answersArray[i] * BigInt(10 ** i);
    }
    return result;
}