import { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";
import { ethers } from 'ethers';
import { gql, request } from 'graphql-request';
import { ABI } from "../ABI.ts";
import { getDiscordIdFromMessage } from "../helpers.ts";
import { Certification } from "../types.ts";
import Database from "better-sqlite3";

const provider = new ethers.AlchemyProvider(parseInt(process.env.CHAIN_ID), process.env.ALCHEMY_API_KEY);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, provider )

const examsProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {
        if (_message.agentId == _message.userId) return;
        const message = _message.content.text;

        // get mentioned user's discord id
        const discordId = getDiscordIdFromMessage(message);
        console.log("discordId:", discordId);
        if (!discordId) return "";

        // Delete previous messages
        const db = new Database('data/db.sqlite');
        const deleteMemories = db.prepare('DELETE FROM memories');
        deleteMemories.run();

        let userUsername = "";
        const url = `https://discord.com/api/v10/users/${discordId}`;
        try {
            let response;
            for (let i = 0; i < 5; i++) {
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bot ${process.env.DISCORD_API_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) continue;
                else break;
            }
            if (!response.ok) throw new Error('Failed to fetch Discord user');

            // Get username and discriminator (handle)
            // Note: Discord is phasing out discriminators, so some users might not have one
            const data = await response.json();
            if (data.discriminator && data.discriminator !== '0') {
                userUsername = `${data.username}#${data.discriminator}`;
            } else {
                userUsername = data.username;
            }
        } catch (error) {
            console.log('Error fetching Discord user:', error);
        }
        console.log("userUsername:", userUsername);

        // try 5 times
        for (let i = 0; i < 5; i++) 
            try {
                // get user's address from username
                const userAddress = await contract.getUserFromUsername(userUsername);
                // const userAddress = "0xdF224D627f48339d873817298D534c6B81FfC0c7";
                console.log("userAddress:", userAddress);

                // get user's certificates
                const query = gql`{
                    claimNFTs(where: {
                        user: "${userAddress}"
                    }) {
                        tokenId
                    }
                }`;
                const response: any = await request(process.env.THE_GRAPH_URL, query);
                const data = await response;
                const tokenIdList = data.claimNFTs;
                const tokenIds = tokenIdList.map((tokenIdObject: any) => tokenIdObject["tokenId"]);
                console.log("tokenIds:", tokenIds);
                console.log("tokenIdList.length:", tokenIdList.length);
                if (tokenIdList.length === 0) {
                    return `\n# INSTRUCTION:\nIf the user asks anything related to the skills or abilities or certifications or knowledge of a user then tell him that @${discordId} has not earned any certifications.`;
                }

                // get tokenURI for each certificate
                let tokenURIs: string[] = [];
                for (const tokenId of tokenIds) {
                    const tokenURI: string = await contract.tokenURI(tokenId);
                    tokenURIs.push(tokenURI);
                }

                // get name, description, base and score for certifications of the user
                const certifications: Certification[] = tokenURIs.map((tokenURI: string) => {
                    const encodedMetadata = tokenURI.split(",")[1];
                    const metadata = atob(encodedMetadata);
                    const metadataObject = JSON.parse(metadata);
                    const attributes = metadataObject["attributes"];
                    const name = attributes.find((attribute: any) => attribute["trait_type"] === "exam_name")["value"];
                    const description = attributes.find((attribute: any) => attribute["trait_type"] === "exam_description")["value"];
                    const base = attributes.find((attribute: any) => attribute["trait_type"] === "exam_base_score")["value"];
                    const score = attributes.find((attribute: any) => attribute["trait_type"] === "my_score")["value"];
                    const certification: Certification = { name, description, base, score };
                    return certification;
                });
                // console.log(certifications);
                
                // format certification data
                const formattedCertifications = certifications.map((certification: Certification) => {
                    const { name, description, base, score } = certification;
                    return `Name: "${name}"\nDescription: "${description}"\nBase Score: ${base}\nScore: ${score}`
                })
                const formattedCertificationData = 
                    "\n# INSTRUCTION:\nIf the user asks anything related to the skills or abilities or certifications or knowledge of a user then use the following certifications that the user has acquired. You should not tell directly what the certifications are (unless the user asks directly) but use the certifications to draw conclusions about the user's skills or abilities or knowledge. The certifications are:\n\n"
                    + formattedCertifications.join("\n\n");
                console.log("formattedCertificationData: ", formattedCertificationData);
                return formattedCertificationData;
            } catch (error) {
                console.log(error);
            }
    },
};
export { examsProvider };
