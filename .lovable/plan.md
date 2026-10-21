

## Remove Valentine's Branding and Replace with Normal Discount Banners

This plan covers all files where Valentine's-specific language, emojis, and pink/red gradients need to be replaced with clean, generic discount branding.

### Files to Update

**1. `src/components/Hero.tsx`**
- Replace Valentine's badge ("Valentine's Special -- 60% OFF") with a generic sale badge ("Limited Time -- 60% OFF All Templates!")
- Remove heart emoji and Valentine's copy from subheadline; replace with general occasion copy
- Change carousel container from rose/pink gradient to primary/accent gradient
- Replace heart icon next to product title with Sparkles icon
- Change CTA button from pink/red Valentine's gradient to primary gradient, text from "Shop Valentine's Sale" to "See All Templates"
- Remove `Heart` import, keep other icons

**2. `src/components/FeaturedProducts.tsx`**
- Change section badge from "VALENTINE'S SPECIAL" to "SPECIAL OFFER"
- Update heading from "Love Products" to "Our Products"
- Remove romantic copy from description
- Replace Valentine sale badge on cards (pink/red gradient with heart emoji) with a generic sale badge
- Replace "SAVE" badge from pink/red gradient to primary-colored

**3. `src/components/LatestTemplates.tsx`**
- Replace Valentine's Sale Banner gradient and copy with a generic "SALE" banner (use primary colors instead of pink/red)
- Update header badge from "VALENTINE'S SPECIAL" to "SPECIAL OFFER"
- Change heading from "Valentine's Day Love Templates" to just "Latest Templates"
- Update description to be occasion-neutral
- Replace Valentine ribbon on product cards with generic discount ribbon
- Update the negative hook CTA section -- remove Valentine's-specific copy, replace with a general urgency CTA
- Change pink/red gradients to primary/accent colors throughout

**4. `src/pages/Products.tsx`**
- Replace Valentine's Sale Banner (pink/red gradient) with a generic discount banner using primary colors
- Update hero section badge from "VALENTINE'S SPECIAL" to "SPECIAL OFFER"
- Change "Valentine's Price" label to just "Sale Price"
- Replace pink/red "SAVE" badges on product cards with primary-colored badges
- Remove heart emojis and Valentine's copy from the price highlight box
- Update background glow from pink to primary

**5. `src/pages/ProductDetail.tsx`**
- Change sale badge from pink gradient to primary/destructive colors (already partially generic)
- No major Valentine's branding here, but remove any remaining heart emojis from pricing area

**6. `src/components/FAQ.tsx`**
- Remove heart emoji from the FAQ subtitle ("💕" at the end)
- Minor cleanup only -- FAQ content is already mostly generic

**7. `src/data/siteConfig.ts`**
- No changes needed -- discount config is already generic (just numbers)

### Design Approach
- Replace all `from-pink-500 to-red-500` gradients with `from-primary to-accent` or `from-primary via-accent to-primary`
- Replace heart emojis (💕 💝 💔) with generic ones (🔥 ✨ ⚡)
- Keep the same 60% discount percentage and pricing structure
- Maintain the same layout and animation patterns -- only changing colors and copy

### Technical Details
- Approximately 6 files will be edited
- No new dependencies or database changes needed
- No structural/layout changes -- purely cosmetic and copy updates
