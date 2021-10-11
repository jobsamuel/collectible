const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('NFT', function () {
  it('Should return nft basic info.', async function () {
    const NFT = await ethers.getContractFactory('Collectible')
    const nft = await NFT.deploy('Collectible', 'CC', 20, 3)
    await nft.deployed()

    expect(await nft.name()).to.equal('Collectible')
    expect(await nft.symbol()).to.equal('CC')
  })

  it('Should mint nft', async function () {
    const signers = await ethers.getSigners()
    const NFT = await ethers.getContractFactory('Collectible')
    const nft = await NFT.deploy('Collectible', 'CC', 20, 3)
    await nft.deployed()

    const uri = 'https://jobsa.co'
    await expect(nft.createCollectible(uri))
      .to.emit(nft, 'CollectibleMinted')
      .withArgs(signers[0].address, 0, uri)

    expect(await nft.tokenURI(0)).to.equal(uri)
  })

  it('Should limit mint per contract', async function () {
    const NFT = await ethers.getContractFactory('Collectible')
    const nft = await NFT.deploy('Collectible', 'CC', 20, 20)
    await nft.deployed()

    const uri = 'https://jobsa.co'

    for (let index = 0; index < 20; index++) {
      await nft.createCollectible(uri)
    }

    await expect(nft.createCollectible(uri)).to.be.revertedWith(
      'Mint limit reached.'
    )
  })

  it('Should limit mint per account', async function () {
    const signers = await ethers.getSigners()
    const NFT = await ethers.getContractFactory('Collectible')
    const nft = await NFT.deploy('Collectible', 'CC', 20, 3)
    await nft.deployed()

    const uri = 'https://jobsa.co'

    for (let index = 0; index < 3; index++) {
      await nft.connect(signers[0]).createCollectible(uri)
    }

    await expect(
      nft.connect(signers[0]).createCollectible(uri)
    ).to.be.revertedWith('You can not mint more NFTs.')
    await expect(nft.connect(signers[1]).createCollectible(uri))
      .to.emit(nft, 'CollectibleMinted')
      .withArgs(signers[1].address, 3, uri)
  })

  it('Should transfer nft', async function () {
    const signers = await ethers.getSigners()
    const NFT = await ethers.getContractFactory('Collectible')
    const nft = await NFT.deploy('Collectible', 'CC', 20, 3)
    await nft.deployed()

    const uri = 'https://jobsa.co'
    await nft.createCollectible(uri)

    expect(await nft.balanceOf(signers[0].address)).to.equal(1)

    await expect(
      nft['safeTransferFrom(address,address,uint256)'](
        signers[0].address,
        signers[1].address,
        0
      )
    )
      .to.emit(nft, 'Transfer')
      .withArgs(signers[0].address, signers[1].address, 0)

    expect(await nft.balanceOf(signers[0].address)).to.equal(0)
  })
})
