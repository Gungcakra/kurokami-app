const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        return null; // Mengembalikan null lebih baik untuk pengecekan state
    }
};

export const apiService = {
    getNewUpdate: () => fetchData('/v1/manga/list?type=project&page=1&page_size=30&is_update=true&sort=latest&sort_order=desc'),

    getTopManga: () => fetchData('/v1/manga/list?type=project&page=1&page_size=24&is_update=true&sort=latest&sort_order=desc'),

    getRecommend: () => fetchData('/v1/manga/list?type=mirror&page=1&page_size=24&is_update=true&sort=latest&sort_order=desc'),

    getDetail: (manhwaId) => fetchData(`/v1/manga/detail/${manhwaId}`),

    getChapterList: (manhwaId, page = 1, order = 'desc', search = '') =>
        fetchData(`/v1/chapter/${manhwaId}/list?page=${page}&page_size=20&sort_by=chapter_number&sort_order=${order}${search ? `&search=${search}` : ''}`),

    getChapterDetail: (chapterId) => fetchData(`/v1/chapter/detail/${chapterId}`),

    searchManga: (keyword) => fetchData(`/v1/manga/list?page=1&page_size=15&q=${keyword}`),

    getGenres: () => fetchData('/v1/genre/list'),
};