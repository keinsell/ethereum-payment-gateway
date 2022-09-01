import test, { ExecutionContext } from "ava";
import { ethers } from "ethers";
import ganache from "ganache";

import sinon from "sinon";
import {
  createWallet,
  getBalanceOfAddress,
} from "../deprecated-blockchain/blockchain.service";
import { createRotationWalletFromAccount } from "./rotation-wallet.repository";

sinon.stub(console);

const server = ganache.server({});
const GANACHE_PORT = 8545;

async function shouldCreateRotatingWallet(t: ExecutionContext) {
  await server.listen(GANACHE_PORT);

  const account = createWallet();

  t.assert(account.address, "web3-generated account should have address");

  t.assert(account.privateKey, "web3-generated account should have privateKey");

  const wallet = createRotationWalletFromAccount(account);

  t.is(
    wallet.address,
    account.address,
    "Should have same address as web3 account"
  );

  t.true(
    ethers.utils.isAddress(wallet.address),
    "Should have valid address of rotation wallet."
  );

  t.is(
    wallet.privateKey,
    account.privateKey,
    "Should have same privateKey as web3 account"
  );

  const balance = await getBalanceOfAddress(wallet.address);

  t.is(
    balance.toString(),
    wallet.balance.toString(),
    "Should have same balance as on network"
  );

  await server.close();
}

test("Should create rotating wallet", shouldCreateRotatingWallet);
