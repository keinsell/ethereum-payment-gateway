import { initalizeNewPayment, watchPayment } from "./payment/payment.service";

const payment = await initalizeNewPayment();
await watchPayment(payment);
