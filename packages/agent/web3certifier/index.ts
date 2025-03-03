import { Plugin } from "@elizaos/core";
import { examsProvider } from "./providers/examsProvider.ts";

export const web3certifierPlugin: Plugin = {
    name: "tipper",
    description: "Agent that tips creators",
    actions: [],
    evaluators: [],
    providers: [examsProvider],
};
export default web3certifierPlugin;