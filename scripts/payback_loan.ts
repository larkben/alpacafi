import { getSigner } from "@alephium/web3-test"
import { ALPH_TOKEN_ID, DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT, NodeProvider, ONE_ALPH, SignerProvider, addressVal, binToHex, byteVecVal, encodePrimitiveValues, stringToHex, u256Val } from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { DeployFunction, Deployer, Network } from "@alephium/cli";
import { Settings } from "../alephium.config";
import { loadDeployments } from "../artifacts/ts/deployments";
import { getNetwork } from "./network";
import { AcceptLoan, CreateLoan, PayLoan } from "../artifacts/ts";

const dotenv = require('dotenv');
dotenv.config()

const nodeProvider = new NodeProvider('https://node.mainnet.alephium.org')                  // Mainnet
const signer = new PrivateKeyWallet({ privateKey: String(process.env.key), nodeProvider })

const deployScript: DeployFunction<Settings> = async (
    deployer: Deployer,
    network: Network<Settings>
  ): Promise<void> => {
    const upgradeNetwork = getNetwork()
    
    let tx = await PayLoan.execute(signer, {
      initialFields: {
          loanFactory: "e8b899d2238e845321762afb6046afe6898fd37cd4140b3176349006850a9800",
          contract: "f0f96513599b89018cfd93ce37218fcf6d453b1f5af2b9265f203ca875f91200"
      },
      attoAlphAmount: DUST_AMOUNT + (MINIMAL_CONTRACT_DEPOSIT * 2n),
      tokens: [{id: ALPH_TOKEN_ID, amount: ONE_ALPH * 5n}]
    })

    // should add this everywhere
    console.log(tx.txId)
  }
  
  export default deployScript