'use client';
import React from "react";
import {
  Box,
  Heading,
  VStack,
  Container,
  Code,
} from "@chakra-ui/react";
import { Section } from "../_components/Section";


export default function RewardSetUp() {
  return (
    <Container maxW="4xl" py={10}>
      <VStack align="start" gap={6}>
        <Heading size="xl">🏆 How to Set Up Rewards</Heading>

        <Box>
          When setting up rewards you can specify 3 parameters (only the{" "}
          <Code>Reward Amount Per Person</Code> is a required parameter. The other
          parameters are optional.)
        </Box>

        <Section title="Reward Amount">
          The total amount of G$ tokens that you want to offer as rewards. If you insert a value,
          the amount of tokens that you specified will be transferred from your wallet to the
          reward contract.
        </Section>

        <Section title="Reward Amount Per Person">
          The amount of tokens that each user that passes the exam will get. This field is{" "}
          <strong>required</strong> to set up rewards.
        </Section>

        <Section title="Reward Amount Per Correct Answer">
          The amount of tokens that each user that passes the exam will get for each extra correct
          answer they have. Example: Exam with 11 questions has a base of 6 and{" "}
          <Code>Reward amount per correct answer</Code> is set to 10. A user that passes the exam
          with 8 correct answers will have 2 extra correct answers and so will get 20 tokens as
          a reward. If the <Code>Reward amount per person</Code> field is set to 50 then this user
          will get 50+20=70 tokens in total.
        </Section>
        
      </VStack>
    </Container>
  );
}