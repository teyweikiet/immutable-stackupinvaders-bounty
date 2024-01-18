window.passport = new window.immutable.passport.Passport({
  baseConfig: new window.immutable.config.ImmutableConfiguration({
    environment: window.immutable.config.Environment.SANDBOX
  }),
  // TODO: Replace clientId
  clientId: 'YVyMAGh696acPzo9vDPJl0dK1iEdvtIe', // process.env.PASSPORT_CLIENT_ID,
  // TODO: Replace redirectUri
  redirectUri: 'https://immutable-stackupinvaders-bounty.netlify.app', // process.env.PASSPORT_REDIRECT_URI,
  // TODO: Replace logoutRedirectUri
  logoutRedirectUri: 'https://immutable-stackupinvaders-bounty.netlify.app/logout.html', // process.env.PASSPORT_LOGOUT_REDIRECT_URI,
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
})
