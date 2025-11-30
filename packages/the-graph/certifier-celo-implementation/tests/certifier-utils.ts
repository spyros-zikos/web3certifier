import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  AddExamWithXp,
  AddeToWhitelist,
  Approval,
  ApprovalForAll,
  ClaimNFT,
  ClaimRefund,
  CorrectExam,
  CreateExam,
  EngagementRewardClaimFailed,
  Initialized,
  OwnershipTransferred,
  RemoveExamWithXp,
  RemoveFromWhitelist,
  SetExamCreationFee,
  SetFeeCollector,
  SetPaused,
  SetPriceFeed,
  SetRequiresSignature,
  SetSigner,
  SetSubmissionFee,
  SetTimeToCorrectExam,
  SetUsername,
  Stopped,
  SubmitAnswers,
  Transfer,
  UpdateExamXp,
  Upgraded,
  UserFailed
} from "../generated/Certifier/Certifier"

export function createAddExamWithXpEvent(
  examId: BigInt,
  xp: BigInt
): AddExamWithXp {
  let addExamWithXpEvent = changetype<AddExamWithXp>(newMockEvent())

  addExamWithXpEvent.parameters = new Array()

  addExamWithXpEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )
  addExamWithXpEvent.parameters.push(
    new ethereum.EventParam("xp", ethereum.Value.fromUnsignedBigInt(xp))
  )

  return addExamWithXpEvent
}

export function createAddeToWhitelistEvent(user: Address): AddeToWhitelist {
  let addeToWhitelistEvent = changetype<AddeToWhitelist>(newMockEvent())

  addeToWhitelistEvent.parameters = new Array()

  addeToWhitelistEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )

  return addeToWhitelistEvent
}

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createClaimNFTEvent(
  user: Address,
  examId: BigInt,
  answers: string,
  tokenId: BigInt
): ClaimNFT {
  let claimNftEvent = changetype<ClaimNFT>(newMockEvent())

  claimNftEvent.parameters = new Array()

  claimNftEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  claimNftEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )
  claimNftEvent.parameters.push(
    new ethereum.EventParam("answers", ethereum.Value.fromString(answers))
  )
  claimNftEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return claimNftEvent
}

export function createClaimRefundEvent(
  examId: BigInt,
  user: Address,
  amount: BigInt
): ClaimRefund {
  let claimRefundEvent = changetype<ClaimRefund>(newMockEvent())

  claimRefundEvent.parameters = new Array()

  claimRefundEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )
  claimRefundEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  claimRefundEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return claimRefundEvent
}

export function createCorrectExamEvent(
  examId: BigInt,
  answers: string,
  etherAccumulated: BigInt
): CorrectExam {
  let correctExamEvent = changetype<CorrectExam>(newMockEvent())

  correctExamEvent.parameters = new Array()

  correctExamEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )
  correctExamEvent.parameters.push(
    new ethereum.EventParam("answers", ethereum.Value.fromString(answers))
  )
  correctExamEvent.parameters.push(
    new ethereum.EventParam(
      "etherAccumulated",
      ethereum.Value.fromUnsignedBigInt(etherAccumulated)
    )
  )

  return correctExamEvent
}

export function createCreateExamEvent(
  id: BigInt,
  name: string,
  description: string,
  endTime: BigInt,
  questions: Array<string>,
  answers: string,
  price: BigInt,
  baseScore: BigInt,
  imageUrl: string,
  users: Array<Address>,
  etherAccumulated: BigInt,
  certifier: Address,
  maxSubmissions: BigInt,
  userClaimsWithPassword: boolean
): CreateExam {
  let createExamEvent = changetype<CreateExam>(newMockEvent())

  createExamEvent.parameters = new Array()

  createExamEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "questions",
      ethereum.Value.fromStringArray(questions)
    )
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam("answers", ethereum.Value.fromString(answers))
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "baseScore",
      ethereum.Value.fromUnsignedBigInt(baseScore)
    )
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam("imageUrl", ethereum.Value.fromString(imageUrl))
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam("users", ethereum.Value.fromAddressArray(users))
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "etherAccumulated",
      ethereum.Value.fromUnsignedBigInt(etherAccumulated)
    )
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam("certifier", ethereum.Value.fromAddress(certifier))
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "maxSubmissions",
      ethereum.Value.fromUnsignedBigInt(maxSubmissions)
    )
  )
  createExamEvent.parameters.push(
    new ethereum.EventParam(
      "userClaimsWithPassword",
      ethereum.Value.fromBoolean(userClaimsWithPassword)
    )
  )

  return createExamEvent
}

export function createEngagementRewardClaimFailedEvent(
  message: string
): EngagementRewardClaimFailed {
  let engagementRewardClaimFailedEvent =
    changetype<EngagementRewardClaimFailed>(newMockEvent())

  engagementRewardClaimFailedEvent.parameters = new Array()

  engagementRewardClaimFailedEvent.parameters.push(
    new ethereum.EventParam("message", ethereum.Value.fromString(message))
  )

  return engagementRewardClaimFailedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRemoveExamWithXpEvent(examId: BigInt): RemoveExamWithXp {
  let removeExamWithXpEvent = changetype<RemoveExamWithXp>(newMockEvent())

  removeExamWithXpEvent.parameters = new Array()

  removeExamWithXpEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )

  return removeExamWithXpEvent
}

export function createRemoveFromWhitelistEvent(
  user: Address
): RemoveFromWhitelist {
  let removeFromWhitelistEvent = changetype<RemoveFromWhitelist>(newMockEvent())

  removeFromWhitelistEvent.parameters = new Array()

  removeFromWhitelistEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )

  return removeFromWhitelistEvent
}

export function createSetExamCreationFeeEvent(fee: BigInt): SetExamCreationFee {
  let setExamCreationFeeEvent = changetype<SetExamCreationFee>(newMockEvent())

  setExamCreationFeeEvent.parameters = new Array()

  setExamCreationFeeEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return setExamCreationFeeEvent
}

export function createSetFeeCollectorEvent(
  feeCollector: Address
): SetFeeCollector {
  let setFeeCollectorEvent = changetype<SetFeeCollector>(newMockEvent())

  setFeeCollectorEvent.parameters = new Array()

  setFeeCollectorEvent.parameters.push(
    new ethereum.EventParam(
      "feeCollector",
      ethereum.Value.fromAddress(feeCollector)
    )
  )

  return setFeeCollectorEvent
}

export function createSetPausedEvent(paused: boolean): SetPaused {
  let setPausedEvent = changetype<SetPaused>(newMockEvent())

  setPausedEvent.parameters = new Array()

  setPausedEvent.parameters.push(
    new ethereum.EventParam("paused", ethereum.Value.fromBoolean(paused))
  )

  return setPausedEvent
}

export function createSetPriceFeedEvent(priceFeed: Address): SetPriceFeed {
  let setPriceFeedEvent = changetype<SetPriceFeed>(newMockEvent())

  setPriceFeedEvent.parameters = new Array()

  setPriceFeedEvent.parameters.push(
    new ethereum.EventParam("priceFeed", ethereum.Value.fromAddress(priceFeed))
  )

  return setPriceFeedEvent
}

export function createSetRequiresSignatureEvent(
  requiresSignature: boolean
): SetRequiresSignature {
  let setRequiresSignatureEvent =
    changetype<SetRequiresSignature>(newMockEvent())

  setRequiresSignatureEvent.parameters = new Array()

  setRequiresSignatureEvent.parameters.push(
    new ethereum.EventParam(
      "requiresSignature",
      ethereum.Value.fromBoolean(requiresSignature)
    )
  )

  return setRequiresSignatureEvent
}

export function createSetSignerEvent(signer: Address): SetSigner {
  let setSignerEvent = changetype<SetSigner>(newMockEvent())

  setSignerEvent.parameters = new Array()

  setSignerEvent.parameters.push(
    new ethereum.EventParam("signer", ethereum.Value.fromAddress(signer))
  )

  return setSignerEvent
}

export function createSetSubmissionFeeEvent(fee: BigInt): SetSubmissionFee {
  let setSubmissionFeeEvent = changetype<SetSubmissionFee>(newMockEvent())

  setSubmissionFeeEvent.parameters = new Array()

  setSubmissionFeeEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return setSubmissionFeeEvent
}

export function createSetTimeToCorrectExamEvent(
  time: BigInt
): SetTimeToCorrectExam {
  let setTimeToCorrectExamEvent =
    changetype<SetTimeToCorrectExam>(newMockEvent())

  setTimeToCorrectExamEvent.parameters = new Array()

  setTimeToCorrectExamEvent.parameters.push(
    new ethereum.EventParam("time", ethereum.Value.fromUnsignedBigInt(time))
  )

  return setTimeToCorrectExamEvent
}

export function createSetUsernameEvent(
  user: Address,
  username: string
): SetUsername {
  let setUsernameEvent = changetype<SetUsername>(newMockEvent())

  setUsernameEvent.parameters = new Array()

  setUsernameEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  setUsernameEvent.parameters.push(
    new ethereum.EventParam("username", ethereum.Value.fromString(username))
  )

  return setUsernameEvent
}

export function createStoppedEvent(): Stopped {
  let stoppedEvent = changetype<Stopped>(newMockEvent())

  stoppedEvent.parameters = new Array()

  return stoppedEvent
}

export function createSubmitAnswersEvent(
  user: Address,
  examId: BigInt,
  hashedAnswer: Bytes
): SubmitAnswers {
  let submitAnswersEvent = changetype<SubmitAnswers>(newMockEvent())

  submitAnswersEvent.parameters = new Array()

  submitAnswersEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  submitAnswersEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )
  submitAnswersEvent.parameters.push(
    new ethereum.EventParam(
      "hashedAnswer",
      ethereum.Value.fromFixedBytes(hashedAnswer)
    )
  )

  return submitAnswersEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createUpdateExamXpEvent(
  examId: BigInt,
  xp: BigInt
): UpdateExamXp {
  let updateExamXpEvent = changetype<UpdateExamXp>(newMockEvent())

  updateExamXpEvent.parameters = new Array()

  updateExamXpEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )
  updateExamXpEvent.parameters.push(
    new ethereum.EventParam("xp", ethereum.Value.fromUnsignedBigInt(xp))
  )

  return updateExamXpEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}

export function createUserFailedEvent(
  user: Address,
  examId: BigInt,
  answers: string
): UserFailed {
  let userFailedEvent = changetype<UserFailed>(newMockEvent())

  userFailedEvent.parameters = new Array()

  userFailedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  userFailedEvent.parameters.push(
    new ethereum.EventParam("examId", ethereum.Value.fromUnsignedBigInt(examId))
  )
  userFailedEvent.parameters.push(
    new ethereum.EventParam("answers", ethereum.Value.fromString(answers))
  )

  return userFailedEvent
}
