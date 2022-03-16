/* eslint-disable node/no-unpublished-import */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { utils } from "ethers";

const contractName = "";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const args: any[] = [];

  console.log("Deploying", contractName, "with", deployer);

  await deploy(contractName, {
    from: deployer,
    args,
    log: true,
  });
};
export default func;
func.tags = [contractName];
