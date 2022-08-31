import { ApplicationContainer } from "./container";
import {
  initalizeNewPayment,
  watchPayment,
} from "./modules/old-payment/payment.service";

const application = new ApplicationContainer();
application.boostrap();

const payment = await initalizeNewPayment();
await watchPayment(payment);

// console.log(wallet);

// function throwik(): Result<string, UnexpectedError> {
//   const random = Math.random();

//   if (random > 0.5) {
//     return err(new UnexpectedError({ xd: "sasfds" }));
//   }

//   return ok("Something");
// }

// const x = throwik();

// const y = x.unwrapOr("default");
// console.log(y);

// const z = x.isErr();
// console.log(z ? x.error.message : undefined);
