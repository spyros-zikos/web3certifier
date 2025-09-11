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
                When setting up rewards you can specify 3 optional parameters.
            </Box>

            <Section title="Reward Amount">
                The total amount of G$ tokens that you want to offer as rewards. If you insert a value,
                the amount of tokens that you specified will be transferred from your wallet to the
                reward contract.
            </Section>

            <Section title="Reward Amount Per Person">
                The amount of tokens that each user that passes the exam will get.
            </Section>

            <Section title="Reward Amount Per Correct Answer">
                The amount of tokens that each user that passes the exam will get for each correct
                answer they have. Example: Exam with 11 questions has a base of 6 and{" "}
                <Code>Reward amount per correct answer</Code> is set to 10. A user that passes the exam
                with 8 correct answers will get 80 tokens as
                a reward. If the <Code>Reward amount per person</Code> field is set to 20 then this user
                will get 80+20=100 tokens in total.
            </Section>
        </VStack>
    );
}