import { NetworkId, NodeProvider, web3, addressFromContractId } from "@alephium/web3"
import { loadDeployments } from "../../artifacts/ts/deployments"
import { LoanInstance } from "../../artifacts/ts"

export interface AlephiumLoanConfig {
  network: NetworkId,
  groupIndex: number,
  loanFactoryContractId: string,
  loanFactoryContractAddress: string,
  loanAdminAddress: string,
  pollingInterval: number,
  defaultNodeUrl: string,
  defaultExplorerUrl: string,
  backendUrl: string,
  mongoUrl: string
}

export interface TokenInfo {
  id: string
  name: string
  symbol: string
  decimals: number
  description: string
  logoURI: string
  isOracle: boolean
}

export function getNetwork(): NetworkId {
  const network = 'mainnet' as NetworkId
  return network
}

export function getNodeProvider(): NodeProvider {
  return new NodeProvider(getDefaultNodeUrl())
}

export function getDefaultNodeUrl(): string {
  return 'https://node.alphaga.app'
}


export function getDefaultExplorerUrl(): string {
  return 'https://backend.mainnet.alephium.org'
}

export function getBackendUrl(): string {
  return 'https://backend.alpacafi.app'
}

export function getMongoUrl(): string {
  return process.env.MONGO_URL || 'mongodb://localhost:27017/'
}

function getPollingInterval(): number {
  const network = getNetwork()
  return network === 'devnet' ? 1000 : 100000
}

export function getAlephiumLoanConfig(): AlephiumLoanConfig {
  const network = getNetwork()
  const deployments = loadDeployments(network, "16gAmGuCysLjGxHK8TUENkvhbqvwZRb6BabUbsxLYkSkd")
  const loanFactory = deployments?.contracts?.LoanFactory?.contractInstance
  const groupIndex = loanFactory?.groupIndex
  return {
    network,
    groupIndex: groupIndex || 0,
    loanAdminAddress: deployments.deployerAddress,
    loanFactoryContractId: loanFactory?.contractId || '',
    loanFactoryContractAddress: loanFactory?.address || '',
    defaultNodeUrl: getDefaultNodeUrl(),
    defaultExplorerUrl: getDefaultExplorerUrl(),
    backendUrl: getBackendUrl(),
    pollingInterval: getPollingInterval(),
    mongoUrl: getMongoUrl()
  }
}

export function calculateLoanRepayment(
  loanAmount: number,
  interestRatePer10k: number,
  acceptedDate: Date
): { interest: number; totalRepayment: number } {
  
  const annualInterestRate = interestRatePer10k / 10000;
  
  const daysInYear = 365;
  
  const today = new Date();
  const loanDurationDays = Math.floor((today.getTime() - acceptedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const interest = loanAmount * annualInterestRate * (loanDurationDays / daysInYear);
  
  const totalRepayment = loanAmount + interest;
  
  return { interest, totalRepayment };
}

export function getTokensList(): TokenInfo[] {
  return [
    {
      id: "0000000000000000000000000000000000000000000000000000000000000000",
      name: "Alephium",
      symbol: "ALPH",
      decimals: 18,
      description: "Alephium is a scalable, decentralized, and secure blockchain platform that enables the creation of fast and secure applications.",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/ALPH.png",
      isOracle: true
    },
    {
      id: "1a281053ba8601a658368594da034c2e99a0fb951b86498d05e76aedfe666800",
      name: "AYIN",
      symbol: "AYIN",
      decimals: 18,
      description: "$AYIN is a DEX token, that incentivises users through fees and other mechanisms to participate in trading on Alephium",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/AYIN.png",
      isOracle: true
    },
    /*{
      id: "722954d9067c5a5ad532746a024f2a9d7a18ed9b90e27d0a3a504962160b5600",
      name: "USD Coin (Ethereum via AlphBridge)",
      symbol: "USDCeth",
      decimals: 6,
      description: "USDC Bridged to Alephium from Ethereum via Alephium Bridge",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/USDCeth.png",
    },
    {
      id: "75e1e9f91468616a371fe416430819bf5386a3e6a258864c574271a404ec8900",
      name: "USD Coin (BSC via AlphBridge)",
      symbol: "USDCbsc",
      decimals: 18,
      description: "USDC Bridged to Alephium from BSC via Alephium Bridge",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/USDCbsc.png",
    },
    {
      id: "3d0a1895108782acfa875c2829b0bf76cb586d95ffa4ea9855982667cc73b700",
      name: "Dai Stablecoin (AlphBridge)",
      symbol: "DAI",
      decimals: 18,
      description: "DAI Bridged to Alephium from Alephium Bridge",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/DAI.png"
    },
    {
      id: "556d9582463fe44fbd108aedc9f409f69086dc78d994b88ea6c9e65f8bf98e00",
      name: "Tether USD (Ethereum via AlphBridge)",
      symbol: "USDTeth",
      decimals: 6,
      description: "USDT Bridged to Alephium from Ethereum via Alephium Bridge",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/USDTeth.png",
    },
    {
      id: "7ff5e72636f640eb2c28056df3b6879e4c86933505abebf566518ad396335700",
      name: "Tether USD (BSC via AlphBridge)",
      symbol: "USDTbsc",
      decimals: 18,
      description: "USDT Bridged to Alephium from BSC via Alephium Bridge",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/USDTbsc.png",
    },*/
    {
      id: "9b3070a93fd5127d8c39561870432fdbc79f598ca8dbf2a3398fc100dfd45f00",
      name: "AlphBanX",
      symbol: "ABX",
      decimals: 9,
      description: "AlphBanX is a decentralized lending platform that allows you to borrow AlphBanX Dollars using ALPH as collateral. Choose your own interest rate and bet on liquidations - earning yield from borrowing fees and from liquidated loans.",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/ABX.png",
      isOracle: false
    },
    {
      id: "cad22f7c98f13fe249c25199c61190a9fb4341f8af9b1c17fcff4cd4b2c3d200",
      name: "Elexium",
      symbol: "EX",
      decimals: 18,
      description: "Elexium: The People’s Choice. The first VE dex on Alephium Blockchain",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/EX.png",
      isOracle: false
    },
    {
      id: "bb440a66dcffdb75862b6ad6df14d659aa6d1ba8490f6282708aa44ebc80a100",
      name: "AlphPad",
      symbol: "APAD",
      decimals: 18,
      description: "AlphPad The Premier Launchpad on Alephium - Elevating Projects to New Heights!",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/APAD.png",
      isOracle: false
    },
    {
      id: "c1a33b163fc45db6b8466ee78d20c61072b6aac07baa37ffbf33a3dec9f17800",
      name: "Wrapped BNB (AlphBridge)",
      symbol: "WBNB",
      decimals: 18,
      description: "BNB Bridged to Alephium from Alephium Bridge",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/WBNB.png",
      isOracle: false
    },
  ]
}