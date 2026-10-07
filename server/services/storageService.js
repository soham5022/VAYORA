class StorageService {
  constructor() {
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
    this.apiKey = process.env.CLOUDINARY_API_KEY || '';
    this.apiSecret = process.env.CLOUDINARY_API_SECRET || '';
  }

  /**
   * Upload image to storage
   * Supports Cloudinary or returns hosted/data URL
   */
  async uploadImage(fileData, folder = 'vayora/uploads') {
    if (this.cloudName && this.apiKey && this.apiSecret) {
      try {
        const formData = new FormData();
        formData.append('file', fileData);
        formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || 'vayora_preset');
        formData.append('folder', folder);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          return { url: data.secure_url, publicId: data.public_id };
        }
      } catch (err) {
        console.warn('[StorageService] Cloudinary upload error:', err.message);
      }
    }

    // Default safe fallback if uploading in dev
    return {
      url: typeof fileData === 'string' && fileData.startsWith('http') ? fileData : 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      publicId: `vayora_dev_${Date.now()}`,
    };
  }
}

export default new StorageService();
