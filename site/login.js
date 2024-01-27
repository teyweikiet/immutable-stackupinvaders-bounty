import { ethers, getDefaultProvider } from './libs/ethers-5.6.2.esm.min.js'

window.provider = window.passport.connectEvm()

const connectPassport = async function () {
  window.accounts = await window.provider.request({ method: 'eth_requestAccounts' })
  if (window.accounts) {
    getUserInfo()
  }
}

const config = {
  baseConfig: new window.immutable.config.ImmutableConfiguration({
    environment: window.immutable.config.Environment.SANDBOX
  })
}

const client = new window.immutable.blockchainData.BlockchainData(config)

const getUserInfo = async function () {
  window.userProfile = await window.passport.getUserInfo()
}

const passportLogout = async function () {
  const logout = await window.passport.logout()
  window.userProfile = {}
}

const CHAIN_NAME = 'imtbl-zkevm-testnet'
// TODO: Replace CONTRACT_ADDRESS
const CONTRACT_ADDRESS = '0x1eac82d5cdc4b3663c5a437ddd0acfbb91f353e9' // process.env.CONTRACT_ADDRESS

const CONTRACT_ABI = [
  'function grantRole(bytes32 role, address account)',
  'function MINTER_ROLE() view returns (bytes32)',
  'function mint(address to, uint256 tokenId)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function totalSupply() view returns (uint256)'
]

const NFT_DETAILS = {
  1: {
    image: 'https://bafkreigugjgtcvkwg7ym7uk5ic65wmtkmbngonaj3twzl3nttuj5w7zjku.ipfs.nftstorage.link/',
    name: 'Level 1 Badge',
    description: 'This NFT represents your first accomplishment on StackUp Invaders (twk415).',
    attributes: [
      {
        trait_type: 'Level',
        value: 'Beginner'
      },
      {
        trait_type: 'Ammo',
        value: '1'
      }
    ]
  },
  2: {
    image: 'https://bafkreifxbz53txersuyqok75dmdhyrnfkascznytyvum2i25bunii5dih4.ipfs.nftstorage.link/',
    name: 'Level 2 Badge',
    description: 'This NFT represents your second accomplishment on StackUp Invaders (twk415) which grants you an upgraded spaceship.',
    attributes: [
      {
        trait_type: 'Level',
        value: 'Amateur'
      },
      {
        trait_type: 'Ammo',
        value: '2'
      }
    ]
  },
  3: {
    image: 'https://bafkreifxbz53txersuyqok75dmdhyrnfkascznytyvum2i25bunii5dih4.ipfs.nftstorage.link/',
    name: 'Level 3 Badge',
    description: 'This NFT represents your third accomplishment on StackUp Invaders (twk415).',
    attributes: [
      {
        trait_type: 'Level',
        value: 'Amateur'
      },
      {
        trait_type: 'Ammo',
        value: '3'
      }
    ]
  },
  4: {
    image: 'https://bafkreifxbz53txersuyqok75dmdhyrnfkascznytyvum2i25bunii5dih4.ipfs.nftstorage.link/',
    name: 'Level 4 Badge',
    description: 'This NFT represents your fourth accomplishment on StackUp Invaders (twk415).',
    attributes: [
      {
        trait_type: 'Level',
        value: 'Novice'
      },
      {
        trait_type: 'Ammo',
        value: '4'
      }
    ]
  }
}

async function getData (id) {
  try {
    const nft = document.getElementById('nft')
    const details = NFT_DETAILS[id]

    if (!details) {
      throw new Error('Invalid Token ID')
    }

    nft.innerHTML = `
      <div class="alert alert-success"> Great Score! Claim this NFT, then resume the game.</div>
      <div class="card" >
        <div class="card-body">
          <div class="media">
            <img src='${details.image}' class="mr-3 img-thumbnail" alt="nft" style="width: 30%;">
            <div class="media-body">
              <h5 class="card-title">${details.name}</h5>
              <p class="card-text">${details.description}</p>
            </div>
          </div>
        </div>
        <div class="card-body">
          <button id="claim-btn" class="btn btn-success"> Claim</button>
        </div>
      </div>
    `
    const claimBtn = this.document.getElementById('claim-btn')
    claimBtn.onclick = async function () {
      if (id === '1') {
        await mintNft()
      } else if (id >= '2') {
        await upgradeNft(id)
      }
    }
    return details
  } catch (error) {
    console.error(error)
    alert(error)
  }
}

window.getData = getData

/**
 * List NFTs owned by an account for a contract
 *
 * @return {Object|undefined} NFT metadata
 */
const getNftByAccount = async () => {
  if (!window.accounts?.[0]) {
    return
  }
  try {
    const { result: [nft] } = await client.listNFTsByAccountAddress({
      chainName: CHAIN_NAME,
      accountAddress: window.accounts[0],
      contractAddress: CONTRACT_ADDRESS
    })
    return nft
  } catch (error) {
    console.error(error)
  }
}

const grantMinterRole = async (recipientAddress) => {
  return fetch('/.netlify/functions/grantMinterRole', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ recipientAddress })
  })
    .then(d => d.json())
    .then(async ({ data }) => {
      const tx = ethers.utils.parseTransaction(data)
      return tx
    })
    .then(console.log)
}

// Mint NFTs
const mintNft = async function () {
  if (window?.provider) {
    const provider = new ethers.providers.Web3Provider(window.provider)
    const signer = provider.getSigner()
    const userAddress = await signer.getAddress()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

    try {
      const minterRole = await contract.MINTER_ROLE()
      const hasMinterRole = await contract.hasRole(minterRole, userAddress)

      if (!hasMinterRole) {
        console.log('Account doesnt have permissions to mint.')
        await grantMinterRole(userAddress)
      }

      const TOKEN_ID = await getNextTokenId(contract)

      const currentGasPrice = await provider.getGasPrice()
      // const adjustedGasPrice = currentGasPrice.add(ethers.utils.parseUnits('10', 'gwei'))

      const tx = await contract.mint(userAddress, TOKEN_ID, {
        maxPriorityFeePerGas: 100e9, // 100 Gwei
        maxFeePerGas: 150e9,
        gasLimit: 200000,
      })

      const receipt = await tx.wait()
      console.log('NFT minted successfully!', receipt)
      const nft = document.getElementById('nft')
      nft.innerHTML += `
        <div class="alert alert-success">
          NFT minted successfully! Transaction hash: ${receipt.transactionHash}
          &nbsp;<a href="/nft.html?id=${TOKEN_ID}">View your badge here</a>
        </div>
      `
      showViewBadgeButton(TOKEN_ID)
    } catch (error) {
      console.error('Error minting the first NFT:', error)
    }
  } else {
    console.log('No provider found.')
  }
}

const showViewBadgeButton = function (tokenId) {
  if (tokenId) {
    const btn = window.document.getElementById('view-badge')
    btn.href = `/nft.html?id=${tokenId}`
    btn.hidden = false
  }
}

/**
 * Get user level according to NFT metadata
 *
 * @returns {number} level
 */
const getUserLevel = async function () {
  const nft = await getNftByAccount()
  nft?.token_id && showViewBadgeButton(nft.token_id)
  // determine level based on NFT name
  switch (nft?.name) {
    case 'Level 1 Badge':
      return 1
    case 'Level 2 Badge':
      return 2
    case 'Level 3 Badge':
      return 3
    case 'Level 4 Badge':
      return 4
  }
  return 0
}

window.getUserLevel = getUserLevel

async function getNextTokenId (contract) {
  try {
    const totalSupply = await contract.totalSupply()
    return totalSupply.toNumber() + 1
  } catch (error) {
    console.error('Error getting next token ID:', error)
    return null
  }
}

const upgradeNft = async function (level) {
  try {
    const { token_id } = await getNftByAccount()
    await fetch('./.netlify/functions/upgradeNft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nft_metadata: [
          {
            animation_url: null,
            external_url: null,
            youtube_url: null,
            ...NFT_DETAILS[level],
            token_id
          }
        ]
      })
    })

    const upgradeEvent = new CustomEvent('upgradeSpaceship')
    window.dispatchEvent(upgradeEvent)

    const nft = document.getElementById('nft')
    if (level == '2') {
      nft.innerHTML += `
        <div class="alert alert-success">
          Your spaceship has been upgraded! So has your NFT.
          &nbsp;<a href="/nft.html?id=${token_id}">View your badge here.</a>
        </div>
      `
    } else {
      nft.innerHTML += `
        <div class="alert alert-success">
          Your level is up again! So has your NFT.
          &nbsp;<a href="/nft.html?id=${token_id}">View your badge here</a>
        </div>
      `
    }
  } catch (error) {
    console.error('Error upgrading NFT: ', error)
  }
}

window.addEventListener('load', function () {
  const passportBtn = this.document.getElementById('btn-passport')
  const logoutBtn = this.document.getElementById('btn-logout')

  passportBtn.onclick = function () {
    window.isconnecting = true
    connectPassport()
  }

  logoutBtn.onclick = passportLogout
  window.passport.loginCallback()
})
