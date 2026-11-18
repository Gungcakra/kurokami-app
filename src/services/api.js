/**
 * Shinigami API — lihat SHINIGAMI_API.md.
 * Base URL sudah termasuk `/v1` (mis. https://api.shinigami.io/v1).
 */
const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.shinigami.io/v1"
).replace(/\/+$/, "");
const TIMEOUT_MS = 15000;

/** Bangun query string; nilai kosong/null dilewati, array jadi parameter berulang. */
const qs = (params) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) value.forEach((v) => sp.append(key, v));
    else sp.append(key, String(value));
  });
  const str = sp.toString();
  return str ? `?${str}` : "";
};

const fetchData = async (endpoint) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    return null;
  } finally {
    clearTimeout(timer);
  }
};

/**
 * List berbasis offset: API mengabaikan `page`/`page_size`, jadi diubah ke
 * `limit`/`offset`. `meta.page` & `meta.page_size` ditambahkan ke hasilnya.
 */
const fetchList = async (path, { page = 1, pageSize = 24, ...params } = {}) => {
  const result = await fetchData(
    `${path}${qs({ ...params, limit: pageSize, offset: (page - 1) * pageSize })}`
  );
  if (!result) return null;
  return { ...result, meta: { ...result.meta, page, page_size: pageSize } };
};

const ANY_GENRE = { genre_include_mode: "or", genre_exclude_mode: "or" };

const mangaList = (params) => fetchList("/manga/list", params);

const normalizeFormat = (format) =>
  format && format !== "all" ? format : undefined;

// ---- Chapter list (berbasis cursor) ----
// Semua chapter dimuat sekali per manga & urutan, di-cache 5 menit, lalu
// dipotong per halaman dan dicari secara lokal.
const CHAPTER_CACHE_TTL = 5 * 60 * 1000;
const CHAPTER_BATCH = 2000;
const CHAPTER_MAX_BATCHES = 20;
const chapterCache = new Map(); // key → { at, promise }

const fetchAllChapters = async (mangaId, order) => {
  const all = [];
  let cursor;
  for (let i = 0; i < CHAPTER_MAX_BATCHES; i++) {
    const result = await fetchData(
      `/chapter/${encodeURIComponent(mangaId)}/list${qs({
        limit: CHAPTER_BATCH,
        sort_by: "chapter_number",
        sort_order: order,
        cursor,
      })}`
    );
    if (!result) {
      if (i === 0) return null;
      break;
    }
    all.push(...(result.data || []));
    cursor = result.meta?.next_cursor;
    if (!result.meta?.has_next || !cursor) break;
  }
  return all;
};

const getAllChapters = (mangaId, order) => {
  const key = `${mangaId}:${order}`;
  const cached = chapterCache.get(key);
  if (cached && Date.now() - cached.at < CHAPTER_CACHE_TTL) return cached.promise;

  const promise = fetchAllChapters(mangaId, order).then((list) => {
    if (!list) chapterCache.delete(key); // jangan cache kegagalan
    return list;
  });
  chapterCache.set(key, { at: Date.now(), promise });
  return promise;
};

const firstChapterCache = new Map();

export const apiService = {
  // ---- Browse (/updates, /popular, /top, /recommended, /completed) ----
  getNewUpdate: (page = 1, pageSize = 30, format = "all") =>
    mangaList({
      page,
      pageSize,
      format: normalizeFormat(format),
      type: "project",
      is_update: true,
      sort: "latest",
      sort_order: "desc",
    }),

  getPopular: (page = 1, pageSize = 24) =>
    mangaList({ page, pageSize, ...ANY_GENRE, sort: "popularity", sort_order: "desc" }),

  getTop: (page = 1, pageSize = 24) =>
    mangaList({ page, pageSize, ...ANY_GENRE, sort: "rating", sort_order: "desc" }),

  getRecommend: (page = 1, pageSize = 8) =>
    mangaList({ page, pageSize, category: "explore-list-2" }),

  getCompleted: (page = 1, pageSize = 24) =>
    mangaList({
      page,
      pageSize,
      ...ANY_GENRE,
      status: "completed",
      sort: "latest",
      sort_order: "desc",
    }),

  // ---- /explore & /genres ----
  getGenres: () => fetchList("/taxonomy/list", { type: "genre", page: 1, pageSize: 100 }),

  getExplore: ({
    page = 1,
    pageSize = 12,
    genres = [],
    status = "",
    sort = "latest",
    format = "",
    sortOrder = "desc",
    keyword = "",
  } = {}) =>
    mangaList({
      page,
      pageSize,
      genre_include: genres,
      status,
      format: normalizeFormat(format),
      sort,
      sort_order: sortOrder,
      q: keyword,
      ...ANY_GENRE,
    }),

  searchManga: (keyword, page = 1, pageSize = 15) =>
    mangaList({ page, pageSize, q: keyword }),

  // ---- /manhwa/[id] ----
  getDetail: (manhwaId) => fetchData(`/manga/detail/${encodeURIComponent(manhwaId)}`),

  /**
   * Halaman chapter + pencarian nomor chapter (prefix, mis. "10" → 10, 100, 101…).
   * `meta.total_record` & `meta.total_page` dihitung sendiri karena API tidak memberi total.
   */
  getChapterList: async (manhwaId, page = 1, pageSize = 20, order = "desc", search = "") => {
    const all = await getAllChapters(manhwaId, order === "asc" ? "asc" : "desc");
    if (!all) return null;

    const term = String(search ?? "").trim();
    const filtered = term
      ? all.filter((c) => String(c.chapter_number ?? "").startsWith(term))
      : all;
    const totalPage = Math.max(1, Math.ceil(filtered.length / pageSize));
    const start = (page - 1) * pageSize;

    return {
      retcode: 0,
      message: "success",
      data: filtered.slice(start, start + pageSize),
      meta: {
        page,
        page_size: pageSize,
        total_record: filtered.length,
        total_page: totalPage,
        has_next: page < totalPage,
      },
    };
  },

  /** Chapter pertama (nomor terkecil) dari sebuah komik, atau null. */
  getFirstChapter: async (manhwaId) => {
    if (firstChapterCache.has(manhwaId)) return firstChapterCache.get(manhwaId);
    const result = await fetchData(
      `/chapter/${encodeURIComponent(manhwaId)}/list${qs({
        limit: 1,
        sort_by: "chapter_number",
        sort_order: "asc",
      })}`
    );
    const first = result?.data?.[0] ?? null;
    if (first) firstChapterCache.set(manhwaId, first);
    return first;
  },

  // ---- /chapter/[id] ----
  getChapterDetail: (chapterId) =>
    fetchData(`/chapter/detail/${encodeURIComponent(chapterId)}`),
};

/**
 * Pemetaan `type` browse → fungsi API, sama seperti `_Browse.tsx` di ROUTES.md.
 * Alias lama (new-update, recommendation(s), complete) tetap didukung.
 */
const BROWSE = {
  updates: (p, s) => apiService.getNewUpdate(p, s, "all"),
  popular: apiService.getPopular,
  top: apiService.getTop,
  recommended: apiService.getRecommend,
  completed: apiService.getCompleted,
};
const BROWSE_ALIASES = {
  "new-update": "updates",
  recommendation: "recommended",
  recommendations: "recommended",
  complete: "completed",
};

apiService.getBrowse = (type, page = 1, pageSize = 24) => {
  const fn = BROWSE[BROWSE_ALIASES[type] ?? type];
  return fn ? fn(page, pageSize) : Promise.resolve({ data: [] });
};
