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
    getNewUpdate: (page = 1, pageSize = 30, format = 'all') => fetchData(`/v1/manga/list?${format === 'all' ? '' : `format=${format}`}&type=project&page=${page}&page_size=${pageSize}&is_update=true&sort=latest&sort_order=desc`),

    getPopular: (page = 1, pageSize = 24) => fetchData(`/v1/manga/list?page=${page}&page_size=${pageSize}&genre_include_mode=or&genre_exclude_mode=or&sort=popularity&sort_order=desc`),

    getTop: (page = 1, pageSize = 24) => fetchData(`/v1/manga/list?page=${page}&page_size=${pageSize}&genre_include_mode=or&genre_exclude_mode=or&sort=rating&sort_order=desc`),

    getRecommend: (page = 1, pageSize = 8) => fetchData(`/v1/manga/list?page=${page}&page_size=${pageSize}&category=explore-list-2`),

    getCompleted: (page = 1, pageSize = 24) => fetchData(`/v1/manga/list?page=${page}&page_size=${pageSize}&genre_include_mode=or&genre_exclude_mode=or&status=completed&sort=latest&sort_order=desc`),

    getManhwa: (page = 1, pageSize = 10) => fetchData(`/v1/manga/list${format === 'all' ? '' : '?format=manhwa'}&page=${page}&page_size=${pageSize}&is_recommended=true&sort=latest&sort_order=desc`),

    getManga: (page = 1, pageSize = 10) => fetchData(`/v1/manga/list${format === 'all' ? '' : '?format=manga'}&page=${page}&page_size=${pageSize}&is_recommended=true&sort=latest&sort_order=desc`),

    getManhua: (page = 1, pageSize = 10) => fetchData(`/v1/manga/list${format === 'all' ? '' : '?format=manhua'}&page=${page}&page_size=${pageSize}&is_recommended=true&sort=latest&sort_order=desc`),

    getDetail: (manhwaId) => fetchData(`/v1/manga/detail/${manhwaId}`),

    getChapterList: (manhwaId, page = 1, pageSize = 20, order = 'desc', search = '') =>
        fetchData(`/v1/chapter/${manhwaId}/list?page=${page}&page_size=${pageSize}&sort_by=chapter_number&sort_order=${order}${search ? `&search=${search}` : ''}`),

    getChapterDetail: (chapterId) => fetchData(`/v1/chapter/detail/${chapterId}`),

    searchManga: (keyword, page = 1, pageSize = 15) => fetchData(`/v1/manga/list?page=${page}&page_size=${pageSize}&q=${keyword}`),

    getGenres: () => fetchData('/v1/genre/list'),
};