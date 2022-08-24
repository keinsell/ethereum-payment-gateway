import { scheduleJob } from "node-schedule";
import {
  findPaymentsWithStatus,
  PaymentStatus,
  updatePayment,
} from "../old-payment/payment.repository";
