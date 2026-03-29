/**
 * Detects whether a Cloudinary URL points to a video.
 * Cloudinary video URLs use `/video/upload/` while images use `/image/upload/`.
 */
export function isVideoUrl(url: string): boolean {
  return /\/video\/upload\//i.test(url);
}

/**
 * Converts a Cloudinary video URL into a thumbnail image URL.
 * Uses Cloudinary's on-the-fly transformation to grab the first frame as a jpg.
 */
export function getVideoThumbnail(url: string): string {
  return url
    .replace(/\/video\/upload\//, '/video/upload/so_0,f_jpg,q_auto/')
    .replace(/\.[^.]+$/, '.jpg');
}
