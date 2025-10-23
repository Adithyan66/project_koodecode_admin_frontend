import axiosInstance from './axios';
import type { 
  ActiveContestsResponse, 
  UpcomingContestsResponse, 
  PastContestsResponse,
  ContestQuery 
} from '../types/contest';

export const fetchActiveContests = async (): Promise<ActiveContestsResponse> => {
  const response = await axiosInstance.get('admin/contests/active');
  return response.data;
};

export const fetchUpcomingContests = async (): Promise<UpcomingContestsResponse> => {
  const response = await axiosInstance.get('admin/contests/upcoming');
  return response.data;
};

export const fetchPastContests = async (query: ContestQuery = {}): Promise<PastContestsResponse> => {
  const params = new URLSearchParams();
  
  if (query.page) params.append('page', query.page.toString());
  if (query.limit) params.append('limit', query.limit.toString());
  if (query.search) params.append('search', query.search);
  if (query.state) params.append('state', query.state);

  const response = await axiosInstance.get(`admin/contests/past?${params.toString()}`);
  return response.data;
};

export const deleteContest = async (contestId: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(`admin/contests/${contestId}`);
  return response.data;
};

export const fetchContestById = async (contestId: string) => {
  const response = await axiosInstance.get(`admin/contests/${contestId}`);
  return response.data;
};

export const updateContest = async (contestId: string, contestData: any): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.patch(`admin/contests/${contestId}`, contestData);
  return response.data;
};
