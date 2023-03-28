const express = require("express");
const router = express.Router();

const bip39 = require('bip39');
const { initWasm, TW } = require("@trustwallet/wallet-core");
const validateCreateWallet = require("../../validation/wallet/validateCreateWallet");
const UserAddress = require("../../models/user_address");

const getCoinType = async (coin) => {
  const { CoinType } = await initWasm();
  let coinType = CoinType.bitcoin;

  switch(coin) {
    case 'TRX':
      coinType = CoinType.tron;
      break;
    case 'ETH':
      coinType = CoinType.ethereum;
      break;
    case 'BSC':
      coinType = CoinType.smartChain;
      break;
    default:
      coinType = CoinType.bitcoin;
  }

  return coinType;
}

const getCoinNetwork = async (coin) => {
  let coinNetwork = 'BTC';

  switch(coin) {
    case 'TRX':
      coinNetwork = 'TRC20';
      break;
    case 'ETH':
      coinNetwork = 'ERC20';
      break;
    case 'BSC':
      coinNetwork ='BSC';
      break;
    default:
      coinNetwork = 'BTC';
  }

  return coinNetwork;
}

/**
 * @route POST /v1/create_wallet
 * @description Create a new HDWallet
 * @access Public
 */
router.post("/create_wallet/:coin", async (req, res) => {

  const { errors, isValid } = validateCreateWallet(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  
  try {
    const coin = req.params.coin;
    const coinType = await getCoinType(coin);
    const coinNetwork = await getCoinNetwork(coin);
  
    const mnemonic = bip39.generateMnemonic();
  
    const start = new Date().getTime();
    console.log(`Initializing Wasm...`);
    const { HexCoding, HDWallet, AnyAddress } = await initWasm();
    console.log(`Done in ${new Date().getTime() - start} ms`);
    
    const wallet = HDWallet.createWithMnemonic(`${mnemonic.toString()}`, "");
  
    const key = wallet.getKeyForCoin(coinType);
    const pubKey = key.getPublicKeySecp256k1(false);
    const address = wallet.getAddressForCoin(coinType);

    const userAddress = new UserAddress;
    userAddress.userId = req.body.userId;
    userAddress.address = address;
    userAddress.type = coinNetwork;
    await userAddress.save();
  
    return res
      .json({
        code: "200", 
        data: {
          menmonic: wallet.mnemonic(),
          privateKey: `${HexCoding.encode(key.data())}`,
          address: `${address}`,
        }, 
        msg: "success" 
    });
  } catch(e) {
    return res
      .status(400)
      .json({
        code: "400", 
        error: "Invalid user id",
        msg: "error" 
    });
  }
  
});

module.exports = router;
