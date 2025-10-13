import { SponsoredAd } from "@/types";

export const sponsoredAds: SponsoredAd[] = [
  {
    id: "ad-1",
    type: "image",
    brandName: "Shoprite",
    brandAvatar: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop",
    isVerified: true,
    headline: "Save Big on Surf Washing Powder",
    description: "Get R10 off on all Surf products. Limited time offer!",
    mediaUrl: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&h=600&fit=crop",
    ctaText: "Shop Now",
    ctaUrl: "https://shoprite.co.za",
    pricing: {
      originalPrice: "R59.99",
      discountedPrice: "R49.99",
      discount: "Save R10"
    },
    targetAudience: {
      interests: ["shopping", "lifestyle"],
      location: "South Africa",
      ageRange: [18, 65]
    },
    engagement: {
      likes: 1243,
      comments: 89,
      shares: 234,
      saves: 567,
      clicks: 3421
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ad-2",
    type: "video",
    brandName: "Nike",
    brandAvatar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    isVerified: true,
    headline: "Just Do It - New Air Max Collection",
    description: "Step into comfort with the latest Air Max. Available now.",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    ctaText: "Shop Collection",
    ctaUrl: "https://nike.com",
    pricing: {
      originalPrice: "R2,499",
      discountedPrice: "R1,999",
      discount: "20% Off"
    },
    targetAudience: {
      interests: ["sports", "fashion", "fitness"],
      location: "Global",
      ageRange: [16, 45]
    },
    engagement: {
      likes: 5678,
      comments: 234,
      shares: 891,
      saves: 1234,
      clicks: 8765
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ad-3",
    type: "carousel",
    brandName: "Zara",
    brandAvatar: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&h=200&fit=crop",
    isVerified: true,
    headline: "Summer Collection 2025",
    description: "Discover the latest trends. Swipe to explore our new arrivals.",
    carouselItems: [
      {
        mediaUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop",
        caption: "Floral Dresses"
      },
      {
        mediaUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop",
        caption: "Casual Wear"
      },
      {
        mediaUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop",
        caption: "Evening Collection"
      },
      {
        mediaUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=600&fit=crop",
        caption: "Accessories"
      }
    ],
    ctaText: "Shop Now",
    ctaUrl: "https://zara.com",
    targetAudience: {
      interests: ["fashion", "shopping"],
      location: "Global",
      ageRange: [18, 40]
    },
    engagement: {
      likes: 3456,
      comments: 178,
      shares: 456,
      saves: 890,
      clicks: 5432
    },
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ad-4",
    type: "interactive",
    brandName: "Spotify",
    brandAvatar: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop",
    isVerified: true,
    headline: "What's Your Music Vibe?",
    description: "Take our quiz and get 3 months free Premium!",
    mediaUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop",
    interactiveType: "poll",
    interactiveOptions: [
      "Pop & Dance",
      "Hip-Hop & R&B",
      "Rock & Alternative",
      "Electronic & EDM"
    ],
    ctaText: "Get Premium",
    ctaUrl: "https://spotify.com",
    pricing: {
      originalPrice: "R59.99/month",
      discountedPrice: "Free for 3 months",
      discount: "Limited Offer"
    },
    targetAudience: {
      interests: ["music", "entertainment"],
      location: "Global",
      ageRange: [16, 35]
    },
    engagement: {
      likes: 4567,
      comments: 345,
      shares: 678,
      saves: 1123,
      clicks: 9876
    },
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ad-5",
    type: "image",
    brandName: "McDonald's",
    brandAvatar: "https://images.unsplash.com/photo-1619454016518-697bc231e7cb?w=200&h=200&fit=crop",
    isVerified: true,
    headline: "McFlurry Madness - 2 for R30",
    description: "Cool down with our limited-time McFlurry deal. Available at all locations.",
    mediaUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=600&fit=crop",
    ctaText: "Find Nearest Store",
    ctaUrl: "https://mcdonalds.co.za",
    geoTargeted: true,
    location: {
      city: "Johannesburg",
      radius: 10
    },
    pricing: {
      originalPrice: "R40",
      discountedPrice: "R30",
      discount: "2 for R30"
    },
    targetAudience: {
      interests: ["food", "dining"],
      location: "South Africa",
      ageRange: [13, 50]
    },
    engagement: {
      likes: 2345,
      comments: 123,
      shares: 345,
      saves: 456,
      clicks: 4567
    },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "ad-6",
    type: "video",
    brandName: "Samsung",
    brandAvatar: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=200&fit=crop",
    isVerified: true,
    headline: "Galaxy S25 Ultra - Pre-Order Now",
    description: "Experience the future of mobile technology. Get R2000 off with trade-in.",
    mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    ctaText: "Pre-Order",
    ctaUrl: "https://samsung.com",
    pricing: {
      originalPrice: "R24,999",
      discountedPrice: "R22,999",
      discount: "R2000 Trade-In Bonus"
    },
    targetAudience: {
      interests: ["technology", "gadgets"],
      location: "Global",
      ageRange: [20, 55]
    },
    engagement: {
      likes: 6789,
      comments: 456,
      shares: 1234,
      saves: 2345,
      clicks: 12345
    },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  }
];
