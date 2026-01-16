import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToStorage = async ({ chapter, manhwaTitle }) => {
  try {
    const savedRead = await AsyncStorage.getItem("@read_chapters");
    let currentRead = savedRead ? JSON.parse(savedRead) : [];
    
    const historyItem = {
      id: Date.now().toString(),
      chapterId: chapter.chapter_id,
      number: chapter.chapter_number,
      lastChapter: chapter.chapter_number,
      image: chapter.thumbnail_image_url,
      timestamp: new Date().toISOString(),
      manhwaTitle: manhwaTitle,
    };

    const filteredRead = currentRead.filter((item) =>
      typeof item === "string"
        ? item !== chapter.chapter_id
        : item.chapterId !== chapter.chapter_id
    );

    const updatedHistory = [historyItem, ...filteredRead].slice(0, 50);

    await AsyncStorage.setItem(
      "@read_chapters",
      JSON.stringify(updatedHistory)
    );

    return updatedHistory;
  } catch (e) {
    console.error("Helper Error:", e);
    return null;
  }
};

export const getReadChapters = async () => {
  try {
    const savedRead = await AsyncStorage.getItem("@read_chapters");
    return savedRead ? JSON.parse(savedRead) : [];
  } catch (e) {
    console.error("Helper Error:", e);
    return [];
  }
};

export const clearReadChapters = async () => {
  try {
    await AsyncStorage.removeItem("@read_chapters");
  } catch (e) {
    console.error("Helper Error:", e);
  }
};
