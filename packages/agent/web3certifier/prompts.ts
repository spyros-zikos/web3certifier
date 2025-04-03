import { generateText, IAgentRuntime, ModelClass } from "@elizaos/core";


export async function promptExamId(_runtime: IAgentRuntime, interestsString: string, examsString: string) {
    const contextExamId = `$$$HERE ARE THE USER's INTERESTS:\n
${interestsString}

HERE ARE THE EXAM IDs AND NAMES:\n
${examsString}

YOUR JOB IS TO ANSWER WITH THE EXAM ID OF THE EXAM THE USER WANTS TO TAKE BASED ON THE EXAM NAME.

YOU CAN UNDERSTAND THE USER'S INTEREST FROM THE INTERESTS LISTED ABOVE.

YOUR ANSWER MUST BE ONE OF THE EXAM IDs FROM ABOVE. CHOOSE ONLY ONE EXAM ID BASED ON THE USER'S INTEREST. DO NOT INCLUDE ANY OTHER TEXT OTHER THAN THE EXAM ID.
    `;

    const response = await generateText({
        runtime: _runtime,
        context: contextExamId,
        modelClass: ModelClass.LARGE,
        stop: ["\n"],
    });

    return response;
}


export async function promptRecommendationExplanation(_runtime: IAgentRuntime, interestsString: string, exam: string) {
    const contextRecommendationExplanation = `$$$HERE ARE THE USER's INTERESTS:\n
${interestsString}

EXPLAIN TO THE USER BRIEFLY WHY THE EXAM WITH NAME ${exam} WILL BE THE MOST INTERESTING AND USEFUL EXAM FOR THE USER.
USE 'YOU' TO TALK DIRECTLY TO THE USER.
`;

    const response = await generateText({
        runtime: _runtime,
        context: contextRecommendationExplanation,
        modelClass: ModelClass.LARGE,
        stop: ["\n"],
    });

    return response;
}


export async function promptUserProvidesInterests(_runtime: IAgentRuntime, message: string) {
    const contextProvidesInterests = `$$$HERE IS THE USER's MESSAGE:\n
${message}

DOES THE USER TELL WHAT THEIR INTEREST OR INTERESTS ARE? DO THEY TELL WHAT THEY LIKE?
IF THEY DO, ANSWER WITH 'yes', ELSE ANSWER WITH 'no'.
`;

    const response = await generateText({
        runtime: _runtime,
        context: contextProvidesInterests,
        modelClass: ModelClass.LARGE,
        stop: ["\n"],
    });

    return response;
}


export async function promptInterestsFromMessage(_runtime: IAgentRuntime, message: string) {
    const contextInterests = `$$$HERE IS THE USER's MESSAGE:\n
${message}

FIND THE SUBJECTS AND TOPICS THAT THE USER IS INTERESTED IN AND LIST THEM SEPARATED BY COMMAS.
FOR EXAMPLE: MATH, NATURE, SPORTS
DO NOT INCLUDE ANY OTHER TEXT OTHER THAN THE SUBJECTS AND TOPICS THAT THE USER IS INTERESTED IN.
`;

    const response = await generateText({
        runtime: _runtime,
        context: contextInterests,
        modelClass: ModelClass.LARGE,
        stop: ["\n"],
    });

    return response;
}
