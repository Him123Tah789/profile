import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const allowedMime = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp"]);

export function ensureAllowedFile(file: File) {
  if (!allowedMime.has(file.type)) {
    throw new Error("Unsupported file type");
  }
}

export async function storeFile(file: File) {
  ensureAllowedFile(file);

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
  const key = `${Date.now()}-${randomUUID()}-${safeName}`;

  if (process.env.STORAGE_PROVIDER === "s3") {
    const s3 = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ""
      }
    });

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: bytes,
        ContentType: file.type
      })
    );

    const publicBase = process.env.S3_PUBLIC_BASE_URL;
    if (!publicBase) throw new Error("Missing S3_PUBLIC_BASE_URL");
    return `${publicBase.replace(/\/$/, "")}/${key}`;
  }

  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const path = join(uploadDir, key);
  await writeFile(path, bytes);

  return `/uploads/${key}`;
}
