import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Linking,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  MapPin,
} from "lucide-react-native";
import { SponsoredAd } from "@/types";
import { useAdEngagement } from "@/hooks/ad-engagement-store";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SponsoredPostProps {
  ad: SponsoredAd;
}

export default function SponsoredPost({ ad }: SponsoredPostProps) {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState<number>(0);
  const [selectedPollOption, setSelectedPollOption] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const videoRef = useRef<Video>(null);
  const { trackEngagement } = useAdEngagement();

  const handleCTAPress = async () => {
    trackEngagement(ad.id, "click");
    if (ad.ctaUrl) {
      await Linking.openURL(ad.ctaUrl);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    trackEngagement(ad.id, isLiked ? "view" : "like");
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    trackEngagement(ad.id, isSaved ? "view" : "save");
  };

  const handleShare = () => {
    trackEngagement(ad.id, "share");
  };

  const handleComment = () => {
    trackEngagement(ad.id, "comment");
  };

  const handleHideAd = () => {
    trackEngagement(ad.id, "hide");
    setShowMenu(false);
  };

  const handleReportAd = () => {
    trackEngagement(ad.id, "report");
    setShowMenu(false);
  };

  const handleCarouselNext = () => {
    if (ad.carouselItems && currentCarouselIndex < ad.carouselItems.length - 1) {
      setCurrentCarouselIndex(currentCarouselIndex + 1);
    }
  };

  const handleCarouselPrev = () => {
    if (currentCarouselIndex > 0) {
      setCurrentCarouselIndex(currentCarouselIndex - 1);
    }
  };

  const handlePollSelect = (option: string) => {
    setSelectedPollOption(option);
    trackEngagement(ad.id, "click", { pollOption: option });
  };

  const renderMedia = () => {
    switch (ad.type) {
      case "image":
        return ad.mediaUrl ? (
          <Image
            source={{ uri: ad.mediaUrl }}
            style={styles.media}
            resizeMode="cover"
          />
        ) : null;

      case "video":
        return ad.mediaUrl ? (
          <Video
            ref={videoRef}
            source={{ uri: ad.mediaUrl }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            isLooping
            useNativeControls
          />
        ) : null;

      case "carousel":
        return (
          <View style={styles.carouselContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
            >
              {ad.carouselItems?.map((item, index) => (
                <View key={index} style={styles.carouselItem}>
                  {index === currentCarouselIndex && (
                    <Image
                      source={{ uri: item.mediaUrl }}
                      style={styles.media}
                      resizeMode="cover"
                    />
                  )}
                </View>
              ))}
            </ScrollView>

            {currentCarouselIndex > 0 && (
              <TouchableOpacity
                style={[styles.carouselButton, styles.carouselButtonLeft]}
                onPress={handleCarouselPrev}
              >
                <ChevronLeft size={24} color="#fff" />
              </TouchableOpacity>
            )}

            {ad.carouselItems && currentCarouselIndex < ad.carouselItems.length - 1 && (
              <TouchableOpacity
                style={[styles.carouselButton, styles.carouselButtonRight]}
                onPress={handleCarouselNext}
              >
                <ChevronRight size={24} color="#fff" />
              </TouchableOpacity>
            )}

            <View style={styles.carouselIndicators}>
              {ad.carouselItems?.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.carouselDot,
                    index === currentCarouselIndex && styles.carouselDotActive,
                  ]}
                />
              ))}
            </View>

            {ad.carouselItems && ad.carouselItems[currentCarouselIndex] && (
              <View style={styles.carouselCaption}>
                <Text style={styles.carouselCaptionText}>
                  {ad.carouselItems[currentCarouselIndex].caption}
                </Text>
              </View>
            )}
          </View>
        );

      case "interactive":
        return (
          <View style={styles.interactiveContainer}>
            {ad.mediaUrl && (
              <Image
                source={{ uri: ad.mediaUrl }}
                style={styles.media}
                resizeMode="cover"
              />
            )}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.interactiveOverlay}
            >
              <Text style={styles.interactiveTitle}>{ad.headline}</Text>
              <View style={styles.pollOptions}>
                {ad.interactiveOptions?.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pollOption,
                      selectedPollOption === option && styles.pollOptionSelected,
                    ]}
                    onPress={() => handlePollSelect(option)}
                  >
                    <Text
                      style={[
                        styles.pollOptionText,
                        selectedPollOption === option && styles.pollOptionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: ad.brandAvatar }} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <View style={styles.brandNameRow}>
              <Text style={styles.brandName}>{ad.brandName}</Text>
              {ad.isVerified && <VerifiedBadge size={16} />}
            </View>
            <View style={styles.sponsoredRow}>
              <Text style={styles.sponsoredLabel}>Sponsored</Text>
              {ad.geoTargeted && (
                <>
                  <Text style={styles.sponsoredDot}>•</Text>
                  <MapPin size={12} color="#888" />
                  <Text style={styles.locationText}>{ad.location?.city}</Text>
                </>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <MoreVertical size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={handleHideAd}>
            <Eye size={18} color="#fff" />
            <Text style={styles.menuText}>Hide this ad</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleReportAd}>
            <MoreVertical size={18} color="#fff" />
            <Text style={styles.menuText}>Report ad</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderMedia()}

      <View style={styles.content}>
        <View style={styles.actions}>
          <View style={styles.actionsLeft}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Heart
                size={24}
                color={isLiked ? "#ff3b5c" : "#fff"}
                fill={isLiked ? "#ff3b5c" : "none"}
              />
              <Text style={styles.actionText}>
                {(ad.engagement.likes + (isLiked ? 1 : 0)).toLocaleString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
              <MessageCircle size={24} color="#fff" />
              <Text style={styles.actionText}>
                {ad.engagement.comments.toLocaleString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share2 size={24} color="#fff" />
              <Text style={styles.actionText}>
                {ad.engagement.shares.toLocaleString()}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleSave}>
            <Bookmark
              size={24}
              color={isSaved ? "#ffd700" : "#fff"}
              fill={isSaved ? "#ffd700" : "none"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.textContent}>
          <Text style={styles.headline}>{ad.headline}</Text>
          <Text style={styles.description}>{ad.description}</Text>

          {ad.pricing && (
            <View style={styles.pricingContainer}>
              {ad.pricing.originalPrice && (
                <Text style={styles.originalPrice}>{ad.pricing.originalPrice}</Text>
              )}
              {ad.pricing.discountedPrice && (
                <Text style={styles.discountedPrice}>
                  {ad.pricing.discountedPrice}
                </Text>
              )}
              {ad.pricing.discount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{ad.pricing.discount}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={handleCTAPress}>
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>{ad.ctaText}</Text>
            <ExternalLink size={18} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  brandNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  brandName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600" as const,
  },
  sponsoredRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  sponsoredLabel: {
    color: "#888",
    fontSize: 13,
  },
  sponsoredDot: {
    color: "#888",
    fontSize: 13,
  },
  locationText: {
    color: "#888",
    fontSize: 12,
  },
  menu: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    padding: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  menuText: {
    color: "#fff",
    fontSize: 14,
  },
  media: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    backgroundColor: "#1a1a1a",
  },
  carouselContainer: {
    position: "relative",
  },
  carouselItem: {
    width: SCREEN_WIDTH,
  },
  carouselButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  carouselButtonLeft: {
    left: 12,
  },
  carouselButtonRight: {
    right: 12,
  },
  carouselIndicators: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  carouselDotActive: {
    backgroundColor: "#fff",
    width: 20,
  },
  carouselCaption: {
    position: "absolute",
    bottom: 40,
    left: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 8,
  },
  carouselCaptionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  interactiveContainer: {
    position: "relative",
  },
  interactiveOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  interactiveTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700" as const,
    marginBottom: 16,
  },
  pollOptions: {
    gap: 10,
  },
  pollOption: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  pollOptionSelected: {
    backgroundColor: "rgba(102,126,234,0.3)",
    borderColor: "#667eea",
  },
  pollOptionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500" as const,
    textAlign: "center",
  },
  pollOptionTextSelected: {
    fontWeight: "700" as const,
  },
  content: {
    padding: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  actionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600" as const,
  },
  textContent: {
    marginBottom: 12,
  },
  headline: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  description: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
  pricingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  originalPrice: {
    color: "#888",
    fontSize: 14,
    textDecorationLine: "line-through",
  },
  discountedPrice: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700" as const,
  },
  discountBadge: {
    backgroundColor: "#ff3b5c",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700" as const,
  },
  ctaButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700" as const,
  },
});
