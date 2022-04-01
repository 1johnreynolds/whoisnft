
import NftCard from '../components/nftcard';
import {fetchNFTs} from '../utils/fetchNFTs';
import React, {useState} from 'react'


const Explore = () => {

    const [owner, setOwner] = useState("")
    const [contractAddress, setContractAddress] = useState("")
    const [NFTs, setNFTs] = useState("")
    const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			console.log('MetaMask Here!');

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
        setOwner(newAccount)

	}


	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}

	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

    return (
        <div>
            <header className=' py-24  mb-12 w-full custom'>
                <div className='flex-grow flex justify-end mr-12 mb-12'>
                </div>
                <div className='flex flex-col items-center mb-12'>
                    <div className='mb-16 text-white text-center'>
                        <h1 className='text-5xl font-bold font-body mb-1'>
                            WHOISNFT?                        </h1>
                        <p>Search NFT metadata from wallet address</p>
                    </div>
                    
                    <div className='flex flex-col items-center justify-center mb-4 w-2/6 gap-y-2 '>
                        <button className='py-3 bg-white rounded-lg w-full hover:bg-slate-100' onClick={connectWalletHandler}>{connButtonText}</button>
			            <div className='accountDisplay'></div>
                        <input className="border rounded-lg focus:outline-none py-2 px-3 w-full" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder='Insert your wallet address'></input>
                    </div>
                    <div className='w-2/6 flex justify-center'>
                    <button className='py-3 bg-white rounded-lg w-full hover:bg-slate-100' onClick={() => {fetchNFTs(owner, contractAddress, setNFTs)}}>Search</button>
                    </div>
                </div>
            </header>

            <section className='flex flex-wrap justify-center'>
                {
                    NFTs ? NFTs.map(NFT => {
                        
                        return (
                          
                           <NftCard key={NFT.value.id + NFT.value.contractAddress} id={NFT.value.id} title={NFT.value.title} description={NFT.value.description} address={NFT.value.contractAddress} attributes={NFT.value.attributes}></NftCard>
                        )
                    }) : <div>No NFTs found</div>
                }
            </section>
        </div>
    )
}


export default Explore