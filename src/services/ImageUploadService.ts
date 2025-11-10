




import axiosInstance from '../api/axios';
import axios from 'axios';

export interface UploadResponse {
    uploadUrl: string;
    imageKey: string;
    publicUrl: string;
}

export class ImageUploadService {
	static async generateUploadUrl(type: string, fileExtension: string): Promise<UploadResponse> {
		const response = await axiosInstance.post(`/image-service/upload-url/${type}`, {
			fileExtension
		});
		return response.data.data;
	}

	static async uploadToS3(
		uploadUrl: string,
		file: File,
		onProgress?: (progress: number) => void
	): Promise<void> {
		await axios.put(uploadUrl, file, {
			headers: {
				'Content-Type': file.type,
			},
			onUploadProgress: (progressEvent) => {
				if (onProgress && progressEvent.total) {
					const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					onProgress(progress);
				}
			}
		});
	}

	static async confirmUpload(imageKey: string, publicUrl: string, imageType: string): Promise<void> {
		await axiosInstance.post('/image-service/confirm-upload', {
			imageKey,
			publicUrl,
			imageType
		});
	}

	static async uploadImage(
		type: string,
		file: File,
		onProgress?: (progress: number) => void
	): Promise<string> {
		if (!file.type.startsWith('image/')) {
			throw new Error('Please select an image file');
		}

		if (file.size > 5 * 1024 * 1024) {
			throw new Error('File size must be less than 5MB');
		}

		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			throw new Error('Only JPEG, PNG, and WebP images are allowed');
		}

		const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';

		const { uploadUrl, imageKey, publicUrl } = await this.generateUploadUrl(type, fileExtension);

		await this.uploadToS3(uploadUrl, file, onProgress);

		await this.confirmUpload(imageKey, publicUrl, type);

		return imageKey;
	}

	static async uploadContestThumbnail(
		file: File,
		onProgress?: (progress: number) => void
	): Promise<string> {
		return this.uploadImage('contest-thumbnail', file, onProgress);
	}

	static async uploadRoomThumbnail(
		file: File,
		onProgress?: (progress: number) => void
	): Promise<string> {
		return this.uploadImage('room-thumbnail', file, onProgress);
	}

	static async uploadProfileImage(
		file: File,
		onProgress?: (progress: number) => void
	): Promise<string> {
		return this.uploadImage('profile-images', file, onProgress);
	}
}

export default new ImageUploadService();