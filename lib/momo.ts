import momo from "mtn-momo";

export const { Collections } = momo.create({
  callbackHost: process.env.MOMO_CALLBACK_HOST
});
export const collections = Collections({
  userSecret: process.env.MOMOUSER_SECRET!,
  userId: process.env.MOMOUSER_ID!,
  primaryKey: process.env.MOMO_PRIMARY_KEY!,
});
