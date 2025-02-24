import {
    ALPH_TOKEN_ID,
    Address,
    NodeProvider,
    contractIdFromAddress,
    groupOfAddress,
} from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { getSigners, testAddress } from "@alephium/web3-test";
import { alph, randomP2PKHAddress } from "../create-token/utils";
  
  const nodeProvider = new NodeProvider("http://127.0.0.1:22973");
  
  describe("lending p2p coverage + tests", () => {
    const groupIndex = groupOfAddress(testAddress);

    //let collectionTemplate: NFTPublicSaleCollectionSequentialWithRoyaltyInstance
  
    let lister: Address;
    let buyer: PrivateKeyWallet[];
  
    beforeEach(async () => {
      lister = randomP2PKHAddress(groupIndex);
      buyer = await getSigners(2, alph(1000), groupIndex);

      //collectionTemplate = (await deployCollection()).contractInstance
    }, 100000);
  
    test('', async () => {
        const creator = buyer[0]
        const spender = buyer[1]
    
        
      })
  });