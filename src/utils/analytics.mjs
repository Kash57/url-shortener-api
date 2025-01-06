import { Url } from '../models/urlModel.mjs';

export const generateShortAlias = () => {
  return Math.random().toString(36).substr(2, 8);
};

export const getAnalytics = async (alias) => {
  const url = await Url.findOne({ shortAlias: alias });
  if (!url) {
    throw new Error('URL not found');
  }

  // Dynamically calculate total clicks
  const totalClicks = url.analytics.clicksByDate.reduce((acc, entry) => acc + entry.count, 0);

  // Get total unique users
  const uniqueUsersCount = url.analytics.uniqueUsers.length;

  // Calculate recent activity by date
  const recentActivity = url.analytics.clicksByDate.slice(-7).map((entry) => ({
    date: entry.date,
    count: entry.count,
  }));

  // Identify the most active day
  const mostActiveDay = url.analytics.clicksByDate.reduce(
    (max, entry) => (entry.count > max.count ? entry : max),
    { date: null, count: 0 }
  );

  // Calculate percentage growth in clicks over the last 2 days
  const lastTwoDays = url.analytics.clicksByDate.slice(-2);
  let percentageGrowth = 0;
  if (lastTwoDays.length === 2) {
    const [dayBeforeYesterday, yesterday] = lastTwoDays;
    if (dayBeforeYesterday.count > 0) {
      percentageGrowth =
        ((yesterday.count - dayBeforeYesterday.count) / dayBeforeYesterday.count) * 100;
    }
  }

  // Prepare analytics report
  return {
    totalClicks,
    uniqueUsersCount,
    recentActivity,
    mostActiveDay,
    percentageGrowth: percentageGrowth.toFixed(2),
  };
};


export const getTopicAnalytics = async (topic) => {
  const urls = await Url.find({ topic });

  if (!urls.length) {
    throw new Error('No URLs found for the specified topic.');
  }

  const totalClicks = urls.reduce((acc, url) => acc + url.analytics.totalClicks, 0);
  const uniqueUsers = new Set(urls.flatMap((url) => url.analytics.uniqueUsers)).size;

  const clicksByDate = urls
    .flatMap((url) => url.analytics.clicksByDate)
    .reduce((acc, entry) => {
      const existing = acc.find((item) => item.date === entry.date);
      if (existing) {
        existing.count += entry.count;
      } else {
        acc.push({ date: entry.date, count: entry.count });
      }
      return acc;
    }, []);

  const urlsData = urls.map((url) => ({
    shortUrl: url.shortAlias,
    totalClicks: url.analytics.totalClicks,
    uniqueUsers: url.analytics.uniqueUsers.length,
  }));

  return { totalClicks, uniqueUsers, clicksByDate, urls: urlsData };
};

export const getOverallAnalytics = async (shortAlias) => {
  const urls = await Url.find({ shortAlias });

  if (!urls.length) {
    throw new Error('No URLs found for the authenticated user.');
  }

  const totalUrls = urls.length;
  const totalClicks = urls.reduce((acc, url) => acc + url.analytics.totalClicks, 0);
  const uniqueUsers = new Set(urls.flatMap((url) => url.analytics.uniqueUsers)).size;

  const clicksByDate = urls
    .flatMap((url) => url.analytics.clicksByDate)
    .reduce((acc, entry) => {
      const existing = acc.find((item) => item.date === entry.date);
      if (existing) {
        existing.count += entry.count;
      } else {
        acc.push({ date: entry.date, count: entry.count });
      }
      return acc;
    }, []);

  const osType = urls
    .flatMap((url) => url.analytics.osType)
    .reduce((acc, entry) => {
      const existing = acc.find((item) => item.osName === entry.osName);
      if (existing) {
        existing.uniqueClicks += entry.uniqueClicks;
        existing.uniqueUsers = [...new Set([...existing.uniqueUsers, ...entry.uniqueUsers])];
      } else {
        acc.push({ osName: entry.osName, uniqueClicks: entry.uniqueClicks, uniqueUsers: entry.uniqueUsers });
      }
      return acc;
    }, []);

  const deviceType = urls
    .flatMap((url) => url.analytics.deviceType)
    .reduce((acc, entry) => {
      const existing = acc.find((item) => item.deviceName === entry.deviceName);
      if (existing) {
        existing.uniqueClicks += entry.uniqueClicks;
        existing.uniqueUsers = [...new Set([...existing.uniqueUsers, ...entry.uniqueUsers])];
      } else {
        acc.push({
          deviceName: entry.deviceName,
          uniqueClicks: entry.uniqueClicks,
          uniqueUsers: entry.uniqueUsers,
        });
      }
      return acc;
    }, []);

  return {
    totalUrls,
    totalClicks,
    uniqueUsers,
    clicksByDate,
    osType: osType.map((item) => ({
      osName: item.osName,
      uniqueClicks: item.uniqueClicks,
      uniqueUsers: item.uniqueUsers.length,
    })),
    deviceType: deviceType.map((item) => ({
      deviceName: item.deviceName,
      uniqueClicks: item.uniqueClicks,
      uniqueUsers: item.uniqueUsers.length,
    })),
  };
};
