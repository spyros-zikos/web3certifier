import React from "react";
import { Box, Button } from "@chakra-ui/react";

interface IndexSelectorProps {
    setIndex: (index: number) => void;
    index: number;
    firstIndex: number;
    lastIndex: number;
}

export const IndexSelector: React.FC<IndexSelectorProps> = ({ setIndex, index, firstIndex, lastIndex }) => {
    return (
        <Box className="w-full flex items-center justify-center mt-12">
            <Button
                className="h-10 btn btn-sm btn-primary hover:border-accent"
                onClick={() => index > firstIndex && setIndex(index - 1)}
            >
                {"<"}
            </Button>
            <div className="px-5 text-5xl" title={`${index} of ${lastIndex}`}>{index}</div>
            <Button
                className="h-10 btn btn-sm btn-primary hover:border-accent"
                onClick={() => index < lastIndex && setIndex(index + 1)}
            >
                {">"}
            </Button>
        </Box>
    );
}