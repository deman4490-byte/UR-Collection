/**
 * ============================================================================
 * CLOUDINARY CONFIGURATION (Unsigned Direct Uploads)
 * ============================================================================
 * 
 * 📍 WHERE TO PASTE YOUR CLOUDINARY CREDENTIALS:
 * 
 * You can paste them directly into this file below, OR put them in your `.env` file!
 * 
 * 1. cloudName:
 *    Found on your Cloudinary Dashboard under "Cloud name".
 * 
 * 2. uploadPreset:
 *    Found in Cloudinary Console:
 *    Settings (Gear icon) -> Upload -> Upload presets -> Add upload preset
 *    IMPORTANT: Make sure "Signing Mode" is set to "Unsigned"!
 * ============================================================================
 */

export const CLOUDINARY_CONFIG = {
  // Cloudinary Cloud Name
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ctxdk31f',

  // Cloudinary Upload Preset (Unsigned)
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ur_collection_store',

  // Optional: Cloudinary folder where UR Collection product photos will be organized
  folder: 'ur_collection_products'
};

/**
 * Helper to check if user has replaced placeholder credentials
 */
export const isCloudinaryConfigured = (): boolean => {
  const { cloudName, uploadPreset } = CLOUDINARY_CONFIG;
  return (
    Boolean(cloudName) &&
    cloudName !== 'your_cloud_name_here' &&
    Boolean(uploadPreset) &&
    uploadPreset !== 'your_upload_preset_here'
  );
};
