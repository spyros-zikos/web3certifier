import React from "react"
import { Box, Text } from "@chakra-ui/react";

const ExamDetail = ({name, value}: {name: any, value: any}) => {
    return (
        <Box>
            <label className="fontsize-12 mt-1 text-accent inline-block">{name}:</label> {""}
            <Text fontSize="12" p="0" m="0" mb="1" maxWidth={"360px"} display={"inline-block"}>{value}</Text>
        </Box>
    );
}

export default ExamDetail