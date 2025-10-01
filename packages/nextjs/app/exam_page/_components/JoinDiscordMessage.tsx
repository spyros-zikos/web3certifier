import { Box } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { DISCORD_INVITE_LINK } from '~~/constants'

const JoinDiscordMessage = () => {
  return (
    <>
        <Box display="inline">Join our </Box>
        <Box display="inline" textDecoration={"underline"}><Link href={DISCORD_INVITE_LINK}>Discord server</Link></Box>
        <Box display="inline"> to get notified when you can claim your reward and to notified for upcoming exams!</Box>
    </>
  )
}

export default JoinDiscordMessage