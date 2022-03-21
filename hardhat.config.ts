import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-tracer";
import "hardhat-deploy";
import {
  RIPPresale__factory,
} from "./typechain";

dotenv.config();

const DEPLOYER_ACCOUNT = 1; // Uses account 2 on all networks

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const contractName = "RIPPresale";

task("deploy-presale", "", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args: any[] = [];

  console.log("Deploying", contractName, "with", accounts[0].address);

  const deployed = await deploy(contractName, {
    from: accounts[0].address,
    args,
    log: true,
    skipIfAlreadyDeployed: true,
  });
  console.log("Presale deployed: ", deployed.address);
  console.log(`To verify: npx hardhat verify ${deployed.address}`);
});

task("init-presale", "", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const signer = await hre.ethers.provider.getSigner(deployer);

  const args: any[] = [];
  const presaleDeployment = await deployments.get("RIPPresale")
  console.log("presaleaddress",accounts[0].address);
  const presaleContract = RIPPresale__factory.connect(presaleDeployment.address, accounts[0])

  await presaleContract.initialize("0x54Ff8d4156BDe2c403a5429d5F42127d48031f3f", "0x484CEe75a3A29C7E1903d2229BB953d22a6e0785", Math.ceil((1647889200000-new Date().getTime())/1000))
});

task("test-presale", "", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  // const signer = await hre.ethers.provider.getSigner(deployer);

  const args: any[] = [];
  const presaleDeployment = await deployments.get("RIPPresale")
  const presaleContract = RIPPresale__factory.connect(presaleDeployment.address, accounts[0])
  // const allot = await presaleContract.getAllotmentPerBuyer()
  // const allot = await presaleContract.calculateSaleQuote('10000000000000000000')
  // console.log("alloted", allot.toNumber());
  await presaleContract.setEndOfSale(250000)
  // await presaleContract.purchaseaRIP({value: hre.ethers.utils.parseEther("0.01")})
  // await presaleContract.sendRemainingaRIP("0xa9CE6c1696FA200Fcae87C5CE6D8A2Af4E6Bfe7e")
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  defaultNetwork: "bsc_test",
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      {
        version: "0.7.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: DEPLOYER_ACCOUNT,
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
    deploy: "./scripts/deploy",
    deployments: "./deployments",
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_URL || "",
      },
    },
    mainnet: {
      url: process.env.MAINNET_URL || "",
      accounts: {
        mnemonic: process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : "",
      },
    },
    local: {
      url: "http://127.0.0.1:7545",
    },
    bsc: {
      url: process.env.BSC_URL || "",
      accounts: [process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : ""],
    },
    bsc_test: {
      url: process.env.BSC_TEST_URL || "",
      accounts: [process.env.PRIVATE_KEY !== undefined ? process.env.PRIVATE_KEY : ""],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY,
  },
  mocha: {
    timeout: 600000,
  },
};

export default config;
