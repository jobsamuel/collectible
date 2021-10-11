// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.4;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Collectible is ERC721, ERC721Enumerable, ERC721URIStorage {
  uint256 private counter; 
  uint256 private totalMintLimit;
  uint256 private mintLimitPerAccount;

  event CollectibleMinted(address, uint256, string);

  constructor (string memory nftName, string memory nftSymbol, uint256 mintLimit, uint256 limitPerAccount) ERC721 (nftName, nftSymbol) {
    counter = 0;
    totalMintLimit = mintLimit;
    mintLimitPerAccount = limitPerAccount;
  }

  function createCollectible(string memory uri) external {
    require(counter < totalMintLimit, "Mint limit reached.");
    require(balanceOf(msg.sender) < mintLimitPerAccount, "You can not mint more NFTs.");
    uint256 newId = counter;
    _safeMint(msg.sender, newId);
    _setTokenURI(newId, uri);
    counter += 1;

    emit CollectibleMinted(msg.sender, newId, uri);
  }
  
  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override (ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override (ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId) public view override (ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override (ERC721, ERC721Enumerable) returns (bool) {
      return super.supportsInterface(interfaceId);
  }
}