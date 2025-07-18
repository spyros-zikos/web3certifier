import { createSystem, defaultConfig } from '@chakra-ui/react'
import * as foundations from "./foundations"; // Import all foundation tokens
import * as components from "./components"; // Import all component recipes
import globalStyles from "./styles"; // Import global styles

// Create the theme system
const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
            ...foundations, // Spread colors, fonts, breakpoints, etc.
        },
        recipes: {
            ...components, // Spread component recipes
        },
    //     semanticTokens: {
    //         colors: {
    //             accent: { default: {value: "teal.500"}, _dark: {value: "teal.300"} },
    //             danger: { value: "{colors.red.500}" }, // Reference another token
    //         },
    //     },
    },
    // globalCss: globalStyles, // Apply global styles
    // strictTokens: true, // Enforce token usage
})

export default system