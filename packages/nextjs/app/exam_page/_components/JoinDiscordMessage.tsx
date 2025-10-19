import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { DISCORD_INVITE_LINK } from '~~/constants'

export const discordServerLink = 
    <Box display="inline" textDecoration={"underline"}>
        <Link href={DISCORD_INVITE_LINK} target="_blank">
            Discord server
        </Link>
    </Box>

const JoinDiscordMessage = ({mentionRewards = false}: {mentionRewards?: boolean}) => {
    return (
        <>
            <Box display="inline">Join our </Box>
            {discordServerLink}
            <Box display="inline"> to get notified{mentionRewards && " when you can claim your rewards and"} when new exams are organized!</Box>
        </>
    )
}

export default JoinDiscordMessage