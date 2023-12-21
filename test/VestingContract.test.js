// test/VestingContract.test.js

const { expect } = require("chai");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");
const { deployTestFramework } = require("@superfluid-finance/ethereum-contracts/dev-scripts/deploy-test-framework");
const TestToken = require("@superfluid-finance/ethereum-contracts/build/hardhat/contracts/utils/TestToken.sol/TestToken.json");

describe("VestingContract", function () {
    let owner, recipient, superfluidHost, superToken, sf, vestingContract;
    const thousandEther = ethers.parseEther("10000");
    const flowRate = 1000;

    before(async function () {
        [owner, recipient] = await ethers.getSigners();

        // Deploy Superfluid Test Framework
        const sfDeployer = await deployTestFramework();

        // Initialize Superfluid Framework
        sf = await Framework.create({
            chainId: 31337,
            provider: owner.provider,
            resolverAddress: sfDeployer.frameworkDeployer.getResolver(),
            protocolReleaseVersion: "test"
        });

        // Deploy and upgrade Super Token
        const superTokenDeployment = await sfDeployer.superTokenDeployer.deployWrapperSuperToken(
            "Fake DAI Token",
            "fDAI",
            18,
            ethers.parseEther("100000000").toString()
        );

        superToken = await sf.loadSuperToken("fDAIx");

        const dai = new ethers.Contract(
            superToken.underlyingToken.address,
            TestToken.abi,
            owner
        );

        // Mint and upgrade DAI to DAIx
        await dai.mint(owner.address, thousandEther);
        await superToken.upgrade({ amount: thousandEther }).exec(owner);

        // Deploy VestingContract
        const VestingContract = await ethers.getContractFactory("VestingContract");
        vestingContract = await VestingContract.deploy(superToken.address, sf.settings.config.hostAddress);

        // Set up Superfluid related contracts and addresses
        superfluidHost = sf.settings.config.hostAddress; // Superfluid Host address
    });

    describe("Vesting Flows", function () {
        it("Should allow starting a vesting flow", async function () {
            await expect(vestingContract.startVestingFlow(recipient.address, flowRate))
                .to.emit(vestingContract, "FlowStarted")
                .withArgs(recipient.address, flowRate);
        });

        it("Should allow modifying an existing vesting flow", async function () {
            await vestingContract.startVestingFlow(recipient.address, flowRate);
            const newFlowRate = 2000;

            await expect(vestingContract.modifyVestingFlow(recipient.address, newFlowRate))
                .to.emit(vestingContract, "FlowModified")
                .withArgs(recipient.address, newFlowRate);
        });

        it("Should allow stopping a vesting flow", async function () {
            await vestingContract.startVestingFlow(recipient.address, flowRate);

            await expect(vestingContract.stopVestingFlow(recipient.address))
                .to.emit(vestingContract, "FlowStopped")
                .withArgs(recipient.address);
        });
    });

});
