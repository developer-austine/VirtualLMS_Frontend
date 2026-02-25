import { useSystem } from "../context/systemContext";
import schoolOfBusiness from "../assets/school-of-business.png";

/**
 * Returns the correct background image URL.
 * - If admin has uploaded a custom banner → use that
 * - Otherwise → fall back to the default school-of-business.png
 * 
 * Usage in any page:
 *   const bgImage = useBanner();
 *   <div style={{ backgroundImage: `url(${bgImage})` }} />
 */
export const useBanner = (): string => {
  const { settings } = useSystem();
  return settings.bannerImage || schoolOfBusiness;
};