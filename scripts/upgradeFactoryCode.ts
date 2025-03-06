import { getSigner } from "@alephium/web3-test"
import { ALPH_TOKEN_ID, DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT, NodeProvider, ONE_ALPH, SignerProvider, addressVal, binToHex, byteVecVal, encodePrimitiveValues, stringToHex, u256Val } from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { DeployFunction, Deployer, Network } from "@alephium/cli";
import { Settings } from "../alephium.config";
import { loadDeployments } from "../artifacts/ts/deployments";
import { getNetwork } from "./network";
import { AuctionFactory, Loan, LoanFactory, UpdateAuctionFactoryCode, UpdateLoanCode, UpdateLoanFactoryCode } from "../artifacts/ts";

const dotenv = require('dotenv');
dotenv.config()

const nodeProvider = new NodeProvider('https://node.mainnet.alephium.org')                  // Mainnet
const signer = new PrivateKeyWallet({ privateKey: String(process.env.key), nodeProvider })

const deployScript: DeployFunction<Settings> = async (
    deployer: Deployer,
    network: Network<Settings>
  ): Promise<void> => {
    const upgradeNetwork = getNetwork()
    
    await UpdateLoanFactoryCode.execute(signer, {
      initialFields: {
        loanFactory: "e1cc79ca2a9c3143426ffc3fbab5ac14550cb7c4ef94793598101b31cf831900",
        newCode: LoanFactory.contract.bytecode
      },
      attoAlphAmount: DUST_AMOUNT
    })
  }
  
  export default deployScript