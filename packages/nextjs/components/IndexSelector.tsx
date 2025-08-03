import React from "react";
import { Flex, Spacer } from "@chakra-ui/react";
import Button from "./Button";

interface IndexSelectorProps {
    setIndex: (index: number) => void;
    index: number;
    firstIndex: number;
    lastIndex: number;
    submitButtonOnClick?: () => void;
}

export const IndexSelector: React.FC<IndexSelectorProps> = ({ setIndex, index, firstIndex, lastIndex, submitButtonOnClick=undefined }) => {
    return (
        <Flex minW="56">
            {index !== firstIndex &&
            <Button
                className="bg-base-100 w-24"
                onClick={() => index > firstIndex && setIndex(index - 1)}
            >
                Previous
            </Button>
            }
            <Spacer />
            {(index == lastIndex) && (submitButtonOnClick !== undefined) ?
                <Button className="w-24 bg-base-100" onClick={submitButtonOnClick}>
                    Submit
                </Button>
                : (index !== lastIndex) &&
                <Button
                    className="bg-base-100 w-24"
                    onClick={() => index < lastIndex && setIndex(index + 1)}
                >
                    Next
                </Button>
            }
        </Flex>
    );
}