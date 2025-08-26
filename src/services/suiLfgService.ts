import { TransactionBlock } from '@mysten/sui.js/transactions';
import { PACKAGE_ID, FAUCET_POOL_ID, TREASURY_CAP_ID, CLOCK_ID, USDC_COIN_TYPE } from '../constants';
import { suiClient } from './suiClient';

// --- FAUCET ---
export function createFaucetTx(signAndExecuteTransactionBlock: any) {
  const txb = new TransactionBlock();
  txb.moveCall({
    target: `${PACKAGE_ID}::suilfg_testnet_v1::faucet`,
    arguments: [txb.object(FAUCET_POOL_ID), txb.object(CLOCK_ID)],
  });
  return signAndExecuteTransactionBlock({ transactionBlock: txb });
}

// --- "PAYMENT" ACTION ---
export function createPaymentTx(signAndExecuteTransactionBlock: any, userUsdcCoin: any) {
  const txb = new TransactionBlock();
  txb.moveCall({
    target: `${PACKAGE_ID}::suilfg_testnet_v1::do_action_with_payment`,
    arguments: [txb.object(TREASURY_CAP_ID), txb.object(userUsdcCoin.coinObjectId)],
  });
  return signAndExecuteTransactionBlock({ transactionBlock: txb });
}

// --- "FREE" ACTION ---
export function createFreeTx(signAndExecuteTransactionBlock: any) {
  const txb = new TransactionBlock();
  txb.moveCall({
    target: `${PACKAGE_ID}::suilfg_testnet_v1::do_action_free`,
    arguments: [],
  });
  return signAndExecuteTransactionBlock({ transactionBlock: txb });
}

// Renamed for clarity: gas-only, no real payment
export function createGasOnlyTx(signAndExecuteTransactionBlock: any) {
  return createFreeTx(signAndExecuteTransactionBlock);
}

// --- GET USER USDC COINS ---
export async function getUserUsdcCoins(walletAddress: string) {
  try {
    const coins = await suiClient.getCoins({
      owner: walletAddress,
      coinType: USDC_COIN_TYPE,
    });
    return coins.data;
  } catch (error) {
    console.error('Error fetching USDC coins:', error);
    return [];
  }
}