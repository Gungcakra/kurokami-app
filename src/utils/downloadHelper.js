import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory, File, Paths } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as Sharing from "expo-sharing";

import { apiService } from "../services/api";
import { isCompleteJpeg, writeJpegPdfDocument } from "./pdf/jpegPdf";

export const DOWNLOAD_KEY = "@downloaded_chapters";

const DOWNLOAD_FOLDER = "chapters";
const TEMP_FOLDER = "chapter-tmp";

// Gambar dari API berformat JPEG progresif, sementara filter DCTDecode di PDF
// hanya bisa diandalkan untuk JPEG baseline. Setiap gambar karena itu
// di-encode ulang dulu lewat image manipulator.
const JPEG_QUALITY = 0.85;

// Berapa kali satu halaman dicoba ulang sebelum unduhan dianggap gagal.
const PAGE_RETRY_LIMIT = 3;

/**
 * base_url dan path dari API kadang sudah membawa slash di ujungnya,
 * jadi gabungkan dengan rapi supaya tidak jadi "//".
 */
const joinUrl = (...parts) =>
  parts
    .filter(Boolean)
    .map((part, index) =>
      index === 0
        ? String(part).replace(/\/+$/, "")
        : String(part).replace(/^\/+|\/+$/g, "")
    )
    .filter((part) => part.length > 0)
    .join("/");

const safeName = (value, fallback) => {
  const cleaned = String(value ?? "")
    .replace(/[^a-zA-Z0-9-_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  return cleaned || fallback;
};

export const createCancelError = () =>
  Object.assign(new Error("Unduhan dibatalkan"), { cancelled: true });

export const formatBytes = (bytes) => {
  const value = Number(bytes) || 0;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(0)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

const getDownloadDir = () => {
  const dir = new Directory(Paths.document, DOWNLOAD_FOLDER);
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  return dir;
};

export const getDownloads = async () => {
  try {
    const raw = await AsyncStorage.getItem(DOWNLOAD_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.error("Download Error:", e);
    return [];
  }
};

const persistDownloads = async (list) => {
  await AsyncStorage.setItem(DOWNLOAD_KEY, JSON.stringify(list));
  return list;
};

/**
 * Ambil satu gambar chapter lalu ubah jadi JPEG baseline yang siap
 * disisipkan ke PDF. File sementara langsung dibuang supaya penyimpanan
 * dan memori hanya terpakai untuk satu gambar dalam satu waktu.
 */
const fetchPageBytesOnce = async ({ url, index, tempDir }) => {
  const source = new File(tempDir, `${String(index).padStart(3, "0")}.jpg`);
  let encodedUri = null;

  try {
    if (source.exists) source.delete();
    await File.downloadFileAsync(url, source, { idempotent: true });

    const rendered = await ImageManipulator.manipulate(source.uri).renderAsync();
    const encoded = await rendered.saveAsync({
      format: SaveFormat.JPEG,
      compress: JPEG_QUALITY,
    });

    encodedUri = encoded.uri;

    const bytes = await new File(encoded.uri).bytes();

    if (!isCompleteJpeg(bytes)) {
      throw new Error(`Gambar halaman ${index + 1} terunduh tidak lengkap`);
    }

    return bytes;
  } finally {
    for (const uri of [source.uri, encodedUri]) {
      if (!uri) continue;
      try {
        const file = new File(uri);
        if (file.exists) file.delete();
      } catch (e) {
        console.error("Download Error:", e);
      }
    }
  }
};

/**
 * Satu gambar gagal tidak boleh membatalkan seluruh chapter, jadi proses
 * unduh dan encode diulang beberapa kali sebelum menyerah.
 */
const fetchPageBytes = async (params) => {
  let lastError = null;

  for (let attempt = 1; attempt <= PAGE_RETRY_LIMIT; attempt++) {
    try {
      return await fetchPageBytesOnce(params);
    } catch (error) {
      lastError = error;
      console.error(
        `Download Error: halaman ${params.index + 1} percobaan ${attempt}`,
        error
      );
    }
  }

  throw lastError;
};

/**
 * Unduh seluruh gambar sebuah chapter lalu gabungkan menjadi satu file PDF
 * di penyimpanan internal aplikasi.
 *
 * @returns metadata chapter yang tersimpan
 */
export const downloadChapterAsPdf = async ({
  chapter,
  manhwaTitle,
  onProgress = () => {},
  shouldCancel = () => false,
}) => {
  const chapterId = chapter?.chapter_id;
  if (!chapterId) throw new Error("Chapter tidak valid");

  onProgress({ phase: "prepare", progress: 0.05, totalPages: 0 });

  const result = await apiService.getChapterDetail(chapterId);
  const detail = result?.data;
  const images = detail?.chapter?.data || [];

  if (!detail) throw new Error("Gagal mengambil detail chapter");
  if (images.length === 0) throw new Error("Gambar chapter tidak ditemukan");
  if (shouldCancel()) throw createCancelError();

  // URL disusun persis seperti di layar baca: base_url + path + nama file.
  const imageUrls = images.map((name) =>
    joinUrl(detail.base_url, detail.chapter?.path, name)
  );

  const fileName = `${safeName(manhwaTitle, "kurokami")}-ch${safeName(
    chapter.chapter_number,
    "0"
  )}-${chapterId.slice(0, 8)}.pdf`;

  const tempDir = new Directory(
    Paths.cache,
    TEMP_FOLDER,
    safeName(chapterId, "chapter")
  );

  if (tempDir.exists) tempDir.delete();
  tempDir.create({ intermediates: true, idempotent: true });

  const destination = new File(getDownloadDir(), fileName);
  if (destination.exists) destination.delete();
  destination.create();

  const handle = destination.open();
  let failed = false;
  let written = null;

  try {
    written = await writeJpegPdfDocument({
      write: (bytes) => handle.writeBytes(bytes),
      tell: () => handle.offset,
      images: imageUrls.map((url, index) => ({ url, index })),
      readBytes: async (image) => {
        if (shouldCancel()) throw createCancelError();
        return fetchPageBytes({ ...image, tempDir });
      },
      onImageWritten: (written, total) =>
        onProgress({
          phase: "download",
          progress: 0.05 + (written / total) * 0.9,
          page: written,
          totalPages: total,
        }),
    });
  } catch (error) {
    failed = true;
    throw error;
  } finally {
    // Handle wajib ditutup sebelum file dihapus atau dibaca ukurannya.
    try {
      handle.close();
    } catch (e) {
      console.error("Download Error:", e);
    }

    try {
      if (tempDir.exists) tempDir.delete();
      if (failed && destination.exists) destination.delete();
    } catch (e) {
      console.error("Download Error:", e);
    }
  }

  onProgress({ phase: "save", progress: 0.97, totalPages: images.length });

  if (!destination.exists || destination.size <= 0) {
    throw new Error("File PDF gagal dibuat");
  }

  // Ukuran file harus sama persis dengan yang ditulis. Kalau meleset,
  // posisi objek di tabel xref ikut meleset dan gambar akan tampil rusak.
  if (written && destination.size !== written.bytesWritten) {
    try {
      destination.delete();
    } catch (e) {
      console.error("Download Error:", e);
    }
    throw new Error(
      `File PDF tidak utuh (${destination.size} dari ${written.bytesWritten} byte)`
    );
  }

  const meta = {
    id: chapterId,
    chapterId,
    mangaId: chapter.manga_id || detail.manga_id || null,
    manhwaTitle: manhwaTitle || "Tanpa Judul",
    chapterNumber: chapter.chapter_number ?? detail.chapter_number ?? null,
    thumbnail: chapter.thumbnail_image_url || detail.thumbnail_image_url || null,
    fileUri: destination.uri,
    fileName,
    pages: images.length,
    size: destination.size || 0,
    downloadedAt: new Date().toISOString(),
  };

  const list = await getDownloads();
  await persistDownloads([
    meta,
    ...list.filter((item) => item.chapterId !== chapterId),
  ]);

  onProgress({ phase: "done", progress: 1, totalPages: images.length });

  return meta;
};

export const removeDownload = async (chapterId) => {
  const list = await getDownloads();
  const target = list.find((item) => item.chapterId === chapterId);

  if (target?.fileUri) {
    try {
      const file = new File(target.fileUri);
      if (file.exists) file.delete();
    } catch (e) {
      console.error("Download Error:", e);
    }
  }

  return persistDownloads(list.filter((item) => item.chapterId !== chapterId));
};

export const clearAllDownloads = async () => {
  try {
    const dir = new Directory(Paths.document, DOWNLOAD_FOLDER);
    if (dir.exists) dir.delete();
  } catch (e) {
    console.error("Download Error:", e);
  }

  return persistDownloads([]);
};

/**
 * Buang metadata yang file PDF-nya sudah tidak ada (misal dihapus manual
 * atau hilang setelah aplikasi dipasang ulang).
 */
export const syncDownloads = async () => {
  const list = await getDownloads();
  const alive = list.filter((item) => {
    try {
      return item?.fileUri ? new File(item.fileUri).exists : false;
    } catch (e) {
      return false;
    }
  });

  if (alive.length !== list.length) await persistDownloads(alive);
  return alive;
};

export const openDownloadedChapter = async (item) => {
  if (!item?.fileUri) throw new Error("File tidak ditemukan");

  const file = new File(item.fileUri);
  if (!file.exists) throw new Error("File PDF sudah tidak ada di perangkat");

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Perangkat tidak mendukung membuka file");
  }

  await Sharing.shareAsync(item.fileUri, {
    mimeType: "application/pdf",
    UTI: "com.adobe.pdf",
    dialogTitle: `${item.manhwaTitle} Chapter ${item.chapterNumber}`,
  });
};
