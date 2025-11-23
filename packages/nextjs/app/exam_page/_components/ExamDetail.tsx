import React from "react"
import { Box, Flex, Spacer } from "@chakra-ui/react";

const ExamDetail = ({name, value}: {name: any, value: any}) => {
    return (
        <Flex>
            <label className="fontsize-12 text-accent inline-block">{name}</label> {""}
            <Spacer />
            <Box fontSize="12" p="0" m="0" mb="4" maxWidth={"360px"} display={"inline-block"}>{value}</Box>
        </Flex>
    );
}

export default ExamDetail