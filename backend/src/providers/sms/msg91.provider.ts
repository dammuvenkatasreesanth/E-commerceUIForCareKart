import axios from "axios";
import { env } from "../../config/env";
import { logger } from "../../lib/logger";
import { AppError } from "../../lib/errors";
import type { SmsProvider } from "./sms.provider";

// MSG91 "Send OTP" API — we generate the OTP ourselves (so we control hashing/expiry)
// and pass it to MSG91 to deliver via their template. Docs: https://docs.msg91.com/p/tf9GTextN/e/hOfIMbQZ2C
export class Msg91SmsProvider implements SmsProvider {
  async sendOtp(phone: string, code: string): Promise<void> {
    try {
      await axios.post(
        "https://control.msg91.com/api/v5/otp",
        {},
        {
          params: {
            authkey: env.MSG91_AUTH_KEY,
            template_id: env.MSG91_TEMPLATE_ID,
            mobile: phone.replace(/^\+/, ""),
            otp: code,
            sender: env.MSG91_SENDER_ID,
          },
          timeout: 10_000,
        },
      );
    } catch (err) {
      logger.error({ err }, "MSG91 OTP send failed");
      throw new AppError("Failed to send OTP. Please try again.", 502);
    }
  }
}
