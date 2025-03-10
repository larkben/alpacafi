import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ZERO_ADDRESS } from '@alephium/web3'
import { PriceFetcher } from '../artifacts/ts';

const deployLoan: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const result = await deployer.deployContract(PriceFetcher, {
    initialFields: {
      oracle: "",
      btcPrice: 0n,
      wbtcPrice: 0n,
      ethPrice: 0n,
      usdcPrice: 0n,
      alphPrice: 0n,
      ayinPrice: 0n
    }
  })

  const contractId = result.contractInstance.contractId
  const contractAddress = result.contractInstance.address
  console.log(`Price Fetcher: ${contractAddress}, contract id: ${contractId}`)
}

export default deployLoan