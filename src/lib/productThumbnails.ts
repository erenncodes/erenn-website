/**
 * Product Thumbnail Configuration
 * 
 * This file centralizes all product thumbnail logic for consistency across the app.
 * 
 * To add a new category:
 * 1. Import the thumbnail image(s) at the top
 * 2. Add the category to CATEGORY_THUMBNAILS for product cards
 * 3. Add the category to VIDEO_THUMBNAILS for video preview (if applicable)
 * 
 * The system automatically falls back to defaults if a category is not mapped.
 */

import birthdayThumbnail from "@/assets/birthday-thumbnail.png";
import birthdayVideoThumbnail from "@/assets/birthday-video-thumbnail.png";
import proposalVideoThumbnail from "@/assets/proposal-video-thumbnail.png";
import whyILoveHimThumbnail from "@/assets/why-i-love-him-thumbnail.png";
import defaultThumbnail from "@/assets/video-thumbnail.png";
import eidMubarakThumbnail from "@/assets/eid-mubarak-thumbnail.png";

// ============================================
// CATEGORY THUMBNAILS (for product cards)
// ============================================
const CATEGORY_THUMBNAILS: Record<string, string> = {
  "Birthday": birthdayThumbnail,
  "Proposal": proposalVideoThumbnail,
  "proposal": proposalVideoThumbnail,
  "Eid Mubarak": eidMubarakThumbnail,
  "eid mubarak": eidMubarakThumbnail,
  "Romantic": whyILoveHimThumbnail,
  "romantic": whyILoveHimThumbnail,
  "valentines": whyILoveHimThumbnail,
  "Valentines": whyILoveHimThumbnail,
  "Wedding": proposalVideoThumbnail,
  "wedding": proposalVideoThumbnail,
  "Anniversary": birthdayThumbnail,
  "anniversary": birthdayThumbnail,
  "Special Occasion": birthdayThumbnail,
};

// ============================================
// VIDEO THUMBNAILS (for YouTube preview)
// ============================================
const VIDEO_THUMBNAILS: Record<string, string> = {
  "Birthday": birthdayVideoThumbnail,
  "Proposal": proposalVideoThumbnail,
  "proposal": proposalVideoThumbnail,
  "Eid Mubarak": eidMubarakThumbnail,
  "eid mubarak": eidMubarakThumbnail,
  "Romantic": whyILoveHimThumbnail,
  "Wedding": proposalVideoThumbnail,
  "Anniversary": birthdayVideoThumbnail,
};

// ============================================
// YOUTUBE VIDEO LINKS (for product detail page)
// ============================================
export const YOUTUBE_VIDEO_LINKS: Record<string, string> = {
  "Birthday": "https://youtu.be/A3KS00qG6XA?si=8cPMSKvkEIGv1Nor",
  "Proposal": "https://youtu.be/upLNpY9vQQc?si=qs7car4DqW_nPSLn",
  "proposal": "https://youtu.be/upLNpY9vQQc?si=qs7car4DqW_nPSLn",
  "Anniversary": "https://youtu.be/DncEUc2g2lY?si=v6z9COrxzc3_mD7f",
  "anniversary": "https://youtu.be/DncEUc2g2lY?si=v6z9COrxzc3_mD7f",
  "Sorry": "https://youtu.be/IQy7waXS4dI?si=hrQGhd-CUCm20ZEM",
  "sorry": "https://youtu.be/IQy7waXS4dI?si=hrQGhd-CUCm20ZEM",
  "Ramadan": "https://youtu.be/Q53vB6AQbCQ",
  "ramadan": "https://youtu.be/Q53vB6AQbCQ",
  "Eid Mubarak": "https://youtu.be/HzQTv8ve_1A?si=oCq_3h0PWjyU26G7",
  "eid mubarak": "https://youtu.be/HzQTv8ve_1A?si=oCq_3h0PWjyU26G7",
};

// Product-specific YouTube links (keyed by product title for unique videos per product)
export const PRODUCT_YOUTUBE_LINKS: Record<string, string> = {
  "Happy Birthday Madam": "https://youtu.be/M9MweOLxGCU?si=DLDyV76kwYsFa-YL",
  "Happy Anniversary 2.0": "https://www.youtube.com/watch?v=HFiKYQuDTD4",
  "Happy Boyfriend Day": "https://www.youtube.com/watch?v=9Poeuwgcf8A",
  "Happy Girlfriend Day": "https://www.youtube.com/watch?v=B14mC6ediuU",
  "Happy Birthday My Love": "https://youtu.be/dwEfoYIitEM?si=ybyaOeIsEAsseBAc",
  "Happy Birthday Bestie": "https://www.youtube.com/watch?v=0XFlqUlKHD4",
  "Supportive Website For Her": "https://www.youtube.com/watch?v=nDczO6vLb3U",
  "Happy Fathers Day": "https://www.youtube.com/watch?v=U2QO2BAgiG0",
  "Love Proposal 3.0": "https://youtu.be/0PBWPHgVV_c",
  "Eid Mubarak 2.0": "https://www.youtube.com/watch?v=tTbYofcSZwA",
  "Sorry 2.0": "https://youtu.be/3kTBLPuWadc",
  "Best Girlfriend Award": "https://www.youtube.com/watch?v=MPDPdDMsHFM",
  "Best Boyfriend Award": "https://www.youtube.com/watch?v=MPDPdDMsHFM",
  "Love Proposal 2.0": "https://www.youtube.com/watch?v=UeKMN_GuUTE",
  "Importance Website for her": "https://www.youtube.com/watch?v=cCryMVlkn50",
  "Eid Mubarak My Love": "https://youtu.be/HzQTv8ve_1A",
  "Happy Womens Day": "https://youtu.be/UjwOnQLY1Y0",
  "Happy Birthday 2.0": "https://youtu.be/ys7mYnHrHH0",
  "Happy Holi": "https://www.youtube.com/watch?v=P954bIuEk2M",
  "Happy Valentines Day 2.O": "https://www.youtube.com/watch?v=DrBCMioLczY",
  "Happy Birthday Handsome": "https://youtu.be/W-d_IcGe5m4",
  "Happy Valentines": "https://www.youtube.com/watch?v=a4D6SaLRbfk",
  "Why I Love Him Male Version": "https://www.youtube.com/watch?v=Z8Q1YxpPGcw",
  "Sorry Website": "https://youtu.be/IQy7waXS4dI",
  "Happy Anniversary": "https://youtu.be/DncEUc2g2lY",
  "Love Proposal Website": "https://www.youtube.com/watch?v=upLNpY9vQQc",
  "Happy Birthday Cutiepie": "https://youtu.be/A3KS00qG6XA",
  "Why I Love You": "https://www.youtube.com/watch?v=ORaEfGQwV6k",
};

export const getProductYouTubeLink = (productTitle: string | null | undefined, category: string | null | undefined): string => {
  if (productTitle && PRODUCT_YOUTUBE_LINKS[productTitle]) {
    return PRODUCT_YOUTUBE_LINKS[productTitle];
  }
  return getYouTubeLink(category);
};

export const getYouTubeLink = (category: string | null | undefined): string => {
  if (!category) return "https://www.youtube.com/watch?v=ORaEfGQwV6k";
  return YOUTUBE_VIDEO_LINKS[category] || "https://www.youtube.com/watch?v=ORaEfGQwV6k";
};

// ============================================
// DEFAULTS
// ============================================
const DEFAULT_THUMBNAIL = defaultThumbnail;
const DEFAULT_VIDEO_THUMBNAIL = defaultThumbnail;

// ============================================
// PUBLIC API
// ============================================

/**
 * Get the product card thumbnail for a category
 * @param category - The product category (e.g., "Birthday", "Romantic")
 * @returns The thumbnail image path
 */
export const getProductThumbnail = (category: string | null | undefined): string => {
  if (!category) return DEFAULT_THUMBNAIL;
  return CATEGORY_THUMBNAILS[category] || DEFAULT_THUMBNAIL;
};

/**
 * Get the video preview thumbnail for a category
 * @param category - The product category
 * @returns The video thumbnail image path
 */
export const getVideoThumbnail = (category: string | null | undefined): string => {
  if (!category) return DEFAULT_VIDEO_THUMBNAIL;
  return VIDEO_THUMBNAILS[category] || DEFAULT_VIDEO_THUMBNAIL;
};

/**
 * Get all available category thumbnails (for admin/debugging)
 */
export const getAvailableCategories = (): string[] => {
  return [...new Set([
    ...Object.keys(CATEGORY_THUMBNAILS),
    ...Object.keys(VIDEO_THUMBNAILS),
  ])];
};

/**
 * Check if a category has a custom product thumbnail
 */
export const hasCustomThumbnail = (category: string | null | undefined): boolean => {
  if (!category) return false;
  return category in CATEGORY_THUMBNAILS;
};

/**
 * Check if a category has a custom video thumbnail
 */
export const hasCustomVideoThumbnail = (category: string | null | undefined): boolean => {
  if (!category) return false;
  return category in VIDEO_THUMBNAILS;
};

/**
 * Extract YouTube video ID from various URL formats
 * @param url - YouTube URL (youtu.be/ID or youtube.com/watch?v=ID)
 * @returns Video ID or null if invalid
 */
export const extractYouTubeVideoId = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const cleanUrl = url.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  // Handle youtu.be/ID format
  const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Handle youtube.com/watch?v=ID format
  const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // Handle youtube.com/embed/ID, /shorts/ID, /live/ID, /v/ID
  const pathMatch = cleanUrl.match(/youtube\.com\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/);
  if (pathMatch) return pathMatch[1];

  return null;
};
