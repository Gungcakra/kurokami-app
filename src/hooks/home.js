import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useUpdate = (selectedType = 'all') => {
    const [newUpdates, setNewUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [format, setFormat] = useState(selectedType);

    const fetchHomeData = async (page = 1, pageSize = 30, selectedFormat = format) => {
        setLoading(true);
        try {
            const result = await apiService.getNewUpdate(page, pageSize, selectedFormat);
            if (result && result.data) {
                setNewUpdates(result.data);
            }
        } catch (err) {
            setError('Gagal mengambil data terbaru');
        } finally {
            setLoading(false);
        }
    };

    const changeFormat = (newFormat) => {
        setFormat(newFormat);
        fetchHomeData(1, 30, newFormat);
    };

    useEffect(() => {
        fetchHomeData(1, 30, selectedType);
    }, [selectedType]);

    return { newUpdates, loading, error, format, changeFormat, refresh: fetchHomeData };
};

export const useGenres = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchGenres = async () => {
        setLoading(true);
        try {
            const result = await apiService.getGenres();
            if (result && result.data) {
                setGenres(result.data);
            }
        } catch (err) {
            setError('Gagal mengambil data genre');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);
    return { genres, loading, error, getGenres: fetchGenres };
};

export const useRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const result = await apiService.getRecommend();
            if (result && result.data) {
                setRecommendations(result.data);
            }
        } catch (err) {
            setError('Gagal mengambil data rekomendasi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);
    return { recommendations, loading, error, getRecommendations: fetchRecommendations };
}

export const usePopularManhwa = () => {
    const [popularManhwa, setPopularManhwa] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchPopularManhwa = async () => {
        setLoading(true);
        try {
            const result = await apiService.getPopular();
            if (result && result.data) {
                setPopularManhwa(result.data);
            }
        } catch (err) {
            setError('Gagal mengambil data manhwa populer');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopularManhwa();
    }, []);
    return { popularManhwa, loading, error, getPopularManhwa: fetchPopularManhwa };
}

export const useTop = () => {
    const [topManhwa, setTopManhwa] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchTopManhwa = async () => {
        setLoading(true);
        try {
            const result = await apiService.getTop();
            if (result && result.data) {
                setTopManhwa(result.data);
            }
        } catch (err) {
            setError('Gagal mengambil data manhwa teratas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopManhwa();
    }, []);
    return { topManhwa, loading, error, getTopManhwa: fetchTopManhwa };
}

export const useComplete = () => {
    const [completedManhwa, setCompletedManhwa] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchCompletedManhwa = async () => {
        setLoading(true);
        try {
            const result = await apiService.getCompleted();
            if (result && result.data) {
                setCompletedManhwa(result.data);
            }
        } catch (err) {
            setError('Gagal mengambil data manhwa selesai');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedManhwa();
    }, []);
    return { completedManhwa, loading, error, getCompletedManhwa: fetchCompletedManhwa };
}

export const useSearchManhwa = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const searchManhwa = async (searchKeyword, pageNumber = 1, isNextPage = false) => {
        if (!searchKeyword) {
            setSearchResults([]);
            return;
        }

        if (isNextPage) setLoadingMore(true);
        else setLoading(true);

        try {
            const result = await apiService.searchManga(searchKeyword, pageNumber);
            const newData = result?.data || [];
            
            if (isNextPage) {
                setSearchResults(prev => [...prev, ...newData]);
            } else {
                setSearchResults(newData);
            }

            // Cek apakah masih ada halaman selanjutnya
            setHasMore(newData.length > 0); 
            setPage(pageNumber);
        } catch (err) {
            setError('Gagal mencari manhwa');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Debounce Logic: Menunggu user berhenti mengetik selama 500ms
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (keyword) {
                searchManhwa(keyword, 1, false);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [keyword]);

    const loadMore = () => {
        if (!loading && !loadingMore && hasMore) {
            searchManhwa(keyword, page + 1, true);
        }
    };

    return { 
        searchResults, 
        loading, 
        loadingMore, 
        error, 
        keyword, 
        setKeyword, 
        loadMore 
    };
};