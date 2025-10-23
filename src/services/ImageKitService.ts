


import ImageKit from 'imagekit-javascript';

type Size = 'small' | 'medium' | 'large';

interface ImageTransformations {
  width?: number;
  height?: number;
  crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max' | 'extract';
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  radius?: number | 'max';
  blur?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  sharpen?: number;
}

class ImageKitService {
  private imagekit: ImageKit;
  private urlEndpoint: string;

  constructor() {
    this.urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/your_imagekit_id/';

    this.imagekit = new ImageKit({
      publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || 'your_public_key',
      urlEndpoint: this.urlEndpoint
    });
  }

  // Generic optimized image URL generator
  getOptimizedImageUrl(s3Key: string, transformations?: ImageTransformations): string {
    if (!s3Key) return '';

    return this.imagekit.url({
      path: s3Key,
      transformation: [
        {
          width: transformations?.width || 400,
          height: transformations?.height || 400,
          crop: transformations?.crop || 'at_least',
          quality: transformations?.quality || 80,
          format: transformations?.format || 'auto',
          ...(transformations?.radius && { radius: transformations.radius }),
          ...(transformations?.blur && { blur: transformations.blur }),
          ...(transformations?.brightness && { brightness: transformations.brightness }),
          ...(transformations?.contrast && { contrast: transformations.contrast }),
          ...(transformations?.saturation && { saturation: transformations.saturation }),
          ...(transformations?.sharpen && { sharpen: transformations.sharpen }),
        }
      ]
    });
  }

  // Contest thumbnail specific
  getContestThumbnailUrl(s3Key: string, width: number = 400, height: number = 200): string {
    return this.getOptimizedImageUrl(s3Key, {
      width,
      height,
      crop: 'at_least',
      quality: 85,
      format: 'auto'
    });
  }

  // Room thumbnail specific
  getRoomThumbnailUrl(s3Key: string, width: number = 300, height: number = 200): string {
    return this.getOptimizedImageUrl(s3Key, {
      width,
      height,
      crop: 'at_least',
      quality: 80,
      format: 'auto'
    });
  }

  // Profile image with different sizes
  getProfileImageUrl(
    s3Key: string,
    width?: number,
    height?: number,
    options?: {
      radius?: number | 'max';
      crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max' | 'extract';
      quality?: number;
      format?: 'auto' | 'webp' | 'jpg' | 'png';
    }
  ): string {
    return this.getOptimizedImageUrl(s3Key, {
      width,
      height,
      crop: options?.crop || 'at_least',
      radius: options?.radius || 0,
      quality: options?.quality || 90,
      format: options?.format || 'auto'
    });
  }

  // Avatar with circular crop
  getAvatarUrl(s3Key: string, size: number = 100): string {
    return this.getOptimizedImageUrl(s3Key, {
      width: size,
      height: size,
      crop: 'force',
      radius: 'max',
      quality: 90,
      format: 'auto'
    });
  }

  // Problem image
  getProblemImageUrl(s3Key: string, width: number = 600, height: number = 400): string {
    return this.getOptimizedImageUrl(s3Key, {
      width,
      height,
      crop: 'at_least',
      quality: 85,
      format: 'auto'
    });
  }

  // Generic size presets
  getImageBySize(s3Key: string, size: Size): string {
    const sizeMap = {
      small: { width: 200, height: 200, quality: 70 },
      medium: { width: 400, height: 400, quality: 80 },
      large: { width: 800, height: 600, quality: 90 }
    };

    const config = sizeMap[size];
    return this.getOptimizedImageUrl(s3Key, config);
  }
}

export const imageKitService = new ImageKitService();