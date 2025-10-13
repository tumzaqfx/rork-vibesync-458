import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { MapPin, ChevronDown, Globe } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface LocationToggleProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
}

const LOCATIONS = [
  { id: 'global', name: 'Global', icon: Globe },
  { id: 'johannesburg', name: 'Johannesburg', icon: MapPin },
  { id: 'cape-town', name: 'Cape Town', icon: MapPin },
  { id: 'durban', name: 'Durban', icon: MapPin },
  { id: 'pretoria', name: 'Pretoria', icon: MapPin },
  { id: 'port-elizabeth', name: 'Port Elizabeth', icon: MapPin },
];

export const LocationToggle: React.FC<LocationToggleProps> = ({
  currentLocation,
  onLocationChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const currentLocationData = LOCATIONS.find(
    (loc) => loc.id === currentLocation
  ) || LOCATIONS[0];

  const handleLocationSelect = (locationId: string) => {
    onLocationChange(locationId);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.toggle}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.toggleContent}>
          <currentLocationData.icon size={16} color={Colors.primary} />
          <Text style={styles.toggleText}>{currentLocationData.name}</Text>
          <ChevronDown size={16} color={Colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
            </View>
            <FlatList
              data={LOCATIONS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const Icon = item.icon;
                const isSelected = item.id === currentLocation;
                return (
                  <TouchableOpacity
                    style={[
                      styles.locationItem,
                      isSelected && styles.locationItemSelected,
                    ]}
                    onPress={() => handleLocationSelect(item.id)}
                  >
                    <Icon
                      size={20}
                      color={isSelected ? Colors.primary : Colors.text}
                    />
                    <Text
                      style={[
                        styles.locationText,
                        isSelected && styles.locationTextSelected,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {isSelected && (
                      <View style={styles.selectedIndicator} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  toggle: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  locationItemSelected: {
    backgroundColor: Colors.primary + '10',
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  locationTextSelected: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});
