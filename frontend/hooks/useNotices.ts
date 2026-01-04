import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG } from '@/constants/api';
import { Notice } from '@/types/admin';

interface UseNoticesReturn {
  notices: Notice[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useNotices(limit: number = 5): UseNoticesReturn {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_CONFIG.admin.notices);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notices');
      }

      const data = await response.json();
      const noticeList = Array.isArray(data) ? data : data.notices || [];
      
      // Sort by createdAt descending and limit
      const sortedNotices = noticeList
        .map((n: any) => ({
          ...n,
          processingStatus: n.processingStatus || 'pending',
        }))
        .sort((a: Notice, b: Notice) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, limit);

      setNotices(sortedNotices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return {
    notices,
    isLoading,
    error,
    refetch: fetchNotices,
  };
}
