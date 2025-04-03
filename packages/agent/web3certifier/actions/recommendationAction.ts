import {
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import { promptExamId, promptInterestsFromMessage, promptRecommendationExplanation, promptUserProvidesInterests } from "../prompts.ts";
import { getExamsStringFromGraph } from "../helpers.ts";

export const recommendationAction: Action = {
    suppressInitialMessage: true,
    name: "RECOMMEND",
    similes: ["PROPOSE", "SUGGEST"],
    description: "Recommend to the user an exam after they tell you what they are interested in or what they like.",
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        /// This action is used when the user provides his interest in a subject or topic.
        /// The agent will then recommend a certificate or an exam based on the user's interest.

        // Get does user provides his interest
        const userProvidesInterests = await promptUserProvidesInterests(runtime, message.content.text);
        console.log("userProvidesInterests:", userProvidesInterests);
        if (userProvidesInterests == "no") return;

        // Get interests from message
        const interestsString = await promptInterestsFromMessage(runtime, message.content.text);
        console.log("interestsString:", interestsString);

        // Get active exams
        const examsString = await getExamsStringFromGraph();

        // Find id of best active exam
        const examId = await promptExamId(runtime, interestsString, examsString);
        console.log("examId:", examId);

        // Get exam name
        const examName = examsString.split("\n").find((e: string) => e.includes(examId)).split(": ")[1];
        console.log("examName:", examName);

        // Get recommendation explanation
        const recommendationExplanation = await promptRecommendationExplanation(runtime, interestsString, examName);
        console.log("recommendationExplanation:", recommendationExplanation);

        const url = `\n\nYou can take this exam here: https://web3certifier-nextjs.vercel.app/exam_page?id=`;
        const responseWithLink = url + examId;

        const response = recommendationExplanation + responseWithLink;
        callback({ text: response });
        
        return;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I'm interested in physics",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "RECOMMEND" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I like mathematics",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "RECOMMEND" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Recommend me a blockchain course",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "", action: "RECOMMEND" },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Recommend me a course",
                },
            },
            {
                user: "{{user2}}",
                content: { text: "Please specify what you're interested in.", action: "NONE" },
            },
        ],
    ] as ActionExample[][],
} as Action;