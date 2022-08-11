import { initalizePayment, startBackgroundCheckerService } from "./payments.js";

startBackgroundCheckerService();
await initalizePayment();
