import { useState } from "react";
import { Web3 } from "web3";

export const keyLength = 10;


export function getHashAndPassword(
    answers: bigint[], address?: string
): [
    hashedAnswer: string|undefined, userPassword: string
] {
    const [randomKey, _] = useState(Math.floor((10**keyLength) * Math.random()));
    
    const web3 = window.ethereum ? new Web3(window.ethereum) : new Web3();

    // Get answers as string
    const answersAsString: string = answers ? getAnswersAsString(answers) : "0";
    // Get hash of answers, key and address
    const hashedAnswer = address ? web3.utils.soliditySha3(answersAsString, randomKey, address) : '';

    // password
    const userPassword = answersAsString + String(randomKey).padStart(keyLength, '0');

    return [hashedAnswer, userPassword];
}

// Retrieve password
export function getVariablesFromPasswordCookie(
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


export function getAnswersAsNumberArrayFromString(answersString: string) {
    const answersArray = [];
    for (let i = 0; i < answersString.length; i++) {
        answersArray.push(parseInt(answersString[i]));
    }
    return answersArray;
}

function getAnswersAsString(answersArray: any) {
    let result = '';
    for (let i = 0; i < answersArray.length; i++) {
        result += answersArray[i];
    }
    return result;
}
