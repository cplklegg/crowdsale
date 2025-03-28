import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { ethers } from 'ethers';

//Components 
import Navigation from './Navigation';

function App() {
	
	const loadBlockchainData = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		console.log(provider)
	}

	useEffect(() => {
		loadBlockchainData()
	});

	return(
		<Container>
			<Navigation />
		</Container>
	)
}

export default App;
