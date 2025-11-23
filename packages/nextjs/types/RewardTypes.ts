export enum DistributionType{
    CUSTOM = "Custom",
    CONSTANT = "Constant",
    UNIFORM = "Uniform",
}

export enum EligibilityType {
    NONE = "None",
    CUSTOM = "Custom",
    HOLDS_TOKEN = "Holds Token",
    HOLDS_NFT = "Holds NFT",
}

export const distributionParameterName = (distributionType: DistributionType) => {
    switch (distributionType) {
        case DistributionType.CONSTANT:
            return "Reward Amount Per User";
        case DistributionType.UNIFORM:
            return "Total Reward Amount";
        default:
            return "Distribution Parameter";
    }
}

export const eligibilityParameterName = (eligibilityType: EligibilityType) => {
    switch (eligibilityType) {
        case EligibilityType.HOLDS_TOKEN:
            return "Elig. Token Address";
        case EligibilityType.HOLDS_NFT:
            return "Elig. NFT Address";
        case EligibilityType.CUSTOM:
            return "Custom Reward Address";
        default:
            return "Eligibility Parameter";
    }
}
