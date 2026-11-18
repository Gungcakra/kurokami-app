/**
 * Penulis PDF sederhana yang menyisipkan JPEG apa adanya (filter DCTDecode),
 * satu gambar per halaman. Tidak ada proses render ulang, jadi tidak butuh
 * WebView dan pemakaian memorinya hanya sebesar satu gambar.
 *
 * Modul ini sengaja bebas dari dependensi React Native supaya logikanya
 * bisa diuji terpisah.
 */

// Lebar halaman mengikuti A4 pada 72 PPI.
export const PAGE_WIDTH = 595;

// Batas ukuran halaman menurut spesifikasi PDF (200 inci).
const MAX_PAGE_SIDE = 14400;

const COLOR_SPACE_BY_COMPONENTS = {
  1: "DeviceGray",
  3: "DeviceRGB",
  4: "DeviceCMYK",
};

// Data gambar ditulis bertahap supaya tidak ada satu panggilan tulis
// berukuran megabyte yang berisiko terpotong.
const WRITE_CHUNK_SIZE = 256 * 1024;

const toBytes = (text) => {
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) {
    bytes[i] = text.charCodeAt(i) & 0xff;
  }
  return bytes;
};

/**
 * Memastikan data JPEG utuh: diawali penanda SOI dan diakhiri EOI.
 * File yang terpotong akan tampil sebagai gambar rusak di pembaca PDF,
 * jadi lebih baik ketahuan di sini.
 */
export const isCompleteJpeg = (bytes) => {
  if (!bytes || bytes.length < 4) return false;
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return false;

  // Sebagian encoder menyisakan byte padding setelah EOI.
  const from = Math.max(2, bytes.length - 32);
  for (let i = bytes.length - 2; i >= from; i--) {
    if (bytes[i] === 0xff && bytes[i + 1] === 0xd9) return true;
  }

  return false;
};

const round2 = (value) => Math.round(value * 100) / 100;

/**
 * Membaca dimensi, jumlah komponen warna, dan jenis encoding dari JPEG.
 */
export const readJpegInfo = (bytes) => {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;

  let offset = 2;
  while (offset < bytes.length - 1) {
    if (bytes[offset] !== 0xff) {
      offset++;
      continue;
    }

    const marker = bytes[offset + 1];

    // Marker tanpa payload.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }

    // Start of Frame: di sinilah ukuran gambar disimpan.
    const isFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;

    if (isFrame) {
      return {
        height: (bytes[offset + 5] << 8) | bytes[offset + 6],
        width: (bytes[offset + 7] << 8) | bytes[offset + 8],
        components: bytes[offset + 9],
        progressive: marker === 0xc2 || marker === 0xca,
      };
    }

    offset += 2 + ((bytes[offset + 2] << 8) | bytes[offset + 3]);
  }

  return null;
};

/**
 * Ukuran halaman disamakan lebarnya, tingginya mengikuti rasio gambar.
 * Gambar strip yang sangat panjang dikecilkan agar tidak melewati batas PDF.
 */
export const fitPageSize = (width, height) => {
  let pageWidth = PAGE_WIDTH;
  let pageHeight = (PAGE_WIDTH * height) / width;

  if (pageHeight > MAX_PAGE_SIDE) {
    pageWidth = (pageWidth * MAX_PAGE_SIDE) / pageHeight;
    pageHeight = MAX_PAGE_SIDE;
  }

  return { pageWidth: round2(pageWidth), pageHeight: round2(pageHeight) };
};

/**
 * Menulis dokumen PDF melalui callback `write`.
 *
 * @param write        fungsi sinkron penerima Uint8Array
 * @param images       daftar sumber gambar
 * @param readBytes    async (image) => Uint8Array berisi data JPEG
 * @param onImageWritten dipanggil setiap satu gambar selesai ditulis
 */
export const writeJpegPdfDocument = async ({
  write,
  images,
  readBytes,
  onImageWritten,
  tell,
}) => {
  if (!images || images.length === 0) {
    throw new Error("Tidak ada gambar untuk ditulis ke PDF");
  }

  let offset = 0;
  const objectOffsets = [];

  /**
   * Posisi byte diambil langsung dari file bila `tell` tersedia. Tabel xref
   * menunjuk ke posisi absolut, jadi satu penulisan yang tidak utuh akan
   * merusak semua objek sesudahnya, dan itu harus ketahuan sekarang juga.
   */
  const put = (data) => {
    const bytes = typeof data === "string" ? toBytes(data) : data;

    for (let start = 0; start < bytes.length; start += WRITE_CHUNK_SIZE) {
      write(bytes.subarray(start, Math.min(start + WRITE_CHUNK_SIZE, bytes.length)));
    }

    const expected = offset + bytes.length;

    if (tell) {
      const actual = tell();
      if (typeof actual === "number" && actual !== expected) {
        throw new Error(
          `Penulisan PDF tidak utuh: ${actual} byte tertulis, seharusnya ${expected}`
        );
      }
    }

    offset = expected;
  };

  const beginObject = (id) => {
    objectOffsets[id] = offset;
    put(`${id} 0 obj\n`);
  };

  // Header. Baris komentar biner menandai file ini bukan teks murni.
  put("%PDF-1.4\n");
  put(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  const pageIds = images.map((_, index) => 3 + index * 3);

  beginObject(1);
  put("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  beginObject(2);
  put(
    `<< /Type /Pages /Kids [${pageIds
      .map((id) => `${id} 0 R`)
      .join(" ")}] /Count ${images.length} >>\nendobj\n`
  );

  let written = 0;

  for (let index = 0; index < images.length; index++) {
    const image = images[index];
    const bytes = await readBytes(image);

    if (!isCompleteJpeg(bytes)) {
      throw new Error(`Data gambar halaman ${index + 1} tidak lengkap`);
    }

    const info = readJpegInfo(bytes);

    if (!info) {
      throw new Error(`Gambar halaman ${index + 1} bukan JPEG yang valid`);
    }

    const { pageWidth, pageHeight } = fitPageSize(info.width, info.height);
    const colorSpace =
      COLOR_SPACE_BY_COMPONENTS[info.components] || "DeviceRGB";

    const pageId = pageIds[index];
    const contentId = pageId + 1;
    const imageId = pageId + 2;

    const content = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im0 Do\nQ\n`;

    beginObject(pageId);
    put(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}]` +
        ` /Resources << /XObject << /Im0 ${imageId} 0 R >> >>` +
        ` /Contents ${contentId} 0 R >>\nendobj\n`
    );

    beginObject(contentId);
    put(`<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);

    beginObject(imageId);
    put(
      `<< /Type /XObject /Subtype /Image /Width ${info.width}` +
        ` /Height ${info.height} /ColorSpace /${colorSpace}` +
        ` /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n`
    );
    put(bytes);
    put("\nendstream\nendobj\n");

    written++;
    onImageWritten?.(written, images.length);
  }

  // Tabel xref: setiap baris wajib tepat 20 byte.
  const totalObjects = 3 + images.length * 3;
  const xrefOffset = offset;

  put(`xref\n0 ${totalObjects}\n`);
  put("0000000000 65535 f \n");

  for (let id = 1; id < totalObjects; id++) {
    put(`${String(objectOffsets[id]).padStart(10, "0")} 00000 n \n`);
  }

  put(
    `trailer\n<< /Size ${totalObjects} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  );

  return { bytesWritten: offset, pages: images.length };
};
