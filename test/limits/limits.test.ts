import {
    ALPH_TOKEN_ID,
    Address,
    MINIMAL_CONTRACT_DEPOSIT,
    NodeProvider,
    ONE_ALPH,
    addressFromContractId,
    contractIdFromAddress,
    groupOfAddress,
    node,
} from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { getSigners, testAddress } from "@alephium/web3-test";
import { randomP2PKHAddress, alph, defaultSigner, getContractCreated, getPreciseALPHBalance, CreateTokenService } from "../p2p/helperFunctions";
import { ForLoopInstance, TestCycle } from "../../artifacts/ts";
import { loopTemplate, TestCycleService } from "./limitServices";
  
const nodeProvider = new NodeProvider("http://127.0.0.1:22973");
  
describe("lending p2p coverage + tests", () => {
    const groupIndex = groupOfAddress(testAddress);

    let forloopTemplate: ForLoopInstance
  
    let lister: Address;
    let buyer: PrivateKeyWallet[];
  
    beforeEach(async () => {

      lister = randomP2PKHAddress(groupIndex);
      buyer = await getSigners(2, alph(1000), groupIndex);

      forloopTemplate = (await loopTemplate()).contractInstance

    }, 100000);
  
    test('testcycle', async () => {
      const creator = buyer[0]

      // we need to build the typescript service lmao XD
      let cycle = await TestCycleService(creator, forloopTemplate)

      console.log(await nodeProvider.contracts.getContractsAddressState(forloopTemplate.address))
    });
})

// gas estimates -----------------------------
// loop spent gas (maxmial ~ 95000):   4977417
// loop spent gas (1):                   30865
// basic tx:                             30795
// maximal gas:                        5000000