import { Heading, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { defaultImage } from "~~/constants";

const ImageNameDescription = ({exam}: {exam: Exam | undefined}) => {
  return (
        <>
            {/* Image */}
            <Image borderRadius="2xl" src={exam?.imageUrl || defaultImage} alt={"Exam Image"} maxWidth="500px" maxHeight="500px" mb="10" mt="6" w={200} h={200} sm={{ w: 290, h: 290 }} md={{ w: 350, h: 350 }} objectFit={"cover"}/>
            
            {/* Name */}
            <Heading fontSize="3xl" fontWeight="bold">{exam?.name}</Heading>

            {/* Description */}
            <Text fontSize="12" color="lighterLighterBlack" whiteSpace={"pre-wrap"} marginY="5" display={"inline-block"}>
                {exam?.description}
            </Text>
        </>
  )
}

export default ImageNameDescription