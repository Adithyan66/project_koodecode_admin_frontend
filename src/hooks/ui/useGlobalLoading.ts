
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { setLoading } from '../../redux/slices/uiSlice';

export const useGlobalLoading = () => {
  const dispatch = useDispatch();

  const showLoading = useCallback((message?: string) => {
    dispatch(setLoading({ isLoading: true, message }));
  }, [dispatch]);

  const hideLoading = useCallback(() => {
    dispatch(setLoading({ isLoading: false }));
  }, [dispatch]);

  return { showLoading, hideLoading };
};