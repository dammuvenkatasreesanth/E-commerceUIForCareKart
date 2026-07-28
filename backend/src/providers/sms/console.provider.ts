import { logger } from "../../lib/logger";
import type { SmsProvider } from "./sms.provider";

export class ConsoleSmsProvider implements SmsProvider {
  async sendOtp(phone: string, code: string): Promise<void> {
    logger.info(`[DEV SMS] OTP for ${phone}: ${code}`);
  }
}
