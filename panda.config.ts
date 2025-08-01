import { defineConfig } from "@pandacss/dev"
import { createPreset } from '@park-ui/panda-preset'
import neutral from '@park-ui/panda-preset/colors/neutral'
import sand from '@park-ui/panda-preset/colors/sand'

export default defineConfig({
    // Whether to use css reset
    preflight: true,

    presets: [createPreset({ accentColor: neutral, grayColor: sand, radius: 'sm' })],

    // Where to look for your css declarations
    include: ["./entrypoints/**/*.{js,jsx,ts,tsx}"],

    jsxFramework: 'solid',

    // Files to exclude
    exclude: [],

    // The output directory for your css system
    outdir: "styled-system",
})