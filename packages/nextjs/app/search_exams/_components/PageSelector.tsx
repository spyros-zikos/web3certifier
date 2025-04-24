import React from "react";
import { Box, Button } from "@chakra-ui/react";

interface PageSelectorProps {
    setPage: (page: number) => void;
    page: number;
    lastPage: number;
}

export const PageSelector: React.FC<PageSelectorProps> = ({ setPage, page, lastPage }) => {
    return (
        <Box className="w-full flex items-center justify-center mx-5 mt-12">
            <Button
                className="h-10 btn btn-sm btn-primary hover:border-accent"
                onClick={() => page > 1 && setPage(page - 1)}
            >
                {"<"}
            </Button>
            <div className="px-5 text-5xl" title={`Page ${page} of ${lastPage}`}>{page}</div>
            <Button
                className="h-10 btn btn-sm btn-primary hover:border-accent"
                onClick={() => page < lastPage && setPage(page + 1)}
            >
                {">"}
            </Button>
        </Box>
    );
}