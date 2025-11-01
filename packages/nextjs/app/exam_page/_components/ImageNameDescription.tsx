import { Box, Heading, Image } from '@chakra-ui/react'
import React from 'react'
import { defaultImage } from "~~/constants";
import ReactMarkdown from 'react-markdown';
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';

const ImageNameDescription = ({exam}: {exam: Exam | undefined}) => {
    const [showFullDescription, setShowFullDescription] = React.useState(false);

    const maxDescriptionWordLength = 30;
    const descriptionWords = exam?.description ? exam.description.split(" ") : [];
    const descriptionIsTooLong = descriptionWords.length > maxDescriptionWordLength;
    const slicedDescription = descriptionWords.slice(0, maxDescriptionWordLength).join(" ") + (descriptionIsTooLong ? "..." : "");
    const AfterSlicedDescription = () => showFullDescription
        ? <div onClick={() => setShowFullDescription(false)} className="text-base-100">Less</div>
        : <div onClick={() => setShowFullDescription(true)}  className="text-base-100">More</div>;

    const examXP = wagmiReadFromContract({
        functionName: "getExamXp",
        args: [exam?.id || 0n],
    }).data;

    return (
        <>
            {/* Image */}
            <Box position="relative">
                <Box position="absolute" top="2" left="145px" sm={{ left: "235px"}} md={{ left: "295px"}} rounded="full" bg="green" color="white" fontSize="xs" px="2">{examXP?.toString() || "0"} XP</Box>
                <Image borderRadius="2xl" src={exam?.imageUrl || defaultImage} alt={"Exam Image"} maxWidth="500px" maxHeight="500px" mb="10" mt="6" w={200} h={200} sm={{ w: 290, h: 290 }} md={{ w: 350, h: 350 }} objectFit={"cover"}/>
            </Box>
            
            {/* Name */}
            <Heading fontSize="3xl" fontWeight="bold">{exam?.name}</Heading>

            {/* Description */}
            <Box 
                fontSize="12" 
                color="lighterLighterBlack" 
                whiteSpace={"pre-wrap"} 
                mt="5"
                mb="10"
                css={{
                    '& p': { marginBottom: '0em', marginTop: '0.1em' },
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
                >{descriptionIsTooLong && !showFullDescription
                    ? slicedDescription
                    : exam?.description
                }</ReactMarkdown>
                {descriptionIsTooLong
                    ? <AfterSlicedDescription />
                    : null
                }
            </Box>
        </>
    )
}

export default ImageNameDescription