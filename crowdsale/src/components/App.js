import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { ethers } from 'ethers';

//Components 
import Navigation from './Navigation';

function App() {

	const [account, setAccount] = useState(null);

	// account -> Variable of current account value
	// setAccount('0x0...') -> Function to update account value
	// null is a default value
	
	const loadBlockchainData = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		console.log(provider)

		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})
		const account = ethers.utils.getAddress(accounts[0])
		console.log(account)
		setAccount(account)


		// Add to state
	}

	useEffect(() => {
		loadBlockchainData()
	});

	return(
		<Container>
			<Navigation />
			{/* { Read from state} */}
			<div>{account}</div>
		</Container>
	)
}

export default App;
