import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { AddExamWithXp } from "../generated/schema"
import { AddExamWithXp as AddExamWithXpEvent } from "../generated/Certifier/Certifier"
import { handleAddExamWithXp } from "../src/certifier"
import { createAddExamWithXpEvent } from "./certifier-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let examId = BigInt.fromI32(234)
    let xp = BigInt.fromI32(234)
    let newAddExamWithXpEvent = createAddExamWithXpEvent(examId, xp)
    handleAddExamWithXp(newAddExamWithXpEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AddExamWithXp created and stored", () => {
    assert.entityCount("AddExamWithXp", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AddExamWithXp",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "examId",
      "234"
    )
    assert.fieldEquals(
      "AddExamWithXp",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "xp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
