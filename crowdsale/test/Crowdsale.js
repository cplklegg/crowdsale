const {expect} = require('chai');
const {ethers} = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe ('Crowdsale', () => {

	let crowdsale, token
	let accounts, deployer, user1

	beforeEach(async () => {
		//Load Contracts
		const Crowdsale = await ethers.getContractFactory('Crowdsale')
		const Token = await ethers.getContractFactory('Token')

		//Deploy Token
		token = await Token.deploy('Dapp University', 'DAPP', '1000000')

		//Configure Accounts
		accounts = await ethers.getSigners()
		deployer = accounts[0]
		user1 = accounts[1]

		//Deploy Crowdsale
		crowdsale = await Crowdsale.deploy(token.address, ether(1), '1000000')

		//Send tokens to crowdsale
		let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(1000000))
		await transaction.wait()
	})	

	describe('Deployment', () => {
		
		it('sends tokens to the Crowdsale contract', async () => {			
			expect(await token.balanceOf(crowdsale.address)).to.eq(tokens(1000000))
		})

		it('returns the price', async () => {			
			expect(await crowdsale.price()).to.eq(ether(1))
		})

		it('returns token address', async () => {			
			expect(await crowdsale.token()).to.eq(token.address)
		})
	})

	describe('Buying Tokens', () => {
		let transaction, result
		let amount = tokens(10)

		describe('Success', () => {
			beforeEach(async () => {
				transaction = await crowdsale.connect(user1).buyTokens(amount, { value: ether(10) })
				result = await transaction.wait()
			})

			it('transfers tokens', async () => {				
				expect(await token.balanceOf(crowdsale.address)).to.eq(tokens(999990))
				expect(await token.balanceOf(user1.address)).to.eq(amount)
			})

			it('updates contracts ether balance', async () => {					
				expect(await ethers.provider.getBalance(crowdsale.address)).to.eq(amount)
			})

			it('updates tokensSold', async () => {					
				expect(await crowdsale.tokensSold()).to.eq(amount)
			})

			it('emits a buy event', async () => {					
				// --> https://hardhat.org.hardhat-chai-matchers/docs/reference#.emit
				await expect(transaction).to.emit(crowdsale, 'Buy')
				.withArgs(amount, user1.address)
			})

		})
		
		describe('Failure', () => {

			it('rejects insufficient ETH', async () => {
				await expect(crowdsale.connect(user1).buyTokens(tokens(10), { value: 0 })).to.be.reverted
			})

		})

	})

})