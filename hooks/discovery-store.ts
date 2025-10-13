import { useState, useEffect, useMemo, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import { Platform } from 'react-native';
import {
  User,
  DistanceFilter,
  UserLocation,
  ProximitySuggestion,
  MutualConnection,
  ContactSuggestion,
  DiscoverySuggestion,
  SuggestionScore,
} from '@/types';
import { mockUsers } from '@/mocks/users';

interface FollowGraph {
  [userId: string]: string[];
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getDistanceInKm = (filter: DistanceFilter): number => {
  switch (filter) {
    case '1km':
      return 1;
    case '5km':
      return 5;
    case '20km':
      return 20;
    case 'city':
      return 50;
    default:
      return 5;
  }
};

export const [DiscoveryProvider, useDiscovery] = createContextHook(() => {
  const [currentUserId] = useState<string>('5');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [contactsPermission, setContactsPermission] = useState<boolean>(false);
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>('5km');
  const [syncedContacts, setSyncedContacts] = useState<ContactSuggestion[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState<boolean>(false);

  const followGraph: FollowGraph = useMemo(() => {
    return {
      '5': ['1', '2', '4'],
      '1': ['2', '3', '4'],
      '2': ['1', '3', '5'],
      '3': ['1', '2', '4'],
      '4': ['1', '2', '3', '5'],
    };
  }, []);

  const userLocations: { [userId: string]: UserLocation } = useMemo(() => {
    return {
      '1': { latitude: 34.0522, longitude: -118.2437, city: 'Los Angeles', lastUpdated: new Date().toISOString() },
      '2': { latitude: 25.7617, longitude: -80.1918, city: 'Miami', lastUpdated: new Date().toISOString() },
      '3': { latitude: 47.6062, longitude: -122.3321, city: 'Seattle', lastUpdated: new Date().toISOString() },
      '4': { latitude: 40.7128, longitude: -74.006, city: 'New York', lastUpdated: new Date().toISOString() },
      '5': { latitude: 37.7749, longitude: -122.4194, city: 'San Francisco', lastUpdated: new Date().toISOString() },
    };
  }, []);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        console.log('Location permission not required on web');
        return true;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setLocationPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }, []);

  const requestContactsPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        console.log('Contacts not available on web');
        return false;
      }

      const { status } = await Contacts.requestPermissionsAsync();
      const granted = status === 'granted';
      setContactsPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting contacts permission:', error);
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<UserLocation | null> => {
    try {
      setIsLoadingLocation(true);

      if (Platform.OS === 'web') {
        const mockLocation = userLocations[currentUserId];
        setUserLocation(mockLocation);
        setIsLoadingLocation(false);
        return mockLocation;
      }

      const hasPermission = locationPermission || (await requestLocationPermission());
      if (!hasPermission) {
        setIsLoadingLocation(false);
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLoc: UserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        lastUpdated: new Date().toISOString(),
      };

      setUserLocation(userLoc);
      setIsLoadingLocation(false);
      return userLoc;
    } catch (error) {
      console.error('Error getting location:', error);
      setIsLoadingLocation(false);
      return null;
    }
  }, [currentUserId, locationPermission, userLocations, requestLocationPermission]);

  const getProximitySuggestions = useCallback((
    filter: DistanceFilter = distanceFilter
  ): ProximitySuggestion[] => {
    if (!userLocation) return [];

    const maxDistance = getDistanceInKm(filter);
    const suggestions: ProximitySuggestion[] = [];

    mockUsers.forEach((user) => {
      if (user.id === currentUserId) return;

      const userLoc = userLocations[user.id];
      if (!userLoc) return;

      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        userLoc.latitude,
        userLoc.longitude
      );

      if (distance <= maxDistance) {
        const sharedInterests: string[] = [];
        if (user.bio?.includes('🎬') && Math.random() > 0.5) sharedInterests.push('Movies');
        if (user.bio?.includes('🎨') && Math.random() > 0.5) sharedInterests.push('Art');
        if (user.bio?.includes('💻') && Math.random() > 0.5) sharedInterests.push('Tech');

        suggestions.push({
          user,
          distance: Math.round(distance * 10) / 10,
          distanceUnit: 'km',
          sharedInterests,
          isRecentlyActive: Math.random() > 0.3,
          activityHeatScore: Math.random() * 10,
        });
      }
    });

    return suggestions.sort((a, b) => a.distance - b.distance);
  }, [userLocation, distanceFilter, currentUserId, userLocations]);

  const getMutualConnections = useCallback((): MutualConnection[] => {
    const currentUserFollowing = followGraph[currentUserId] || [];
    const connections: MutualConnection[] = [];

    mockUsers.forEach((user) => {
      if (user.id === currentUserId) return;
      if (currentUserFollowing.includes(user.id)) return;

      const userFollowers = Object.keys(followGraph).filter((userId) =>
        followGraph[userId]?.includes(user.id)
      );

      const mutualFollowers = userFollowers
        .filter((userId) => currentUserFollowing.includes(userId))
        .map((userId) => mockUsers.find((u) => u.id === userId))
        .filter((u): u is User => u !== undefined);

      if (mutualFollowers.length > 0) {
        connections.push({
          user,
          mutualFollowers,
          mutualCount: mutualFollowers.length,
          connectionStrength: mutualFollowers.length * (user.isVerified ? 1.5 : 1),
        });
      }
    });

    return connections.sort((a, b) => b.connectionStrength - a.connectionStrength);
  }, [currentUserId, followGraph]);

  const syncContacts = useCallback(async (): Promise<ContactSuggestion[]> => {
    try {
      setIsLoadingContacts(true);

      if (Platform.OS === 'web') {
        console.log('Contacts sync not available on web');
        setIsLoadingContacts(false);
        return [];
      }

      const hasPermission = contactsPermission || (await requestContactsPermission());
      if (!hasPermission) {
        setIsLoadingContacts(false);
        return [];
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      });

      const suggestions: ContactSuggestion[] = [];

      data.slice(0, 10).forEach((contact: any, index: number) => {
        const matchedUser = mockUsers[index % mockUsers.length];
        if (matchedUser && matchedUser.id !== currentUserId) {
          suggestions.push({
            user: matchedUser,
            contactName: contact.name || 'Unknown',
            phoneNumber: contact.phoneNumbers?.[0]?.number,
            email: contact.emails?.[0]?.email,
            isNewUser: Math.random() > 0.5,
            joinedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
      });

      setSyncedContacts(suggestions);
      setIsLoadingContacts(false);
      return suggestions;
    } catch (error) {
      console.error('Error syncing contacts:', error);
      setIsLoadingContacts(false);
      return [];
    }
  }, [contactsPermission, currentUserId, requestContactsPermission]);

  const calculateHybridScore = useCallback((
    user: User,
    proximity?: ProximitySuggestion,
    mutual?: MutualConnection,
    contact?: ContactSuggestion
  ): SuggestionScore => {
    let proximityScore = 0;
    let mutualScore = 0;
    let contactScore = 0;
    const reasons: string[] = [];

    if (proximity) {
      proximityScore = Math.max(0, 10 - proximity.distance);
      if (proximity.isRecentlyActive) proximityScore += 2;
      if (proximity.sharedInterests.length > 0) {
        proximityScore += proximity.sharedInterests.length;
        reasons.push(`${proximity.sharedInterests.length} shared interests`);
      }
      reasons.push(`${proximity.distance}km away`);
    }

    if (mutual) {
      mutualScore = mutual.connectionStrength;
      reasons.push(`${mutual.mutualCount} mutual connections`);
    }

    if (contact) {
      contactScore = 15;
      if (contact.isNewUser) {
        contactScore += 5;
        reasons.push('Just joined VibeSync');
      }
      reasons.push('From your contacts');
    }

    if (user.isVerified) {
      proximityScore *= 1.2;
      mutualScore *= 1.2;
      contactScore *= 1.2;
      reasons.push('Verified user');
    }

    const totalScore = proximityScore + mutualScore + contactScore;

    return {
      userId: user.id,
      proximityScore,
      mutualScore,
      contactScore,
      totalScore,
      reasons,
    };
  }, []);

  const getHybridSuggestions = useCallback((): DiscoverySuggestion[] => {
    const proximityUsers = getProximitySuggestions();
    const mutualUsers = getMutualConnections();
    const contactUsers = syncedContacts;

    const userMap = new Map<string, DiscoverySuggestion>();

    proximityUsers.forEach((prox) => {
      const mutual = mutualUsers.find((m) => m.user.id === prox.user.id);
      const contact = contactUsers.find((c) => c.user.id === prox.user.id);
      const score = calculateHybridScore(prox.user, prox, mutual, contact);

      userMap.set(prox.user.id, {
        user: prox.user,
        score,
        primaryReason: contact ? 'contact' : mutual ? 'hybrid' : 'proximity',
        distance: prox.distance,
        mutualCount: mutual?.mutualCount,
        isContact: !!contact,
        metadata: {
          sharedInterests: prox.sharedInterests,
          mutualFollowers: mutual?.mutualFollowers,
          contactInfo: contact?.contactName,
          activityLevel: prox.isRecentlyActive ? 'high' : 'medium',
        },
      });
    });

    mutualUsers.forEach((mutual) => {
      if (!userMap.has(mutual.user.id)) {
        const contact = contactUsers.find((c) => c.user.id === mutual.user.id);
        const score = calculateHybridScore(mutual.user, undefined, mutual, contact);

        userMap.set(mutual.user.id, {
          user: mutual.user,
          score,
          primaryReason: contact ? 'contact' : 'mutual',
          mutualCount: mutual.mutualCount,
          isContact: !!contact,
          metadata: {
            mutualFollowers: mutual.mutualFollowers,
            contactInfo: contact?.contactName,
            activityLevel: 'medium',
          },
        });
      }
    });

    contactUsers.forEach((contact) => {
      if (!userMap.has(contact.user.id)) {
        const score = calculateHybridScore(contact.user, undefined, undefined, contact);

        userMap.set(contact.user.id, {
          user: contact.user,
          score,
          primaryReason: 'contact',
          isContact: true,
          metadata: {
            contactInfo: contact.contactName,
            activityLevel: contact.isNewUser ? 'high' : 'low',
          },
        });
      }
    });

    return Array.from(userMap.values()).sort((a, b) => b.score.totalScore - a.score.totalScore);
  }, [getProximitySuggestions, getMutualConnections, syncedContacts, calculateHybridScore]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return useMemo(() => ({
    currentUserId,
    userLocation,
    locationPermission,
    contactsPermission,
    distanceFilter,
    syncedContacts,
    isLoadingLocation,
    isLoadingContacts,
    setDistanceFilter,
    requestLocationPermission,
    requestContactsPermission,
    getCurrentLocation,
    getProximitySuggestions,
    getMutualConnections,
    syncContacts,
    getHybridSuggestions,
  }), [
    currentUserId,
    userLocation,
    locationPermission,
    contactsPermission,
    distanceFilter,
    syncedContacts,
    isLoadingLocation,
    isLoadingContacts,
    requestLocationPermission,
    requestContactsPermission,
    getCurrentLocation,
    getProximitySuggestions,
    getMutualConnections,
    syncContacts,
    getHybridSuggestions,
  ]);
});
