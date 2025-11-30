import {
  AddExamWithXp as AddExamWithXpEvent,
  AddeToWhitelist as AddeToWhitelistEvent,
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  ClaimNFT as ClaimNFTEvent,
  ClaimRefund as ClaimRefundEvent,
  CorrectExam as CorrectExamEvent,
  CreateExam as CreateExamEvent,
  EngagementRewardClaimFailed as EngagementRewardClaimFailedEvent,
  Initialized as InitializedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RemoveExamWithXp as RemoveExamWithXpEvent,
  RemoveFromWhitelist as RemoveFromWhitelistEvent,
  SetExamCreationFee as SetExamCreationFeeEvent,
  SetFeeCollector as SetFeeCollectorEvent,
  SetPaused as SetPausedEvent,
  SetPriceFeed as SetPriceFeedEvent,
  SetRequiresSignature as SetRequiresSignatureEvent,
  SetSigner as SetSignerEvent,
  SetSubmissionFee as SetSubmissionFeeEvent,
  SetTimeToCorrectExam as SetTimeToCorrectExamEvent,
  SetUsername as SetUsernameEvent,
  Stopped as StoppedEvent,
  SubmitAnswers as SubmitAnswersEvent,
  Transfer as TransferEvent,
  UpdateExamXp as UpdateExamXpEvent,
  Upgraded as UpgradedEvent,
  UserFailed as UserFailedEvent
} from "../generated/Certifier/Certifier"
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
} from "../generated/schema"
import { Bytes } from "@graphprotocol/graph-ts"

export function handleAddExamWithXp(event: AddExamWithXpEvent): void {
  let entity = new AddExamWithXp(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.examId = event.params.examId
  entity.xp = event.params.xp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAddeToWhitelist(event: AddeToWhitelistEvent): void {
  let entity = new AddeToWhitelist(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleClaimNFT(event: ClaimNFTEvent): void {
  let entity = new ClaimNFT(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.examId = event.params.examId
  entity.answers = event.params.answers
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleClaimRefund(event: ClaimRefundEvent): void {
  let entity = new ClaimRefund(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.examId = event.params.examId
  entity.user = event.params.user
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCorrectExam(event: CorrectExamEvent): void {
  let entity = new CorrectExam(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.examId = event.params.examId
  entity.answers = event.params.answers
  entity.etherAccumulated = event.params.etherAccumulated

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCreateExam(event: CreateExamEvent): void {
  let entity = new CreateExam(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.internal_id = event.params.id
  entity.name = event.params.name
  entity.description = event.params.description
  entity.endTime = event.params.endTime
  entity.questions = event.params.questions
  entity.answers = event.params.answers
  entity.price = event.params.price
  entity.baseScore = event.params.baseScore
  entity.imageUrl = event.params.imageUrl
  entity.users = changetype<Bytes[]>(event.params.users)
  entity.etherAccumulated = event.params.etherAccumulated
  entity.certifier = event.params.certifier
  entity.maxSubmissions = event.params.maxSubmissions
  entity.userClaimsWithPassword = event.params.userClaimsWithPassword

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEngagementRewardClaimFailed(
  event: EngagementRewardClaimFailedEvent
): void {
  let entity = new EngagementRewardClaimFailed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.message = event.params.message

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRemoveExamWithXp(event: RemoveExamWithXpEvent): void {
  let entity = new RemoveExamWithXp(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.examId = event.params.examId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRemoveFromWhitelist(
  event: RemoveFromWhitelistEvent
): void {
  let entity = new RemoveFromWhitelist(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetExamCreationFee(event: SetExamCreationFeeEvent): void {
  let entity = new SetExamCreationFee(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetFeeCollector(event: SetFeeCollectorEvent): void {
  let entity = new SetFeeCollector(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.feeCollector = event.params.feeCollector

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetPaused(event: SetPausedEvent): void {
  let entity = new SetPaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.paused = event.params.paused

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetPriceFeed(event: SetPriceFeedEvent): void {
  let entity = new SetPriceFeed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.priceFeed = event.params.priceFeed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetRequiresSignature(
  event: SetRequiresSignatureEvent
): void {
  let entity = new SetRequiresSignature(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.requiresSignature = event.params.requiresSignature

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetSigner(event: SetSignerEvent): void {
  let entity = new SetSigner(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.signer = event.params.signer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetSubmissionFee(event: SetSubmissionFeeEvent): void {
  let entity = new SetSubmissionFee(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fee = event.params.fee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetTimeToCorrectExam(
  event: SetTimeToCorrectExamEvent
): void {
  let entity = new SetTimeToCorrectExam(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.time = event.params.time

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetUsername(event: SetUsernameEvent): void {
  let entity = new SetUsername(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.username = event.params.username

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStopped(event: StoppedEvent): void {
  let entity = new Stopped(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubmitAnswers(event: SubmitAnswersEvent): void {
  let entity = new SubmitAnswers(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.examId = event.params.examId
  entity.hashedAnswer = event.params.hashedAnswer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateExamXp(event: UpdateExamXpEvent): void {
  let entity = new UpdateExamXp(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.examId = event.params.examId
  entity.xp = event.params.xp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserFailed(event: UserFailedEvent): void {
  let entity = new UserFailed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.examId = event.params.examId
  entity.answers = event.params.answers

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
