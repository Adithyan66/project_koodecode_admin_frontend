import { useState, useCallback, useRef, useEffect } from 'react';
import type { SetStateAction } from 'react';
import axiosInstance from '../../api/axios';
import { ImageUploadService } from '../../services/ImageUploadService';
import { imageKitService } from '../../services/ImageKitService';
import { useGlobalLoading } from '../ui/useGlobalLoading';
import toast from 'react-hot-toast';

// Updated interfaces
interface Problem {
  id: string;
  problemNumber: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    problems: Problem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasMore: boolean;
      limit: number;
    };
  };
}

interface CoinReward {
  rank: number;
  coins: number;
}

interface ContestFormData {
  title: string;
  description: string;
  problemIds: string[]; // Changed to string[] to match problem IDs
  startTime: Date | null;
  endTime: Date | null;
  registrationDeadline: Date | null;
  problemTimeLimit: number;
  maxAttempts: number;
  wrongSubmissionPenalty: number;
  coinRewards: CoinReward[];
  thumbnail?: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  problemIds?: string;
  startTime?: string;
  endTime?: string;
  registrationDeadline?: string;
  problemTimeLimit?: string;
  maxAttempts?: string;
  wrongSubmissionPenalty?: string;
  coinRewards?: string;
}

export interface UseCreateContestReturn {
  // Form state
  formData: ContestFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContestFormData>>;
  formErrors: FormErrors;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>;

  // Image upload state
  thumbnailImage: string;
  setThumbnailImage: React.Dispatch<React.SetStateAction<string>>;
  isUploading: boolean;
  uploadProgress: number;

  // Problem selection state
  problems: Problem[];
  selectedProblems: Problem[];
  setSelectedProblems: React.Dispatch<React.SetStateAction<Problem[]>>;
  problemSearch: string;
  setProblemSearch: React.Dispatch<React.SetStateAction<string>>;
  loadingProblems: boolean;

  // Pagination state
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
  itemsPerPage: number;

  // Coin rewards state
  coinRewards: CoinReward[];
  setCoinRewards: React.Dispatch<React.SetStateAction<CoinReward[]>>;

  // Submission state
  isSubmitting: boolean;

  // Original data for comparison
  originalContestData: ContestFormData | null;
  setOriginalContestData: React.Dispatch<React.SetStateAction<ContestFormData | null>>;

  // Actions
  handleThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleProblemToggle: (problem: Problem) => void;
  handleSearchChange: (searchTerm: string) => void;
  handlePageChange: (page: number) => void;
  addCoinReward: () => void;
  removeCoinReward: (index: number) => void;
  updateCoinReward: (index: number, field: 'rank' | 'coins', value: number) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | Date | null,
    field: keyof ContestFormData
  ) => void;
  validateForm: (data: ContestFormData, tab: string, rewards?: CoinReward[]) => FormErrors;
  submitContest: (contestId?: string, isEdit?: boolean) => Promise<void>;
  resetForm: () => void;
}

export function useCreateContest(): UseCreateContestReturn {
  const { showLoading, hideLoading } = useGlobalLoading();

  // Form state
  const [formData, setFormData] = useState<ContestFormData>({
    title: '',
    description: '',
    problemIds: [],
    startTime: null,
    endTime: null,
    registrationDeadline: null,
    problemTimeLimit: 90,
    maxAttempts: 3,
    wrongSubmissionPenalty: 50,
    coinRewards: [
      { rank: 1, coins: 1000 },
      { rank: 2, coins: 500 },
      { rank: 3, coins: 250 },
    ],
    thumbnail: '',
  });

  // Track original contest data for comparison in edit mode
  const [originalContestData, setOriginalContestData] = useState<ContestFormData | null>(null);

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Function to get only changed fields
  const getChangedFields = useCallback((currentData: ContestFormData, originalData: ContestFormData | null) => {
    if (!originalData) return currentData;

    const changedFields: Partial<ContestFormData> = {};

    // Compare each field
    const setField = (key: keyof ContestFormData, value: ContestFormData[keyof ContestFormData]) => {
      (changedFields as Record<keyof ContestFormData, ContestFormData[keyof ContestFormData]>)[key] = value;
    };

    (Object.keys(currentData) as (keyof ContestFormData)[]).forEach((key) => {
      const currentValue = currentData[key];
      const originalValue = originalData[key];

      // Special handling for arrays (problemIds, coinRewards)
      if (key === 'problemIds' || key === 'coinRewards') {
        if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
          setField(key, currentValue);
        }
      }
      // Special handling for dates
      else if (key === 'startTime' || key === 'endTime' || key === 'registrationDeadline') {
        const currentTime = currentValue ? new Date(currentValue as Date).getTime() : null;
        const originalTime = originalValue ? new Date(originalValue as Date).getTime() : null;
        if (currentTime !== originalTime) {
          setField(key, currentValue);
        }
      }
      // Regular field comparison
      else if (currentValue !== originalValue) {
        setField(key, currentValue);
      }
    });

    return changedFields;
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image upload states
  const [thumbnailImage, setThumbnailImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Problem selection states with pagination
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);
  const [problemSearch, setProblemSearch] = useState('');
  const [loadingProblems, setLoadingProblems] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [itemsPerPage] = useState(10); // Fixed items per page

  // Throttling ref for search
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Note: coinRewards is now part of formData, not a separate state

  // Validation function
  const validateForm = useCallback((data: ContestFormData, tab: string, rewards?: CoinReward[]): FormErrors => {
    const errors: FormErrors = {};

    if (tab === 'basic' || tab === 'all') {
      if (!data.title) {
        errors.title = 'Title is required';
      } else if (data.title.length > 100) {
        errors.title = 'Title must be less than 100 characters';
      }

      if (!data.description) {
        errors.description = 'Description is required';
      } else if (data.description.length > 1000) {
        errors.description = 'Description must be less than 1000 characters';
      }
    }

    if (tab === 'problems' || tab === 'all') {
      if (data.problemIds.length === 0) {
        errors.problemIds = 'At least one problem must be selected';
      }
    }

    if (tab === 'settings' || tab === 'all') {
      if (!data.registrationDeadline) {
        errors.registrationDeadline = 'Registration deadline is required';
      }
      if (!data.startTime) {
        errors.startTime = 'Start time is required';
      }
      if (!data.endTime) {
        errors.endTime = 'End time is required';
      }
      if (data.registrationDeadline && data.startTime && data.registrationDeadline >= data.startTime) {
        errors.registrationDeadline = 'Registration deadline must be before start time';
      }
      if (data.startTime && data.endTime && data.startTime >= data.endTime) {
        errors.endTime = 'End time must be after start time';
      }
      if (data.problemTimeLimit < 1) {
        errors.problemTimeLimit = 'Problem time limit must be at least 1 minute';
      } else if (data.problemTimeLimit > 300) {
        errors.problemTimeLimit = 'Problem time limit cannot exceed 300 minutes';
      }
      if (data.maxAttempts < 1) {
        errors.maxAttempts = 'Max attempts must be at least 1';
      } else if (data.maxAttempts > 10) {
        errors.maxAttempts = 'Max attempts cannot exceed 10';
      }
      if (data.wrongSubmissionPenalty < 0) {
        errors.wrongSubmissionPenalty = 'Penalty cannot be negative';
      } else if (data.wrongSubmissionPenalty > 1000) {
        errors.wrongSubmissionPenalty = 'Penalty cannot exceed 1000 points';
      }
    }

    if (tab === 'rewards' || tab === 'all') {
      const rewardsToValidate = rewards || data.coinRewards;
      if (rewardsToValidate.length === 0) {
        errors.coinRewards = 'At least one reward must be defined';
      } else {
        rewardsToValidate.forEach((reward, index) => {
          if (reward.rank < 1) {
            errors.coinRewards = `Rank at position ${index + 1} must be at least 1`;
          }
          if (reward.coins < 0) {
            errors.coinRewards = `Coins at position ${index + 1} cannot be negative`;
          }
        });
      }
    }

    return errors;
  }, []);

  // Throttled fetch problems function
  const fetchProblems = useCallback(async (page: number = 1, search: string = '') => {
    setLoadingProblems(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        ...(search.trim() && { search: search.trim() })
      });

      const response = await axiosInstance.get<ApiResponse>(`/user/problems/problem-names?${params}`);

      if (response.data.success) {
        const { problems: fetchedProblems, pagination } = response.data.data;

        setProblems(fetchedProblems);
        setCurrentPage(pagination.currentPage);
        setTotalPages(pagination.totalPages);
        setTotalItems(pagination.totalItems);
        setHasMore(pagination.hasMore);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoadingProblems(false);
    }
  }, [itemsPerPage]);

  // Throttled search handler
  const handleSearchChange = useCallback((searchTerm: string) => {
    setProblemSearch(searchTerm);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for throttling
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchProblems(1, searchTerm);
    }, 500); // 500ms throttle delay
  }, [fetchProblems]);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      fetchProblems(page, problemSearch);
    }
  }, [currentPage, totalPages, fetchProblems, problemSearch]);

  // Initial load
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Problem toggle handler
  const handleProblemToggle = useCallback((problem: Problem) => {
    const isSelected = selectedProblems.find((p) => p.id === problem.id);

    if (isSelected) {
      const updated = selectedProblems.filter((p) => p.id !== problem.id);
      setSelectedProblems(updated);
      setFormData((prev) => ({
        ...prev,
        problemIds: updated.map((p) => p.id)
      }));
    } else {
      const updated = [...selectedProblems, problem];
      setSelectedProblems(updated);
      setFormData((prev) => ({
        ...prev,
        problemIds: updated.map((p) => p.id)
      }));
    }
  }, [selectedProblems]);


  // const handleThumbnailUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   if (!file.type.startsWith('image/')) {
  //     throw new Error('Please select an image file');
  //   }

  //   setIsUploading(true);
  //   setUploadProgress(0);

  //   try {

  //     const imageKey = await ImageUploadService.uploadImage('contest-thumbnail', file, onprogress);
  //     // const imageKey = await ImageUploadService.uploadProfileImage(file, (progress) => {
  //     //   setUploadProgress(progress);
  //     // });

  //     const optimizedUrl = imageKitService.getProfileImageUrl(imageKey, 400, 200, { radius: "8" });

  //     setThumbnailImage(optimizedUrl);
  //     setFormData((prev) => ({ ...prev, thumbnail: imageKey }));
  //   } catch (error: any) {
  //     console.error('Upload failed:', error);
  //     throw error;
  //   } finally {
  //     setIsUploading(false);
  //     setUploadProgress(0);
  //   }
  // }, []);

  // Coin reward handlers


  const handleThumbnailUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      throw new Error('Please select an image file');
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Fix: Pass the progress callback function properly
      const imageKey = await ImageUploadService.uploadImage('contest-thumbnail', file, (progress) => {
        setUploadProgress(progress);
      });

      // Use ImageKit for optimization
      const optimizedUrl = imageKitService.getOptimizedImageUrl(imageKey, {
        width: 400,
        height: 200,
        crop: 'at_least',
        quality: 80,
        format: 'auto'
      });

      setThumbnailImage(optimizedUrl);
      setFormData((prev) => ({ ...prev, thumbnail: imageKey }));
    } catch (error: any) {
      console.error('Upload failed:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const setCoinRewards = useCallback((value: SetStateAction<CoinReward[]>) => {
    setFormData((prev) => {
      const nextRewards = typeof value === 'function' ? value(prev.coinRewards) : value;
      return { ...prev, coinRewards: nextRewards };
    });
  }, []);

  const addCoinReward = useCallback(() => {
    setFormData((prev) => {
      const newRank = prev.coinRewards.length + 1;
      const newRewards = [...prev.coinRewards, { rank: newRank, coins: 100 }];
      return { ...prev, coinRewards: newRewards };
    });
  }, []);

  const removeCoinReward = useCallback((index: number) => {
    setFormData((prev) => {
      if (prev.coinRewards.length <= 1) {
        throw new Error('At least one reward must be defined');
      }
      const newRewards = prev.coinRewards.filter((_, i) => i !== index);
      return { ...prev, coinRewards: newRewards };
    });
  }, []);

  const updateCoinReward = useCallback((index: number, field: 'rank' | 'coins', value: number) => {
    setFormData((prev) => {
      const newRewards = prev.coinRewards.map((reward, i) =>
        i === index ? { ...reward, [field]: value } : reward
      );
      return { ...prev, coinRewards: newRewards };
    });
  }, []);

  // Input change handler
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | Date | null,
    field: keyof ContestFormData
  ) => {
    if (e instanceof Date) {
      setFormData((prev) => ({ ...prev, [field]: e }));
    } else if (e && 'target' in e) {
      const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  }, []);

  // Submit contest
  const submitContest = useCallback(async (contestId?: string, isEdit?: boolean) => {
    const errors = validateForm(formData, 'all', formData.coinRewards);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      throw new Error('Please fix all errors before submitting.');
    }

    setIsSubmitting(true);
    showLoading(isEdit ? 'Updating contest...' : 'Creating contest...');

    try {
      const contestData = {
        ...formData,
        problemIds: selectedProblems.map((p) => p.id),
      };

      if (isEdit && contestId) {
        // For edit, only send changed fields
        const changedFields = getChangedFields(contestData, originalContestData);
        
        // If no fields have changed, show a message and return
        if (Object.keys(changedFields).length === 0) {
          toast('No changes detected');
          return;
        }
        
        await axiosInstance.patch(`/admin/contests/${contestId}`, changedFields);
        toast.success('Contest updated successfully!');
      } else {
        // For create
        await axiosInstance.post('/admin/contests/create', contestData);
        toast.success('Contest created successfully!');
      }
    } catch (error: any) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} contest:`, error);
      throw error;
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  }, [formData, selectedProblems, validateForm, showLoading, hideLoading, getChangedFields, originalContestData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      problemIds: [],
      startTime: null,
      endTime: null,
      registrationDeadline: null,
      problemTimeLimit: 90,
      maxAttempts: 3,
      wrongSubmissionPenalty: 50,
      coinRewards: [
        { rank: 1, coins: 1000 },
        { rank: 2, coins: 500 },
        { rank: 3, coins: 250 },
      ],
      thumbnail: '',
    });
    setFormErrors({});
    setThumbnailImage('');
    setSelectedProblems([]);
    setProblemSearch('');
    setCurrentPage(1);
    setOriginalContestData(null);
  }, []);

  return {
    // Form state
    formData,
    setFormData,
    formErrors,
    setFormErrors,

    // Image upload state
    thumbnailImage,
    setThumbnailImage,
    isUploading,
    uploadProgress,

    // Problem selection state
    problems,
    selectedProblems,
    setSelectedProblems,
    problemSearch,
    setProblemSearch,
    loadingProblems,

    // Pagination state
    currentPage,
    totalPages,
    totalItems,
    hasMore,
    itemsPerPage,

    // Coin rewards state
    coinRewards: formData.coinRewards,
    setCoinRewards,

    // Submission state
    isSubmitting,

    // Original data for comparison
    originalContestData,
    setOriginalContestData,

    // Actions
    handleThumbnailUpload,
    handleProblemToggle,
    handleSearchChange,
    handlePageChange,
    addCoinReward,
    removeCoinReward,
    updateCoinReward,
    handleInputChange,
    validateForm,
    submitContest,
    resetForm,
  };
}
