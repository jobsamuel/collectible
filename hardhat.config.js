const { task } = require('hardhat/config')
const secret = require('./secret')

require('hardhat-gas-reporter')
require('@nomiclabs/hardhat-waffle')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  gasReporter: {
    currency: 'USD',
  },
  networks: {
    bsctestnet: {
      url: secret.url,
      accounts: [secret.key],
    },
  },
}
