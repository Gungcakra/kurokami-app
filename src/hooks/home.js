import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useManhwa = () => {
    const [newUpdates, setNewUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHomeData = async () => {
        setLoading(true);
        try {
            const result = await apiService.getNewUpdate();
            if (result && result.data) {
                
                setNewUpdates(result.data); 
            }
        } catch (err) {
            setError('Gagal mengambil data terbaru');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHomeData();
    }, []);

    return { newUpdates, loading, error, refresh: fetchHomeData };
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
