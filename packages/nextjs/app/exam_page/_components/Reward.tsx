import React from 'react'

const Reward = ({certifier}: {certifier: string}) => {
    const url = rewardRecords[certifier];
    if (!url) return null;
    return (<div>Rewards may be available <a href={url} className="text-base-100 hover:underline">here</a>.</div>);
}

// certifier and reward link
const rewardRecords: Record<string, string> = {
    '0xe7a5b06E8dc5863566B974a4a19509898bdEc277': 'rewards/gooddollar'
}

export default Reward