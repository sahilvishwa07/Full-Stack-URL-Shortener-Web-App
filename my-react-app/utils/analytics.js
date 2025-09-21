const analytics = {};

export const logClick = (shortcode) => {
  if (!analytics[shortcode]) analytics[shortcode] = 0;
  analytics[shortcode]++;
};

export const getClicks = (shortcode) => analytics[shortcode] || 0;