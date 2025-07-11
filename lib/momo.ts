import momo from "mtn-momo";

const { Collections, Disbursements } = momo.create({
  callbackHost: process.env.CALLBACK_HOST,
});
export const collections = Collections({
  userSecret: process.env.MOMOUSER_SECRET!,
  userId: process.env.MOMOUSER_ID!,
  primaryKey: process.env.MOMO_PRIMARY_KEY!,
});
export const disbursements = Disbursements({
  userSecret: process.env.DISBURSEMENTS_USER_SECRET!,
  userId: process.env.DISBURSEMENTS_USER_ID!,
  primaryKey: process.env.DISBURSEMENTS_PRIMARY_KEY!,
});
