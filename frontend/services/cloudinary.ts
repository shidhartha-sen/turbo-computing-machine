const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads a local file URI to Cloudinary using an unsigned upload preset.
 * Returns the secure Cloudinary URL.
 */
export async function uploadToCloudinary(localUri: string): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary env vars are not set.');
  }

  const filename = localUri.split('/').pop() ?? 'upload.jpg';
  const ext = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
  const mimeType = ext === 'mp4' || ext === 'mov' ? 'video/mp4' : 'image/jpeg';

  const body = new FormData();
  body.append('file', { uri: localUri, name: filename, type: mimeType } as any);
  body.append('upload_preset', UPLOAD_PRESET);

  const resourceType = mimeType.startsWith('video') ? 'video' : 'image';
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: 'POST', body },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Cloudinary upload failed (${res.status})`);
  }

  const data = await res.json();
  return data.secure_url as string;
}

/**
 * Uploads multiple local URIs in parallel. Returns Cloudinary URLs in the same order.
 */
export async function uploadAllToCloudinary(localUris: string[]): Promise<string[]> {
  return Promise.all(localUris.map(uploadToCloudinary));
}
