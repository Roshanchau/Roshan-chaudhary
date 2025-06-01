export const calculateTimeAgo = (inputDate: Date | string, returnDate?: boolean): string => {
  // Convert input to Date object
  const date = new Date(inputDate);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "";
  }

  const now = new Date(); // Current date
  const timeDiff = now.getTime() - date.getTime(); // Difference in milliseconds

  // Calculate differences in various units
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (months > 0 && returnDate) {
    return new Date(inputDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Determine the appropriate time difference
  if (years > 0) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
  }
};