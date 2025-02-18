import { getSigner } from "@alephium/web3-test"
import { ALPH_TOKEN_ID, DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT, NodeProvider, ONE_ALPH, SignerProvider, addressVal, binToHex, byteVecVal, encodePrimitiveValues, stringToHex, u256Val } from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { DeployFunction, Deployer, Network } from "@alephium/cli";
import { Settings } from "../alephium.config";
import { loadDeployments } from "../artifacts/ts/deployments";
import { getNetwork } from "./network";
import { ForceCancel, Loan, UpdateLoanCode } from "../artifacts/ts";

const dotenv = require('dotenv');
dotenv.config()

const nodeProvider = new NodeProvider('https://node.mainnet.alephium.org')                  // Mainnet
const signer = new PrivateKeyWallet({ privateKey: String(process.env.key), nodeProvider })

const deployScript: DeployFunction<Settings> = async (
    deployer: Deployer,
    network: Network<Settings>
  ): Promise<void> => {
    const upgradeNetwork = getNetwork()
    /*
    await UpdateLoanCode.execute(signer, {
      initialFields: {
          loan: "38d777236fc0553ea388b43355f01e3ffb8047b2d7c9fe07d9b6fb5aa506be00",
          newCode: Loan.contract.bytecode
      },
      attoAlphAmount: DUST_AMOUNT
    })
    */

    await ForceCancel.execute(signer, {
      initialFields: {
          loan: "38d777236fc0553ea388b43355f01e3ffb8047b2d7c9fe07d9b6fb5aa506be00",
      },
      attoAlphAmount: DUST_AMOUNT
    })
  }
  
  export default deployScript