import { ApplicationContainer } from "./container";
import { initalizeNewPayment, watchPayment } from "./payment/payment.service";

const application = new ApplicationContainer();
application.boostrap();

const payment = await initalizeNewPayment();
await watchPayment(payment);
