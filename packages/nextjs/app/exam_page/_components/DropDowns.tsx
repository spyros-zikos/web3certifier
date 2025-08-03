import React from 'react'
import ExamInfoDropDown from './ExamInfoDropDown'
import RewardInfoDropDown from './RewardInfoDropDown'

const DropDowns = ({exam, status}: {exam: Exam | undefined, status: number | undefined}) => {
    return (
    <>
        {/* Exam Information */}
        <ExamInfoDropDown status={status} exam={exam} />

        {/* Reward Information */}
        <RewardInfoDropDown id={exam?.id || BigInt(0)} />
    </>
    )
}

export default DropDowns