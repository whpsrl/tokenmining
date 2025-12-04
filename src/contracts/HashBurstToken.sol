// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title HashBurstToken
 * @dev Token ERC20 con meccanismi anti-dump e anti-whale
 * 
 * Caratteristiche:
 * - Anti-Dump: Vendita massima 5% del balance per mese
 * - Anti-Whale: Acquisto massimo 0.1% della supply totale per 12 mesi
 * - Private Sale con whitelist
 * - Mining Rewards automatici
 */
contract HashBurstToken is ERC20, Ownable, ReentrancyGuard {
    
    // Supply totale: 1 miliardo di token
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18;
    
    // Anti-Whale: max 0.1% della supply per transazione (regolabile a 0.001%)
    uint256 public maxBuyPercentage = 100; // 0.1% = 100 basis points (100/100000)
    uint256 public constant BASIS_POINTS = 100000;
    
    // Anti-Dump: max 5% vendita mensile
    uint256 public constant DUMP_PERCENTAGE = 5;
    uint256 public constant DUMP_PERIOD = 30 days;
    
    // Private Sale
    bool public privateSaleActive = true;
    uint256 public privateSaleEndDate;
    mapping(address => bool) public privateSaleWhitelist;
    
    // Tracking vendite per anti-dump
    struct SellTracker {
        uint256 lastSellTimestamp;
        uint256 amountSoldThisMonth;
    }
    mapping(address => SellTracker) public sellTracking;
    
    // Tracking acquisti per anti-whale (12 mesi)
    struct BuyTracker {
        uint256 totalBought;
        uint256 firstBuyTimestamp;
    }
    mapping(address => BuyTracker) public buyTracking;
    uint256 public constant WHALE_PERIOD = 365 days;
    
    // Esclusioni dai limiti (DEX, pool, staking)
    mapping(address => bool) public isExcludedFromLimits;
    
    // Mining wallet per distribuzioni
    address public miningWallet;
    
    // Eventi
    event PrivateSaleStatusChanged(bool active);
    event WhitelistUpdated(address indexed user, bool status);
    event MaxBuyPercentageUpdated(uint256 newPercentage);
    event MiningWalletUpdated(address indexed newWallet);
    event ExclusionUpdated(address indexed account, bool excluded);
    
    constructor(
        address _initialOwner,
        address _miningWallet,
        uint256 _privateSaleEndTimestamp
    ) ERC20("HashBurst Token", "HBT") Ownable(_initialOwner) {
        require(_miningWallet != address(0), "Invalid mining wallet");
        
        miningWallet = _miningWallet;
        privateSaleEndDate = _privateSaleEndTimestamp;
        
        // Distribuzione iniziale
        // 30% Private Sale
        _mint(_initialOwner, (TOTAL_SUPPLY * 30) / 100);
        
        // 40% Mining Rewards
        _mint(_miningWallet, (TOTAL_SUPPLY * 40) / 100);
        
        // 15% Liquidity
        _mint(_initialOwner, (TOTAL_SUPPLY * 15) / 100);
        
        // 10% Team (locked)
        _mint(_initialOwner, (TOTAL_SUPPLY * 10) / 100);
        
        // 5% Marketing
        _mint(_initialOwner, (TOTAL_SUPPLY * 5) / 100);
        
        // Owner escluso dai limiti
        isExcludedFromLimits[_initialOwner] = true;
        isExcludedFromLimits[_miningWallet] = true;
    }
    
    /**
     * @dev Override transfer con controlli anti-dump e anti-whale
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        // Private sale check
        if (privateSaleActive && from != address(0)) {
            require(
                privateSaleWhitelist[from] || from == owner(),
                "Private sale: not whitelisted"
            );
        }
        
        // Skip controlli per mint/burn e indirizzi esclusi
        if (
            from == address(0) || 
            to == address(0) || 
            isExcludedFromLimits[from] || 
            isExcludedFromLimits[to]
        ) {
            super._update(from, to, amount);
            return;
        }
        
        // ANTI-WHALE: Controllo acquisto massimo
        if (from != address(0) && to != address(0)) {
            _checkAntiWhale(to, amount);
        }
        
        // ANTI-DUMP: Controllo vendita mensile (solo per vendite)
        if (from != address(0) && !isExcludedFromLimits[from]) {
            _checkAntiDump(from, amount);
        }
        
        super._update(from, to, amount);
    }
    
    /**
     * @dev Controllo anti-whale: limite acquisto
     */
    function _checkAntiWhale(address buyer, uint256 amount) private {
        BuyTracker storage tracker = buyTracking[buyer];
        
        // Reset se è passato il periodo (12 mesi)
        if (block.timestamp > tracker.firstBuyTimestamp + WHALE_PERIOD) {
            tracker.totalBought = 0;
            tracker.firstBuyTimestamp = block.timestamp;
        }
        
        // Se è il primo acquisto, imposta timestamp
        if (tracker.firstBuyTimestamp == 0) {
            tracker.firstBuyTimestamp = block.timestamp;
        }
        
        // Calcola max acquistabile (0.1% o 0.001% della supply)
        uint256 maxBuyAmount = (TOTAL_SUPPLY * maxBuyPercentage) / BASIS_POINTS;
        
        // Controlla che l'acquisto totale nel periodo non superi il limite
        require(
            tracker.totalBought + amount <= maxBuyAmount,
            "Anti-Whale: exceeded max buy limit for 12-month period"
        );
        
        tracker.totalBought += amount;
    }
    
    /**
     * @dev Controllo anti-dump: max 5% vendita mensile
     */
    function _checkAntiDump(address seller, uint256 amount) private {
        SellTracker storage tracker = sellTracking[seller];
        uint256 sellerBalance = balanceOf(seller);
        
        // Reset se è passato un mese
        if (block.timestamp > tracker.lastSellTimestamp + DUMP_PERIOD) {
            tracker.amountSoldThisMonth = 0;
            tracker.lastSellTimestamp = block.timestamp;
        }
        
        // Se è la prima vendita, imposta timestamp
        if (tracker.lastSellTimestamp == 0) {
            tracker.lastSellTimestamp = block.timestamp;
        }
        
        // Calcola max vendibile (5% del balance)
        uint256 maxSellAmount = (sellerBalance * DUMP_PERCENTAGE) / 100;
        
        // Controlla che la vendita non superi il 5% mensile
        require(
            tracker.amountSoldThisMonth + amount <= maxSellAmount,
            "Anti-Dump: exceeded 5% monthly sell limit"
        );
        
        tracker.amountSoldThisMonth += amount;
    }
    
    /**
     * @dev Gestione Private Sale
     */
    function setPrivateSaleStatus(bool _active) external onlyOwner {
        privateSaleActive = _active;
        emit PrivateSaleStatusChanged(_active);
    }
    
    function addToWhitelist(address[] calldata users) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            privateSaleWhitelist[users[i]] = true;
            emit WhitelistUpdated(users[i], true);
        }
    }
    
    function removeFromWhitelist(address[] calldata users) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            privateSaleWhitelist[users[i]] = false;
            emit WhitelistUpdated(users[i], false);
        }
    }
    
    /**
     * @dev Aggiorna percentuale massima acquisto (0.1% o 0.001%)
     */
    function setMaxBuyPercentage(uint256 _percentage) external onlyOwner {
        require(_percentage > 0 && _percentage <= 1000, "Invalid percentage");
        maxBuyPercentage = _percentage;
        emit MaxBuyPercentageUpdated(_percentage);
    }
    
    /**
     * @dev Gestione esclusioni (DEX, pool, ecc.)
     */
    function setExcludedFromLimits(address account, bool excluded) external onlyOwner {
        isExcludedFromLimits[account] = excluded;
        emit ExclusionUpdated(account, excluded);
    }
    
    /**
     * @dev Aggiorna mining wallet
     */
    function setMiningWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Invalid address");
        miningWallet = _newWallet;
        emit MiningWalletUpdated(_newWallet);
    }
    
    /**
     * @dev Distribuzione mining rewards
     */
    function distributeMiningRewards(address[] calldata recipients, uint256[] calldata amounts) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            _transfer(miningWallet, recipients[i], amounts[i]);
        }
    }
    
    /**
     * @dev Visualizza info vendita utente
     */
    function getSellInfo(address user) external view returns (
        uint256 amountSoldThisMonth,
        uint256 maxSellableNow,
        uint256 timeUntilReset
    ) {
        SellTracker memory tracker = sellTracking[user];
        uint256 userBalance = balanceOf(user);
        
        if (block.timestamp > tracker.lastSellTimestamp + DUMP_PERIOD) {
            amountSoldThisMonth = 0;
            maxSellableNow = (userBalance * DUMP_PERCENTAGE) / 100;
            timeUntilReset = 0;
        } else {
            amountSoldThisMonth = tracker.amountSoldThisMonth;
            uint256 maxSell = (userBalance * DUMP_PERCENTAGE) / 100;
            maxSellableNow = maxSell > amountSoldThisMonth ? maxSell - amountSoldThisMonth : 0;
            timeUntilReset = (tracker.lastSellTimestamp + DUMP_PERIOD) - block.timestamp;
        }
    }
    
    /**
     * @dev Visualizza info acquisto utente
     */
    function getBuyInfo(address user) external view returns (
        uint256 totalBoughtInPeriod,
        uint256 maxBuyableNow,
        uint256 timeUntilReset
    ) {
        BuyTracker memory tracker = buyTracking[user];
        uint256 maxBuy = (TOTAL_SUPPLY * maxBuyPercentage) / BASIS_POINTS;
        
        if (tracker.firstBuyTimestamp == 0 || block.timestamp > tracker.firstBuyTimestamp + WHALE_PERIOD) {
            totalBoughtInPeriod = 0;
            maxBuyableNow = maxBuy;
            timeUntilReset = 0;
        } else {
            totalBoughtInPeriod = tracker.totalBought;
            maxBuyableNow = maxBuy > totalBoughtInPeriod ? maxBuy - totalBoughtInPeriod : 0;
            timeUntilReset = (tracker.firstBuyTimestamp + WHALE_PERIOD) - block.timestamp;
        }
    }
}
