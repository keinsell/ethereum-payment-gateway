import random from "random-js";

// create a Mersenne Twister-19937 that is auto-seeded based on time and other random values
const engine = random.MersenneTwister19937.autoSeed();
// create a distribution that will consistently produce integers within inclusive range [0, 99].
const distribution = random.integer(1, 100_000_000);
// generate a number that is guaranteed to be within [0, 99] without any particular bias.
export function randmizePaymentValue(): number {
  return distribution(engine) / 1_000_000_000;
}
