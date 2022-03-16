// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "../IERC20Mintable.sol";
import "../IERC20Burnable.sol";
import "../FullMath.sol";
import "../SafeERC20.sol";
import "../SafeMath.sol";
import "../Ownable.sol";

contract RIPPresale is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address public aRIP;
    address public addressToSendBNB;

    uint256 public salePrice = uint256(1e18);
    uint256 public totalParticipants;
    uint256 public endOfSale;
    uint256 public totalPurchased;

    bool public saleStarted;

    mapping(address => bool) boughtRIP;

    function initialize(
        address _addressToSendBNB,
        address _aRIP,
        uint256 _saleLength
    ) external onlyOwner() returns (bool) {
        require(saleStarted == false, "Already initialized");

        aRIP = _aRIP;

        endOfSale = _saleLength.add(block.timestamp);

        saleStarted = true;

        addressToSendBNB = _addressToSendBNB;

        return true;
    }

    function setEndOfSale(
        uint256 _saleLength
    ) external onlyOwner() returns (bool) {
        endOfSale = _saleLength.add(block.timestamp);
    }

    function getAllotmentPerBuyer() public view returns (uint256) {
        return uint256(25).mul(1e18).div(salePrice.div(1e9));
    }

    function purchaseaRIP() public payable returns (bool) {
        require(saleStarted == true, "Not started");
        require(block.timestamp < endOfSale, "Sale ended");

        uint256 _purchaseAmount = _calculateSaleQuote(msg.value);
        uint256 _balanceaRIP = IERC20(aRIP).balanceOf(msg.sender);

        require(_purchaseAmount.add(_balanceaRIP) <= getAllotmentPerBuyer(), "More than alloted");
        if(!boughtRIP[msg.sender]) {
            totalParticipants = totalParticipants.add(1);
            boughtRIP[msg.sender] = true;
        }

        totalPurchased = totalPurchased.add(_purchaseAmount);
        payable(addressToSendBNB).call{value: msg.value}("");
        IERC20(aRIP).safeTransfer(msg.sender, _purchaseAmount);

        return true;
    }

    function sendRemainingaRIP(address _sendaRIPTo)
        external
        onlyOwner()
        returns (bool)
    {
        require(saleStarted == true, "Not started");
        require(block.timestamp >= endOfSale, "Not ended");

        IERC20(aRIP).safeTransfer(
            _sendaRIPTo,
            IERC20(aRIP).balanceOf(address(this))
        );

        return true;
    }

    function _calculateSaleQuote(uint256 paymentAmount_)
        internal
        view
        returns (uint256)
    {
        return uint256(paymentAmount_).div(salePrice.div(1e9));
    }

    function calculateSaleQuote(uint256 paymentAmount_)
        external
        view
        returns (uint256)
    {
        return _calculateSaleQuote(paymentAmount_);
    }
}