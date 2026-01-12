import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useManhwaDetail = (manhwaId) => {
    const [manhwaDetail, setManhwaDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchManhwaDetail = async () => {
        setLoading(true);
        try {
            const result = await apiService.getDetail(manhwaId);
            if (result && result.data) {
                setManhwaDetail(result.data);
            }
        } catch (err) {
            setError('Gagal mengambil detail manhwa');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManhwaDetail();
    }, [manhwaId]);
    return { manhwaDetail, loading, error, refresh: fetchManhwaDetail };
};


export const useChapterList = (manhwaId) => {
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('desc');
    const [search, setSearch] = useState('');
    const [totalPage, setTotalPage] = useState(1);

    const fetchChapters = useCallback(async () => {
        if (!manhwaId) return;
        setLoading(true);
        try {
            // Tambahkan angka 20 (atau pageSize yang diinginkan) di urutan ketiga
            const result = await apiService.getChapterList(manhwaId, page, 20, order, search);

            setChapters(result?.data || []);
            setTotalPage(result?.meta?.total_page || 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [manhwaId, page, order, search]);

    useEffect(() => {
        fetchChapters();
    }, [fetchChapters]);

    return {
        chapters, loading, page, setPage,
        order, setOrder, search, setSearch,
        totalPage
    };
};