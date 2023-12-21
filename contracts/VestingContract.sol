// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/AccessControl.sol";
import { ISuperfluid, ISuperToken, IConstantFlowAgreementV1 } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { SuperTokenV1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

contract VestingContract is AccessControl {
    using SuperTokenV1Library for ISuperToken;

    ISuperToken public token;
    ISuperfluid private superfluidHost;
    IConstantFlowAgreementV1 private cfa;
    mapping(address => uint256) private vestingFlows;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event FlowStarted(address indexed recipient, uint256 flowRate);
    event FlowModified(address indexed recipient, uint256 newFlowRate);
    event FlowStopped(address indexed recipient);

    constructor(ISuperToken _token, ISuperfluid _superfluidHost, IConstantFlowAgreementV1 _cfa) {
        token = _token;
        superfluidHost = _superfluidHost;
        cfa = _cfa;
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    function startVestingFlow(address recipient, uint256 flowRate) public onlyRole(ADMIN_ROLE) {
        superfluidHost.callAgreement(
            cfa,
            abi.encodeWithSelector(
                cfa.createFlow.selector,
                token,
                recipient,
                flowRate,
                new bytes(0)
            ),
            "0x"
        );
        vestingFlows[recipient] = flowRate;
        emit FlowStarted(recipient, flowRate);
    }

    function modifyVestingFlow(address recipient, uint256 newFlowRate) public onlyRole(ADMIN_ROLE) {
        superfluidHost.callAgreement(
            cfa,
            abi.encodeWithSelector(
                cfa.updateFlow.selector,
                token,
                recipient,
                newFlowRate,
                new bytes(0)
            ),
            "0x"
        );
        vestingFlows[recipient] = newFlowRate;
        emit FlowModified(recipient, newFlowRate);
    }

    function stopVestingFlow(address recipient) public onlyRole(ADMIN_ROLE) {
        superfluidHost.callAgreement(
            cfa,
            abi.encodeWithSelector(
                cfa.deleteFlow.selector,
                token,
                address(this),
                recipient,
                new bytes(0)
            ),
            "0x"
        );
        vestingFlows[recipient] = 0;
        emit FlowStopped(recipient);
    }
}
