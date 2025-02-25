import {
    ALPH_TOKEN_ID,
    Address,
    NodeProvider,
    ONE_ALPH,
    addressFromContractId,
    contractIdFromAddress,
    groupOfAddress,
} from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { getSigners, testAddress } from "@alephium/web3-test";
import { randomP2PKHAddress, alph, defaultSigner, getContractCreated, getPreciseALPHBalance } from "./helperFunctions";
import { AddPair, AuctionFactoryInstance, AuctionInstance, LoanFactoryInstance, LoanInstance, TestOracleInstance } from "../../artifacts/ts";
import { AddPairService, deployTestOracle, EditOracleTime, UpdateValueService } from "./priceOracleServices";
import { deployAuctionFactory, deployAuctionTemplate } from "./auctionFactoryServices";
import { AddCollateralService, CreateLoanService, deployLoanFactory, deployLoanTemplate, RemoveCollateralService, TokenMappingService } from "./loanFactoryServices";
import { assert } from "console";
  
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
      loanFactoryTemplate = (await deployLoanFactory(loanTemplate, auctionFactoryTemplate, oracleTemplate)).contractInstance

      console.log("Oracle Address: " + oracleTemplate.address)
      console.log("Loan Factory Address: " + loanFactoryTemplate.address + "\nLoan Address: " + loanTemplate.address + "\nAuction Factory Address: " + auctionFactoryTemplate.address + "\nAuction Address: " + auctionTemplate.address)

      // define oracle mappings
      await AddPairService(defaultSigner, oracleTemplate, "ALPH/USD")

      await UpdateValueService(defaultSigner, oracleTemplate, "ALPH/USD", 55933773n)

      // define loan factory mappings
      await TokenMappingService(defaultSigner, loanFactoryTemplate, ALPH_TOKEN_ID, true, "ALPH/USD", 18n, true)

    }, 100000);
  
    test('create loan, edit collateral, cancel loan', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000)

      let tx = await CreateLoanService(creator, loanFactoryTemplate, ALPH_TOKEN_ID, ONE_ALPH * 5n, ALPH_TOKEN_ID, ONE_ALPH * 12n, 1000n, 360000n, true)

      let loan = await getContractCreated(tx.txId)

      // edit collateral

      let loanBalance = await getPreciseALPHBalance(addressFromContractId(loan))
      //console.log(loanBalance)

      await AddCollateralService(creator, loanFactoryTemplate, loan, ALPH_TOKEN_ID, ONE_ALPH)

      loanBalance = await getPreciseALPHBalance(addressFromContractId(loan))
      
      expect(loanBalance).toEqual("13301000000000000000")

      // would the user be able to continually remove collateral despite not having any dust left?
      await RemoveCollateralService(creator, loanFactoryTemplate, loan, ONE_ALPH)

      loanBalance = await getPreciseALPHBalance(addressFromContractId(loan))

      // removes 1 dustAmount!()
      expect(loanBalance).toEqual("12300000000000000000")
        
    })

    /*
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
    */

    //? no liquidation loans
});