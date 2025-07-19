import React from "react"
import { Flex, Spacer, Text } from "@chakra-ui/react";

const ExamDetail = ({name, value}: {name: any, value: any}) => {
    return (
        <Flex>
            <label className="fontsize-12 text-accent inline-block">{name}:</label> {""}
            <Spacer />
            <Text fontSize="12" p="0" m="0" mb="4" maxWidth={"360px"} display={"inline-block"}>{value}</Text>
        </Flex>
    );
}

export default ExamDetail