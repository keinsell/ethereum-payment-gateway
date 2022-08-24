import test, { ExecutionContext } from "ava";
import { ethers } from "ethers";
import { PaymentStatus } from "./payment.repository";
import { initalizeNewPayment } from "./payment.service";
import sinon from "sinon";

sinon.stub(console);

async function shouldCreateNewPayment(t: ExecutionContext) {
  const payment = await initalizeNewPayment();

  t.is(
    payment.status,
    PaymentStatus.initalized,
    "Should have INITALIZED status."
  );

  t.true(
    ethers.utils.isAddress(payment.address),
    "Should have valid address of rotation wallet."
  );
}

test("Should initalize new payment", shouldCreateNewPayment);
