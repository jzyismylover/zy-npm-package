import COS from "cos-nodejs-sdk-v5";

export class COSService {
  private cos: COS;
  private bucket: string;
  private region: string;

  constructor() {
    this.cos = new COS({
      SecretId: process.env.COS_SECRET_ID,
      SecretKey: process.env.COS_SECRET_KEY,
    });
    this.bucket = process.env.COS_BUCKET!;
    this.region = process.env.COS_REGION!;
  }

  async uploadFile(filePath: string): Promise<string> {
    try {
      const valid = this._checkEnv();
      if (!valid) {
        throw new Error(
          "未设置COS_SECRET_ID, COS_SECRET_KEY, COS_BUCKET, COS_REGION环境变量",
        );
      }

      const fileName = filePath.split("/").pop()!;
      const key = `images/${Date.now()}-${fileName}`;

      return new Promise((resolve, reject) => {
        this.cos.uploadFile(
          {
            Bucket: this.bucket,
            Region: this.region,
            Key: key,
            FilePath: filePath,
          },
          (err, data) => {
            if (err) {
              reject(err);
              return;
            }
            const url = `https://${this.bucket}.cos.${this.region}.myqcloud.com/${key}`;
            resolve(url);
          },
        );
      });
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  private _checkEnv(): boolean {
    return !!(
      process.env.COS_SECRET_ID &&
      process.env.COS_SECRET_KEY &&
      process.env.COS_BUCKET &&
      process.env.COS_REGION
    );
  }
}
