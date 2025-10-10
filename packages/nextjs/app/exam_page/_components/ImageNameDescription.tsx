import { Box, Heading, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { defaultImage } from "~~/constants";
import ReactMarkdown from 'react-markdown';

const ImageNameDescription = ({exam}: {exam: Exam | undefined}) => {
    return (
        <>
            {/* Image */}
            <Image borderRadius="2xl" src={exam?.imageUrl || defaultImage} alt={"Exam Image"} maxWidth="500px" maxHeight="500px" mb="10" mt="6" w={200} h={200} sm={{ w: 290, h: 290 }} md={{ w: 350, h: 350 }} objectFit={"cover"}/>
            
            {/* Name */}
            <Heading fontSize="3xl" fontWeight="bold">{exam?.name}</Heading>

            {/* Description */}
            <Box 
                fontSize="12" 
                color="lighterLighterBlack" 
                whiteSpace={"pre-wrap"} 
                marginY="5"
                css={{
                    '& p': { marginBottom: '0.5em' },
                    '& strong': { fontWeight: 'bold' },
                    '& em': { fontStyle: 'italic' },
                    '& ul, & ol': { marginLeft: '1.5em', marginBottom: '0.5em' },
                    '& code': { 
                        backgroundColor: 'black', 
                        padding: '0.2em 0.4em', 
                        borderRadius: 'sm',
                        fontSize: '0.9em'
                    },
                    '& pre': { 
                        backgroundColor: 'black', 
                        padding: '1em', 
                        borderRadius: 'md',
                        overflowX: 'auto',
                        marginBottom: '0.5em'
                    },
                    '& a': { color: 'blue.500', textDecoration: 'underline' },
                    '& h1, & h2, & h3, & h4, & h5, & h6': { fontWeight: 'bold', marginTop: '0.5em', marginBottom: '0.25em' }
                }}
            >
                <ReactMarkdown
                    components={{
                        a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noopener noreferrer" />
                        )
                    }}
                >{exam?.description || ''}</ReactMarkdown>
            </Box>
        </>
    )
}

export default ImageNameDescription