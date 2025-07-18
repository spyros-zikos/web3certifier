import { defineRecipe } from "@chakra-ui/react"

const textRecipe = defineRecipe({
  base: {
    color: "neutral",
  },
  // TODO: fix variants
  variants: {
    visual: {
      solid: { bg: "red.200", color: "white" },
      outline: { borderWidth: "1px", borderColor: "red.200" },
    },
    size: {
      sm: { padding: "4", fontSize: "12px" },
      lg: { padding: "8", fontSize: "24px" },
    },
  },
});

export default textRecipe;