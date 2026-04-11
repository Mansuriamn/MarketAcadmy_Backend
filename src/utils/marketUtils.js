export const formatMarketHeadline = (title) => {
  const lowerTitle = title.toLowerCase();

  const UP_KEYWORDS = ["rise", "gain", "surge", "up"];
  const DOWN_KEYWORDS = ["fall", "down", "crash", "decline"];

  let tag = "⚖️ Market Mixed";

  if (UP_KEYWORDS.some(word => lowerTitle.includes(word))) {
    tag = "📈 Market Up";
  }

  if (DOWN_KEYWORDS.some(word => lowerTitle.includes(word))) {
    tag = "📉 Market Down";
  }

  return `${tag}: ${title}`;
};