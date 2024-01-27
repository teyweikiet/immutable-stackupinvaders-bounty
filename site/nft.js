const config = {
  baseConfig: new window.immutable.config.ImmutableConfiguration({
    environment: window.immutable.config.Environment.SANDBOX
  })
}

const client = new window.immutable.blockchainData.BlockchainData(config)

const CHAIN_NAME = 'imtbl-zkevm-testnet'
// TODO: Replace CONTRACT_ADDRESS
const CONTRACT_ADDRESS = '0x1eac82d5cdc4b3663c5a437ddd0acfbb91f353e9'

const getNftMetadata = async (tokenId) => {
  try {
    const { result } = await client.getNFT({
      chainName: CHAIN_NAME,
      contractAddress: CONTRACT_ADDRESS,
      tokenId,
    });
    return result
  } catch (error) {
    console.error(error)
  }
}

window.addEventListener('load', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const nftCard = document.getElementById('nft-card')
  const title = document.getElementById('title')

  const nft = id && await getNftMetadata(id)
  const attributesHtml = nft?.attributes?.length
    ? `<div class="row">
        ${
          nft.attributes.map(({ trait_type, value }) => `
            <div class="card col-4 m-4">
              <p style="color: grey; margin: 0; font-weight: bold;">${trait_type}</p>
              <p style="margin: 0; font-weight: bold;">${value}</p>
            </div>
          `)
        }
      </div>`
    : ''
  title.innerHTML = `NFT Badge (Token ID: ${id})`
  nftCard.innerHTML = nft
    ? `<div class="media">
        <img src='${nft.image}' class="mr-3 img-thumbnail" alt="nft" style="width: 30%;">
        <div class="media-body">
          <h5 class="card-title">${nft.name}</h5>
          <p class="card-text">${nft.description}</p>
        </div>
      </div>
      ${attributesHtml}`
    : 'No NFTs found.'
})
