import {
    ALPH_TOKEN_ID,
    Address,
    NodeProvider,
    contractIdFromAddress,
    groupOfAddress,
} from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { getSigners, testAddress } from "@alephium/web3-test";
import { randomP2PKHAddress, alph } from "./helperFunctions";
import { AuctionFactoryInstance, AuctionInstance, LoanFactoryInstance, LoanInstance, TestOracleInstance } from "../../artifacts/ts";
import { deployTestOracle } from "./priceOracleServices";
import { deployAuctionFactory, deployAuctionTemplate } from "./auctionFactoryServices";
import { deployLoanTemplate } from "./loanFactoryServices";
  
const nodeProvider = new NodeProvider("http://127.0.0.1:22973");
  
describe("lending p2p coverage + tests", () => {
    const groupIndex = groupOfAddress(testAddress);

    let oracleTemplate: TestOracleInstance
    
    let auctionTemplate: AuctionInstance
    let auctionFactoryTemplate: AuctionFactoryInstance

    let loanTemplate: LoanInstance
    let loanFactoryTemplate: LoanFactoryInstance
  
    let lister: Address;
    let buyer: PrivateKeyWallet[];
  
    beforeEach(async () => {
      lister = randomP2PKHAddress(groupIndex);
      buyer = await getSigners(2, alph(1000), groupIndex);

      oracleTemplate = (await deployTestOracle()).contractInstance

      auctionTemplate = (await deployAuctionTemplate()).contractInstance
      auctionFactoryTemplate = (await deployAuctionFactory(auctionTemplate, oracleTemplate)).contractInstance

      loanTemplate = (await deployLoanTemplate(auctionFactoryTemplate)).contractInstance
    }, 100000);
  
    test('create loan, edit collateral, cancel loan', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      
    
        
    })

    test('create loan, accept loan, repay loan, check fees', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      
    
        
    })

    test('create loan, accept loan, forfeit, auction, bid redeem', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      
    
        
    })

    test('create loan, accept loan, forfeit, auction, instant redeem', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      
    
        
    })

    test('create loan, accept loan, (attempt) liquidation(s)', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      
    
        
    })

    test('create loan, accept loan, liquidation, auction creation, bid, and redeem, check fees', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      
    
        
    })

    test('create loan, accept loan, liquidation, auction creation, instant redeem, check fees', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      
    
        
    })

    //? no liquidation loans
});