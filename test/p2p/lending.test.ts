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
import { randomP2PKHAddress, alph, defaultSigner, getContractCreated, getPreciseALPHBalance, CreateTokenService } from "./helperFunctions";
import { AddPair, AuctionFactoryInstance, AuctionInstance, FeeInstance, LoanFactoryInstance, LoanInstance, TestOracleInstance } from "../../artifacts/ts";
import { AddPairService, deployTestOracle, EditOracleTime, UpdateValueService } from "./priceOracleServices";
import { BidService, EditLFAuctionFactoryService, RedeemService, deployAuctionFactory, deployAuctionTemplate } from "./auctionFactoryServices";
import { AcceptLoanService, AddCollateralService, CancelLoanService, CreateLoanService, deployFeeTemplate, deployLoanFactory, deployLoanTemplate, ForfeitLoanService, LiquidateLoanService, PayLoanService, RemoveCollateralService, TokenMappingService, WithdrawLoanFeesService } from "./loanFactoryServices";
  
const nodeProvider = new NodeProvider("http://127.0.0.1:22973");
  
describe("lending p2p coverage + tests", () => {
    const groupIndex = groupOfAddress(testAddress);

    let oracleTemplate: TestOracleInstance
    let feeTemplate: FeeInstance
    
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
      feeTemplate = (await deployFeeTemplate()).contractInstance

      auctionTemplate = (await deployAuctionTemplate()).contractInstance
      auctionFactoryTemplate = (await deployAuctionFactory(auctionTemplate, oracleTemplate)).contractInstance

      loanTemplate = (await deployLoanTemplate(auctionFactoryTemplate)).contractInstance
      loanFactoryTemplate = (await deployLoanFactory(loanTemplate, auctionFactoryTemplate, feeTemplate, oracleTemplate)).contractInstance

      //console.log("Oracle Address: " + oracleTemplate.address)
      //console.log("Loan Factory Address: " + loanFactoryTemplate.address + "\nLoan Address: " + loanTemplate.address + "\nAuction Factory Address: " + auctionFactoryTemplate.address + "\nAuction Address: " + auctionTemplate.address)

      // define oracle mappings
      await AddPairService(defaultSigner, oracleTemplate, "ALPH/USD")
      await AddPairService(defaultSigner, oracleTemplate, "EX/USD")

      await UpdateValueService(defaultSigner, oracleTemplate, "ALPH/USD", 55933773n) // 0.55c
      await UpdateValueService(defaultSigner, oracleTemplate, "EX/USD", 19933773n) // 0.19c

      // define loan factory mappings
      await TokenMappingService(defaultSigner, loanFactoryTemplate, ALPH_TOKEN_ID, true, "ALPH/USD", 18n, true)

      // edit lf for auctionfactory

      await EditLFAuctionFactoryService(defaultSigner, auctionFactoryTemplate, loanFactoryTemplate)

    }, 100000);
  
    test('create loan, edit collateral, cancel loan', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000)

      let tx = await CreateLoanService(creator, loanFactoryTemplate, ALPH_TOKEN_ID, ONE_ALPH * 5n, ALPH_TOKEN_ID, ONE_ALPH * 12n, 1000n, 360000n, true)

      let loan = await getContractCreated(tx.txId)

      // edit collateral

      let loanBalance = await getPreciseALPHBalance(addressFromContractId(loan))

      await AddCollateralService(creator, loanFactoryTemplate, loan, ALPH_TOKEN_ID, ONE_ALPH)

      loanBalance = await getPreciseALPHBalance(addressFromContractId(loan))
      
      expect(loanBalance).toEqual("13301000000000000000")

      await RemoveCollateralService(creator, loanFactoryTemplate, loan, ONE_ALPH)

      loanBalance = await getPreciseALPHBalance(addressFromContractId(loan))

      expect(loanBalance).toEqual("12301000000000000000")

      await RemoveCollateralService(creator, loanFactoryTemplate, loan, ONE_ALPH)

      loanBalance = await getPreciseALPHBalance(addressFromContractId(loan))

      expect(loanBalance).toEqual("11301000000000000000")

      // loan is canceled
      await CancelLoanService(creator, loanFactoryTemplate, loan)
    })

    test('create loan, accept loan, repay loan, check fees', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000)

      let tx = await CreateLoanService(
        creator, 
        loanFactoryTemplate, 
        ALPH_TOKEN_ID, 
        ONE_ALPH * 5n, 
        ALPH_TOKEN_ID, 
        ONE_ALPH * 12n, 
        1000n, 
        360000n, 
        true
      )

      let loan = await getContractCreated(tx.txId)

      await AcceptLoanService(spender, loanFactoryTemplate, loan, ALPH_TOKEN_ID, ONE_ALPH * 5n)

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000 + 300000)

      await PayLoanService(creator, loanFactoryTemplate, loan, ALPH_TOKEN_ID, ONE_ALPH * 6n)

      await WithdrawLoanFeesService(defaultSigner, loanFactoryTemplate, ALPH_TOKEN_ID, defaultSigner.address, MINIMAL_CONTRACT_DEPOSIT)

      await WithdrawLoanFeesService(defaultSigner, loanFactoryTemplate, ALPH_TOKEN_ID, defaultSigner.address, MINIMAL_CONTRACT_DEPOSIT)
    })

    test('create loan, accept loan, forfeit, auction, bid redeem', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000)

      let tx = await CreateLoanService(
        creator, 
        loanFactoryTemplate, 
        ALPH_TOKEN_ID, 
        ONE_ALPH * 5n, 
        ALPH_TOKEN_ID, 
        ONE_ALPH * 12n, 
        1000n, 
        360000n, 
        true
      )

      let loan = await getContractCreated(tx.txId)

      await AcceptLoanService(spender, loanFactoryTemplate, loan, ALPH_TOKEN_ID, ONE_ALPH * 5n)

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000 + 370000)

      let atx = await ForfeitLoanService(defaultSigner, loanFactoryTemplate, loan)

      let auction = await getContractCreated(atx.txId)

      await BidService(defaultSigner, auctionFactoryTemplate, auction, ALPH_TOKEN_ID, ONE_ALPH * 6n)

      await BidService(creator, auctionFactoryTemplate, auction, ALPH_TOKEN_ID, ONE_ALPH * 7n)

      await BidService(spender, auctionFactoryTemplate, auction, ALPH_TOKEN_ID, ONE_ALPH * 8n)

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000 + 370000 + 350000)

      await RedeemService(spender, auctionFactoryTemplate, auction)

      await WithdrawLoanFeesService(defaultSigner, loanFactoryTemplate, ALPH_TOKEN_ID, defaultSigner.address, MINIMAL_CONTRACT_DEPOSIT)

      await WithdrawLoanFeesService(defaultSigner, loanFactoryTemplate, ALPH_TOKEN_ID, defaultSigner.address, MINIMAL_CONTRACT_DEPOSIT)
    })

    test('create loan, accept loan, forfeit, auction, instant redeem', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000)

      let tx = await CreateLoanService(
        creator, 
        loanFactoryTemplate, 
        ALPH_TOKEN_ID, 
        ONE_ALPH * 5n, 
        ALPH_TOKEN_ID, 
        ONE_ALPH * 12n, 
        1000n, 
        360000n, 
        true
      )

      let loan = await getContractCreated(tx.txId)

      await AcceptLoanService(spender, loanFactoryTemplate, loan, ALPH_TOKEN_ID, ONE_ALPH * 5n)

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000 + 370000)

      let atx = await ForfeitLoanService(defaultSigner, loanFactoryTemplate, loan)

      let auction = await getContractCreated(atx.txId)

      await RedeemService(spender, auctionFactoryTemplate, auction)
    })

    // create a token for this one with mapping
    test('create loan, accept loan, (attempt) liquidation(s)', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      // create token
      await CreateTokenService(buyer[1], buyer[1].address)

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000)

      let assets = await nodeProvider.addresses.getAddressesAddressBalance(
        spender.address
      );

      expect(assets.tokenBalances?.length).toEqual(1);
  
      const ids = assets.tokenBalances?.map((token) => token.id) ?? [];

      console.log(ids[0])

      let fee = await TokenMappingService(defaultSigner, loanFactoryTemplate, ids[0], true, "EX/USD", 18n, true)

      let tx = await CreateLoanService(
        spender, 
        loanFactoryTemplate, 
        ALPH_TOKEN_ID, 
        ONE_ALPH * 5n, 
        ids[0], 
        ONE_ALPH * 30n, 
        1000n, 
        360000n, 
        true
      )

      let loan = await getContractCreated(tx.txId)

      await AcceptLoanService(creator, loanFactoryTemplate, loan, ALPH_TOKEN_ID, ONE_ALPH * 5n)

      await UpdateValueService(defaultSigner, oracleTemplate, "EX/USD", 10933773n) // 0.19c

      let atx = await LiquidateLoanService(creator, loanFactoryTemplate, loan)

      let auction = await getContractCreated(atx.txId)

      await BidService(defaultSigner, auctionFactoryTemplate, auction, ALPH_TOKEN_ID, ONE_ALPH * 6n)

      await BidService(creator, auctionFactoryTemplate, auction, ALPH_TOKEN_ID, ONE_ALPH * 7n)

      await BidService(spender, auctionFactoryTemplate, auction, ALPH_TOKEN_ID, ONE_ALPH * 8n)

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000 + 1000000)

      await RedeemService(spender, auctionFactoryTemplate, auction)

      await WithdrawLoanFeesService(defaultSigner, loanFactoryTemplate, ids[0], defaultSigner.address, MINIMAL_CONTRACT_DEPOSIT)

      await WithdrawLoanFeesService(defaultSigner, loanFactoryTemplate, ids[0], defaultSigner.address, MINIMAL_CONTRACT_DEPOSIT)
    })

    test('create loan, accept loan, liquidation, auction creation, instant redeem, check fees', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      // create token
      await CreateTokenService(buyer[1], buyer[1].address)

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000)

      let assets = await nodeProvider.addresses.getAddressesAddressBalance(
        spender.address
      );

      expect(assets.tokenBalances?.length).toEqual(1);
  
      const ids = assets.tokenBalances?.map((token) => token.id) ?? [];

      console.log(ids[0])

      let fee = await TokenMappingService(defaultSigner, loanFactoryTemplate, ids[0], true, "EX/USD", 18n, true)

      let tx = await CreateLoanService(
        spender, 
        loanFactoryTemplate, 
        ALPH_TOKEN_ID, 
        ONE_ALPH * 5n, 
        ids[0], 
        ONE_ALPH * 30n, 
        1000n, 
        360000n, 
        true
      )

      let loan = await getContractCreated(tx.txId)

      await AcceptLoanService(creator, loanFactoryTemplate, loan, ALPH_TOKEN_ID, ONE_ALPH * 5n)

      await UpdateValueService(defaultSigner, oracleTemplate, "EX/USD", 10933773n) // 0.19c

      let atx = await LiquidateLoanService(creator, loanFactoryTemplate, loan)

      let auction = await getContractCreated(atx.txId)

      await RedeemService(creator, auctionFactoryTemplate, auction)

      // ----------------------------------

      tx = await CreateLoanService(
        spender, 
        loanFactoryTemplate, 
        ids[0], 
        ONE_ALPH * 5n, 
        ids[0], 
        ONE_ALPH * 30n, 
        1000n, 
        360000n, 
        true
      )

      loan = await getContractCreated(tx.txId)

      await AcceptLoanService(creator, loanFactoryTemplate, loan, ids[0], ONE_ALPH * 5n)

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000 + 370000)

      atx = await ForfeitLoanService(creator, loanFactoryTemplate, loan)

      auction = await getContractCreated(atx.txId)

      await RedeemService(creator, auctionFactoryTemplate, auction)

      await WithdrawLoanFeesService(defaultSigner, loanFactoryTemplate, ids[0], defaultSigner.address, MINIMAL_CONTRACT_DEPOSIT)

      await WithdrawLoanFeesService(defaultSigner, loanFactoryTemplate, ids[0], defaultSigner.address, MINIMAL_CONTRACT_DEPOSIT)
    })

    //? no liquidation loans

    test('create loan, accept loan, forfeit, auction, bid redeem (no liquidation)', async () => {
      const creator = buyer[0]
      const spender = buyer[1]

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000)

      let tx = await CreateLoanService(
        creator, 
        loanFactoryTemplate, 
        ALPH_TOKEN_ID, 
        ONE_ALPH * 5n, 
        ALPH_TOKEN_ID, 
        ONE_ALPH * 12n, 
        1000n, 
        360000n, 
        false
      )

      let loan = await getContractCreated(tx.txId)

      await AcceptLoanService(spender, loanFactoryTemplate, loan, ALPH_TOKEN_ID, ONE_ALPH * 5n)

      await EditOracleTime(defaultSigner, oracleTemplate, 1740500535000 + 370000)

      await ForfeitLoanService(defaultSigner, loanFactoryTemplate, loan)

      await WithdrawLoanFeesService(defaultSigner, loanFactoryTemplate, ALPH_TOKEN_ID, defaultSigner.address, MINIMAL_CONTRACT_DEPOSIT)

      await WithdrawLoanFeesService(defaultSigner, loanFactoryTemplate, ALPH_TOKEN_ID, defaultSigner.address, MINIMAL_CONTRACT_DEPOSIT)
    })
});