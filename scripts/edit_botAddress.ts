import { getSigner } from "@alephium/web3-test"
import { ALPH_TOKEN_ID, DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT, NodeProvider, SignerProvider, addressVal, binToHex, byteVecVal, encodePrimitiveValues, stringToHex, u256Val } from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { DeployFunction, Deployer, Network } from "@alephium/cli";
import { Settings } from "../alephium.config";
import { loadDeployments } from "../artifacts/ts/deployments";
import { getNetwork } from "./network";
import { TokenMapping, UpdateBotAddress } from "../artifacts/ts";

const dotenv = require('dotenv');
dotenv.config()

const nodeProvider = new NodeProvider('https://node.mainnet.alephium.org')                  // Mainnet
const signer = new PrivateKeyWallet({ privateKey: String(process.env.key), nodeProvider })

// adds oracle support to call pair; example ('ALPH/USD')
const deployScript: DeployFunction<Settings> = async (
    deployer: Deployer,
    network: Network<Settings>
  ): Promise<void> => {
    const upgradeNetwork = getNetwork()
    
    await UpdateBotAddress.execute(signer, {
      initialFields: {
          oracle: "02a2a321f3bbab2ecc834191ad9b3db6eafdbd8d791db7fb77c341aeff0e8a00",
          newBot: "1AxRAmNJAg4p6jRmDjLvh1e6z863Cth9wvzU1fRoAeK4i"
          //newBot: "1618v8SuPEQ1jTZnf7ZSaCufBAUZY6rKhXYhQuoHi2AzM"
      },
      attoAlphAmount: DUST_AMOUNT
    })
  }
  
  export default deployScript