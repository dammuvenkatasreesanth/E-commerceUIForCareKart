import { env } from "../../config/env";
import type { SmsProvider } from "./sms.provider";
import { ConsoleSmsProvider } from "./console.provider";
import { Msg91SmsProvider } from "./msg91.provider";

export const smsProvider: SmsProvider =
  env.SMS_PROVIDER === "msg91" ? new Msg91SmsProvider() : new ConsoleSmsProvider();
