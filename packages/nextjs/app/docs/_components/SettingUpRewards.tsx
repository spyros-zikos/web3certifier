'use client';
import React from "react";
import {
  Box,
  Heading,
  VStack,
  Code,
} from "@chakra-ui/react";
import { Section } from "./Section";


export default function SettingUpRewards() {
    return (
        <VStack align="start" gap={6}>
            <Heading fontSize="2xl" fontWeight="bold">🏆 How to Set Up Rewards</Heading>

            <Box>
                When setting up rewards you can specify 4 parameters.
            </Box>

            <Section title="Distribution Type">
                The distribution type defines how the rewards will be distributed. You can choose between Constant, Uniform and Custom. If you select Custom you will have to also set the eligibility criteria to Custom. Constant: A constant amount will be distributed to each user. Uniform: The total reward amount will be distributed evenly among all submissions but only the users that pass the exam can claim their reward.
            </Section>

            <Section title="Reward Amount Per User / Total Reward Amount / Distribution Parameter">
                Depending on the distribution type you can either set the Reward Amount Per User, the Total Reward Amount or the Distribution Parameter (if the custom reward uses it).
            </Section>

            <Section title="Eligibility Type">
                The eligibility type defines how the users will be eligible for the reward. You can choose between None, Holds Token, Holds NFT and Custom.
            </Section>

            <Section title="Token Address / NFT Address / Custom Reward Address">
                This field in not required if the eligibility type is None. If the eligibility type is Holds Token or Holds NFT you have to specify the token address or NFT address. If the eligibility type is Custom you have to specify the custom reward address which will have the eligibility logic and optionally the distribution logic.
            </Section>
        </VStack>
    );
}