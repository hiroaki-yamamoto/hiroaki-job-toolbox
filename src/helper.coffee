module.exports =
  thirdPartyBlackLists: [
    "third_party", "thirdParty", "thirdparty", "3rdparty", "3rd_party",
    "3rdParty", "external"
  ]
  isProduction: process.env.CI or process.env.mode is "production"
