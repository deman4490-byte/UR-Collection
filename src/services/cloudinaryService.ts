import { CLOUDINARY_CONFIG, isCloudinaryConfigured } from '../config/cloudinary';

export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
  original_filename: string;
}

/**
 * Uploads an image file directly to Cloudinary using an unsigned upload preset.
 * 
 * @param file - The File or Blob selected by the admin
 * @param onProgress - Optional callback receiving progress percentage (0 - 100)
 * @returns Promise<string> - The secure HTTPS download URL from Cloudinary (secure_url)
 */
export async function uploadImageToCloudinary(
  file: File | Blob,
  onProgress?: (percent: number) => void
): Promise<string> {
  const { cloudName, uploadPreset, folder } = CLOUDINARY_CONFIG;

  // Validation
  if (!cloudName || cloudName === 'your_cloud_name_here') {
    throw new Error(
      'Cloudinary "Cloud Name" is not configured. Please paste your Cloud Name into "src/config/cloudinary.ts" or set VITE_CLOUDINARY_CLOUD_NAME in your .env file.'
    );
  }

  if (!uploadPreset || uploadPreset === 'your_upload_preset_here') {
    throw new Error(
      'Cloudinary "Upload Preset" is not configured. Please create an Unsigned Upload Preset in Cloudinary Settings -> Upload and paste its name into "src/config/cloudinary.ts" or set VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset.trim());
  if (folder) {
    formData.append('folder', folder.trim());
  }

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    // Track upload progress (0 to 100%)
    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
          const secureUrl = data.secure_url || data.url;
          if (secureUrl) {
            console.log('Cloudinary direct upload successful. Secure URL:', secureUrl);
            resolve(secureUrl);
          } else {
            reject(new Error('Cloudinary response did not contain an image URL.'));
          }
        } catch (parseError) {
          reject(new Error('Failed to parse Cloudinary response JSON.'));
        }
      } else {
        let errorDetails = `Upload failed with HTTP status ${xhr.status}`;
        try {
          const errorJson = JSON.parse(xhr.responseText);
          if (errorJson.error && errorJson.error.message) {
            errorDetails = errorJson.error.message;
          }
        } catch (_) {}

        // Friendly error messages for common misconfigurations
        if (errorDetails.toLowerCase().includes('preset') || errorDetails.toLowerCase().includes('unsigned')) {
          errorDetails += ' (Verify that your Cloudinary upload preset has Signing Mode set to "Unsigned").';
        }

        console.error('Cloudinary API error:', errorDetails);
        reject(new Error(`Cloudinary Error: ${errorDetails}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred while connecting to Cloudinary upload endpoint. Check your internet connection.'));
    };

    xhr.send(formData);
  });
}
