import resolveConfig from 'tailwindcss/resolveConfig'

// Using preval cos the docs say so
// See: https://tailwindcss.com/docs/configuration#referencing-in-java-script
// @ts-expect-error preval doesn't actually exist, it's something babel-plugin-preval uses
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export const config = preval`
  const resolveConfig = require('tailwindcss/resolveConfig')
  const tailwindConfig = require('../../tailwind.config.js')

  module.exports = resolveConfig(tailwindConfig)
` as ReturnType<typeof resolveConfig>
