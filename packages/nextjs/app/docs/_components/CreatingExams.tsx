'use client';
import React from "react";
import { Box, Heading, VStack, Code } from "@chakra-ui/react";
import { ButtonLink } from "~~/components";
import { Section } from "./Section";

export default function ExamDocsPage() {
    return (
        <VStack align="start" gap={6}>
            <Heading fontSize="2xl" fontWeight="bold">📚 How to Create an Exam</Heading>

            <Section title="Image">
                Upload a square image via drag-and-drop or file selection. This image will appear on the
            exam page and on the NFT certificate.
            </Section>

            <Section title="Name*">
                Input the exam name. Avoid adding &quot;<Code>Exam</Code>&quot; at the end. For example, prefer{" "}
            <Code>Basic Algebra</Code> over <Code>Basic Algebra Exam</Code>.
            </Section>

            <Section title="Exam Description*">
                Input the exam description. For example: This exam is meant to test your knowledge of staking and to help you stake your tokens.
            </Section>

            <Section title="Exam Resources">
                Input the exam resources. For example: You can find more information [here](thelink).
            </Section>

            <Section title="Reward Description">
                Input the reward description. For example: The total amount of G$ tokens that you want to offer as rewards, the timeline of the reward and the amount of tokens that each user that passes the exam will get. 
            </Section>

            Note: The fields Exam Description, Reward Description, Eligibility Criteria and Exam Resources accept markdown.

            <Section title="End time*">
                Specify the deadline for the exam. After this date, users cannot submit answers. A good practice is to set it a week after the date that you create the exam.
            </Section>

            <Box w="full" borderTop="1px solid" borderColor="lighterLighterBlack"></Box>

            <Box flex="1" textAlign="left">
                ⚙️ Advanced Options (Best left to default values)
            </Box>

            <Section title="Price">
                Set a price per submission in USD. It will be charged in equivalent Celo. Default value is{" "}
                <Code>0</Code> so that the exam is free.
            </Section>

            <Section title="Base Score">
                Define the minimum correct answers required to pass. E.g., for 20 questions, set it to{" "}
                <Code>12</Code> to reward only those who score 12 or more. By default, it’s 50% of
                total questions.
            </Section>

            <Section title="Max Submissions">
                Set a limit on how many users can submit. Default is <Code>0</Code> (unlimited).
            </Section>

            <Box w="full" borderTop="1px solid" borderColor="lighterLighterBlack"></Box>

            <Section title="Exam Questions*">
                Add the questions and four possible answers for each. Avoid prefixes like{" "}
                <Code>Question 1:</Code> or <Code>A)</Code>—these are already handled by the UI.
            </Section>

            <Box>Exam Creation Fee: A small native currency fee (Eth or Celo) is required to prevent spam when creating an exam.</Box>

            <Box>Note: * indicates required fields.</Box>

            <ButtonLink href="/organize_exams">
                Create an exam
            </ButtonLink>
            
        </VStack>
    );
}
