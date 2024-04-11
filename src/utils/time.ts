class TodayStartTimestamp {
  // Method to get the start of today as a Unix timestamp
  static getStartOfToday(): number {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return Math.floor(startOfToday.getTime() / 1000);
  }
}
