import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Returns whether the next download requires watching Ad 6 based on current daily count:
 * Count 0-4 (1st to 5th download) -> FREE (false)
 * Count 5 (6th download) -> REQUIRES AD 6 (true)
 * Count 6 (7th download) -> FREE (false)
 * Count 7 (8th download) -> REQUIRES AD 6 (true)
 * Count 8 (9th download) -> FREE (false)
 * Count 9 (10th download) -> REQUIRES AD 6 (true)
 * Count 10 (11th download) -> FREE (false)
 * Count 11 (12th download) -> REQUIRES AD 6 (true)
 * Count 12 (13th download) -> FREE (false)
 * Count 13 (14th download) -> REQUIRES AD 6 (true)
 */
export function isRewardedDownloadRequired(todayDownloadCount: number): boolean {
  if (todayDownloadCount < 5) {
    return false;
  }
  // If count is 5, 7, 9, 11, 13... next download is 6, 8, 10, 12, 14 (which requires Ad 6)
  return todayDownloadCount % 2 === 1;
}

/**
 * Fetches the total number of downloads performed by the user today (from 00:00:00 local time).
 */
export async function getUserTodayDownloadCount(userId: string): Promise<number> {
  if (!userId) return 0;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfTodayTimestamp = Timestamp.fromDate(today);

    const downloadsRef = collection(db, 'downloads');
    const q = query(
      downloadsRef,
      where('userId', '==', userId),
      where('downloadedAt', '>=', startOfTodayTimestamp)
    );

    const snap = await getDocs(q);
    return snap.size;
  } catch (error) {
    console.warn("Could not query daily downloads by timestamp query, fallback to user total count:", error);
    try {
      const downloadsRef = collection(db, 'downloads');
      const qUser = query(downloadsRef, where('userId', '==', userId));
      const snap = await getDocs(qUser);
      
      const todayDateStr = new Date().toDateString();
      let todayCount = 0;
      snap.forEach(doc => {
        const data = doc.data();
        if (data.downloadedAt) {
          const dDate = data.downloadedAt.toDate ? data.downloadedAt.toDate() : new Date(data.downloadedAt);
          if (dDate.toDateString() === todayDateStr) {
            todayCount++;
          }
        }
      });
      return todayCount;
    } catch (e) {
      console.error("Failed to calculate today downloads:", e);
      return 0;
    }
  }
}
