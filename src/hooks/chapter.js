import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useChapterDetail = (chapterId) => {
    const [chapterDetail, setChapterDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchChapterDetail = async () => {
        setLoading(true);
        try {
            const result = await apiService.getChapterDetail(chapterId);
            if (result && result.data) {
                setChapterDetail(result.data);
            }
        } catch (err) {
            setError('Gagal mengambil detail chapter');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChapterDetail();
    }, [chapterId]);
    return { chapterDetail, loading, error, refresh: fetchChapterDetail };
};