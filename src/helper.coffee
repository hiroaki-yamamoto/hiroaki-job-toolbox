module.exports =
  thirdPartyBlackLists: [
    "third_party", "thirdParty", "thirdparty", "3rdparty", "3rd_party",
    "3rdParty", "external"
  ]
  isProduction: (
    process.env.CI or process.env.node_mode is "production" or
    process.env.NODE_ENV is "production"
  )
