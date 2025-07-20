import { Accordion, Text, Spacer } from '@chakra-ui/react'
import React from 'react'
import ExamDetail from './ExamDetail'
import { Address } from "~~/components/scaffold-eth";
import { getExamStatusStr } from "~~/utils/StatusStr";

const ExamInfoDropDown = ({status, exam}: {status: number | undefined, exam: Exam | undefined}) => {
  return (
    <Accordion.Root borderY="1px solid" borderColor="lighterLighterBlack" mt="12" mb="0" py="2" collapsible>
        <Accordion.Item value={"1"}>
            <Accordion.ItemTrigger>
            <Text fontWeight="semibold" fontSize={"lg"}>
                Exam Information
            </Text>
            <Spacer />
            <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
            <Accordion.ItemBody>
                    <ExamDetail name="Status" value={getExamStatusStr(status)} />
                    <ExamDetail name="End Time" value={exam?(new Date(Number(exam?.endTime)*1000)).toString().split("(")[0].slice(4).slice(0, 17) +
                                                            (new Date(Number(exam?.endTime)*1000)).toString().split("(")[0].slice(4).slice(20) : 0} />
                    <ExamDetail name="Price" value={exam?'$'+parseFloat(exam!.price!.toString()) / 1e18 : 0} />
                    <ExamDetail name="Base Score" value={exam?.baseScore.toString()} />
                    <ExamDetail name="Submissions" value={exam?.numberOfSubmissions.toString()+' of ' + (exam?.maxSubmissions == BigInt(0) ? "Unlimited" : exam?.maxSubmissions.toString())} />
                    <ExamDetail name="Certifier" value={<Address address={exam?.certifier} className={"text-bold"} disableAddressLink={true} />} />
                </Accordion.ItemBody>
            </Accordion.ItemContent>
        </Accordion.Item>
    </Accordion.Root>
  )
}

export default ExamInfoDropDown