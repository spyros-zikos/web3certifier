import { Box } from '@chakra-ui/react';
import React from 'react'
import { Button } from "~~/components";

const ExamStartWarningBox = ({onClickStart}: {onClickStart: any}) => {
    return (
        <Box display={"flex"} flexDirection={"column"} justifyContent={"end"} alignItems={"center"} bg="primary" w="full" h="500px" border="2px" borderStyle="solid" borderColor="lightGreen">
            <Button
                className="bg-base-100 w-32 h-12 font-bold text-xl mb-24"
                onClick={onClickStart}
            >
                Start
            </Button>
            <Box className="flex items-center justify-center mt-8 mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <Box className="font-bold max-w-[80%] ml-4">Once you press start you will have 30 seconds to answer each question! Make sure you have studied for the exam!</Box>
            </Box>
        </Box>
    )
}

export default ExamStartWarningBox