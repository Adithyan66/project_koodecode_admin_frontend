import axiosInstance from './axios';
import type { RoomsResponse, RoomsQuery, RoomDetailResponse } from '../types/room';

export async function fetchRooms(params?: RoomsQuery): Promise<RoomsResponse> {
	const { data } = await axiosInstance.get<RoomsResponse>('/admin/rooms', { params });
	return data;
}

export async function fetchRoomDetail(roomId: string): Promise<RoomDetailResponse> {
	const { data } = await axiosInstance.get<RoomDetailResponse>(`/admin/rooms/${roomId}`);
	return data;
}

