import { useState, useCallback } from "react";
import createContextHook from "@nkzw/create-context-hook";
import { AdEngagement, AdPreferences } from "@/types";

export const [AdEngagementProvider, useAdEngagement] = createContextHook(() => {
  const [engagements, setEngagements] = useState<AdEngagement[]>([]);
  const [preferences, setPreferences] = useState<AdPreferences>({
    userId: "current-user",
    enabledCategories: ["shopping", "fashion", "technology", "food", "entertainment"],
    disabledBrands: [],
    personalizedAds: true,
    dataSharing: true,
  });

  const trackEngagement = useCallback(
    (
      adId: string,
      action: "view" | "click" | "like" | "comment" | "share" | "save" | "hide" | "report",
      metadata?: any
    ) => {
      const engagement: AdEngagement = {
        adId,
        userId: "current-user",
        action,
        timestamp: new Date().toISOString(),
        metadata,
      };

      setEngagements((prev) => [...prev, engagement]);

      console.log(`[Ad Engagement] ${action} on ad ${adId}`, metadata);
    },
    []
  );

  const updatePreferences = useCallback((updates: Partial<AdPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  }, []);

  const disableBrand = useCallback((brandName: string) => {
    setPreferences((prev) => ({
      ...prev,
      disabledBrands: [...prev.disabledBrands, brandName],
    }));
  }, []);

  const enableBrand = useCallback((brandName: string) => {
    setPreferences((prev) => ({
      ...prev,
      disabledBrands: prev.disabledBrands.filter((b) => b !== brandName),
    }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setPreferences((prev) => {
      const isEnabled = prev.enabledCategories.includes(category);
      return {
        ...prev,
        enabledCategories: isEnabled
          ? prev.enabledCategories.filter((c) => c !== category)
          : [...prev.enabledCategories, category],
      };
    });
  }, []);

  const getEngagementStats = useCallback(
    (adId: string) => {
      const adEngagements = engagements.filter((e) => e.adId === adId);
      return {
        views: adEngagements.filter((e) => e.action === "view").length,
        clicks: adEngagements.filter((e) => e.action === "click").length,
        likes: adEngagements.filter((e) => e.action === "like").length,
        comments: adEngagements.filter((e) => e.action === "comment").length,
        shares: adEngagements.filter((e) => e.action === "share").length,
        saves: adEngagements.filter((e) => e.action === "save").length,
        hides: adEngagements.filter((e) => e.action === "hide").length,
        reports: adEngagements.filter((e) => e.action === "report").length,
      };
    },
    [engagements]
  );

  return {
    engagements,
    preferences,
    trackEngagement,
    updatePreferences,
    disableBrand,
    enableBrand,
    toggleCategory,
    getEngagementStats,
  };
});
