import crypto from "crypto";

interface Payload {
  iv: string;
  value: string;
  mac?: string;
}

// Type for decrypted data which could be either a primitive, object, or array
type DecryptedData =
  | string
  | number
  | boolean
  | null
  | Record<string, unknown>
  | unknown[];

// Type for the recursive decryptData method
type DecryptableData =
  | string
  | number
  | boolean
  | null
  | DecryptableData[]
  | { [key: string]: DecryptableData };

class CryptoUtils {
  private key: Buffer;
  private algorithm: string;

  constructor(appKey: string) {
    try {
      const key = appKey.startsWith("base64:") ? appKey.substring(7) : appKey;
      this.key = Buffer.from(key, "base64");
      if (this.key.length !== 32) {
        throw new Error("Invalid key length");
      }
      this.algorithm = "aes-256-cbc";
    } catch (error) {
      console.log("Invalid APP_KEY format:", error);
      throw new Error("Invalid APP_KEY format");
    }
  }

  decrypt(encryptedData: string): string {
    if (!encryptedData) {
      throw new Error("No data provided for decryption");
    }

    try {
      const payload: Payload = JSON.parse(
        Buffer.from(encryptedData, "base64").toString()
      );

      const iv = Buffer.from(payload.iv, "base64");
      const value = Buffer.from(payload.value, "base64");

      if (payload.mac) {
        const calculatedMac = this.calculateMac(payload.iv, payload.value);
        if (calculatedMac !== payload.mac) {
          throw new Error("MAC verification failed");
        }
      }

      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      let decrypted = decipher.update(value);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted.toString("utf8");
    } catch (error) {
      console.log("Decryption failed:", error);
      throw new Error("Decryption failed");
    }
  }

  private calculateMac(iv: string, value: string): string {
    const hmac = crypto.createHmac("sha256", this.key);
    hmac.update(iv + value);
    return hmac.digest("hex");
  }

  decryptData(data: DecryptableData): DecryptableData {
    if (Array.isArray(data)) {
      return data.map((item) => this.decryptData(item));
    } else if (typeof data === "object" && data !== null) {
      const decrypted: Record<string, DecryptableData> = {};
      for (const [key, value] of Object.entries(data)) {
        decrypted[key] = this.decryptData(value);
      }
      return decrypted;
    } else if (typeof data === "string") {
      try {
        const decrypted = this.decrypt(data);
        // Convert DecryptedData to DecryptableData
        if (typeof decrypted === "object" && decrypted !== null) {
          if (Array.isArray(decrypted)) {
            return (decrypted as DecryptableData[]).map((item: DecryptableData) =>
              this.decryptData(item)
            );
          } else {
            const result: Record<string, DecryptableData> = {};
            for (const [key, value] of Object.entries(decrypted)) {
              result[key] = this.decryptData(value as DecryptableData);
            }
            return result;
          }
        }
        return decrypted as DecryptableData;
      } catch {
        return data;
      }
    }
    return data;
  }

  decryptSerializedData(encryptedData: string): DecryptedData {
    try {
      const decrypted = this.decrypt(encryptedData);
      if (typeof decrypted === "string" && decrypted.startsWith("{")) {
        return JSON.parse(decrypted) as DecryptedData;
      }
      return decrypted;
    } catch (error) {
      console.log("Failed to decrypt serialized data:", error);
      throw error;
    }
  }
}

export default CryptoUtils;
