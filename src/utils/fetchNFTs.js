// Go to www.alchemy.com and create an account to grab your own api key!

const endpoint = `https://eth-mainnet.alchemyapi.io/v2/RBKXVhw2V8e8_AKQUS3Zc1Kxy1eYZLjY`;

const getAddressNFTs = async (owner, contractAddress, retryAttempt) => {
    if (retryAttempt === 5) {
        return;
    }
    if (owner) {
        let data;
        try {
            if (contractAddress) {
                data = await fetch(`${endpoint}/getNFTs?owner=${owner}&contractAddresses%5B%5D=${contractAddress}`).then(data => data.json())
            } else {
                data = await fetch(`${endpoint}/getNFTs?owner=${owner}`).then(data => data.json())
            }
        } catch (e) {
            getAddressNFTs(endpoint, owner, contractAddress, retryAttempt+1)
        }

        // NFT token IDs basically
        return data
    }
}

const getNFTsMetadata = async (NFTS) => {
    const NFTsMetadata = await Promise.allSettled(NFTS.map(async (NFT) => {
        console.log("Here");
        const metadata = await fetch(`${endpoint}/getNFTMetadata?contractAddress=${NFT.contract.address}&tokenId=${NFT.id.tokenId}`,).then(data => data.json())
        console.log("Here");
        

        return {
            id: NFT.id.tokenId,
            contractAddress: NFT.contract.address,
            title: metadata.metadata.name,
            description: metadata.metadata.description,
            attributes: metadata.metadata.attributes
        }
    }))

    return NFTsMetadata
}

const fetchNFTs = async (owner, contractAddress, setNFTs) => {
    const data = await getAddressNFTs(owner, contractAddress)
    if (data.ownedNfts.length) {
        const NFTs = await getNFTsMetadata(data.ownedNfts)
        let fullfilledNFTs = NFTs.filter(NFT => NFT.status === "fulfilled")
        setNFTs(fullfilledNFTs)
    } else {
        setNFTs(null)
    }
}

export {fetchNFTs};