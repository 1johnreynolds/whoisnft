const WalletCard = () => {
	return (
		<div className="w-1/4 mr-3 mb-4 bg-slate-100 rounded-md" >
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div className='accountDisplay'>
				<div> {defaultAccount} </div> 
			</div>
		</div>
	);
}

export default WalletCard;