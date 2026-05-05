/**
 * Get the correct image URL based on whether it's a local file or blob URL
 * @param {string} image - The image path or URL from the database
 * @returns {string} - The correct image URL
 */
export function getImageUrl(image) {
  if (!image) return '';
  
  // If it's already a full URL (http/https), return as-is (blob storage)
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  
  // If it's a local filename, prepend /uploads/
  return `/uploads/${image}`;
}