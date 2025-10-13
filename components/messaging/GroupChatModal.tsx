import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { X, Search, Check, Users, Camera } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { Avatar } from '@/components/ui/Avatar';
import { mockUsers } from '@/mocks/users';

interface GroupChatModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, description: string, members: string[], image?: string) => void;
}

export function GroupChatModal({ visible, onClose, onCreateGroup }: GroupChatModalProps) {
  const { colors } = useTheme();
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupImage, setGroupImage] = useState<string | undefined>();

  const filteredUsers = mockUsers.filter(user =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleNext = () => {
    if (selectedMembers.length > 0) {
      setStep('details');
    }
  };

  const handleCreate = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      onCreateGroup(groupName, groupDescription, selectedMembers, groupImage);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('select');
    setSearchQuery('');
    setSelectedMembers([]);
    setGroupName('');
    setGroupDescription('');
    setGroupImage(undefined);
    onClose();
  };

  const renderSelectMembers = () => (
    <>
      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search people..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {selectedMembers.length > 0 && (
        <View style={[styles.selectedContainer, { backgroundColor: colors.background }]}>
          <FlatList
            horizontal
            data={selectedMembers}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.selectedList}
            renderItem={({ item }) => {
              const user = mockUsers.find(u => u.id === item);
              if (!user) return null;
              return (
                <TouchableOpacity
                  style={styles.selectedMember}
                  onPress={() => toggleMember(item)}
                >
                  <Avatar uri={user.profileImage} size={56} />
                  <View style={[styles.removeButton, { backgroundColor: colors.error }]}>
                    <X size={16} color="#fff" />
                  </View>
                  <Text style={[styles.selectedName, { color: colors.text }]} numberOfLines={1}>
                    {user.displayName.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.userList}
        renderItem={({ item }) => {
          const isSelected = selectedMembers.includes(item.id);
          return (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => toggleMember(item.id)}
            >
              <Avatar uri={item.profileImage} size={48} />
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>
                  {item.displayName}
                </Text>
                <Text style={[styles.userHandle, { color: colors.textSecondary }]}>
                  @{item.username}
                </Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  { borderColor: colors.border },
                  isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                {isSelected && <Check size={16} color="#fff" />}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: selectedMembers.length > 0 ? colors.primary : colors.card },
          ]}
          onPress={handleNext}
          disabled={selectedMembers.length === 0}
        >
          <Text
            style={[
              styles.nextButtonText,
              { color: selectedMembers.length > 0 ? '#fff' : colors.textSecondary },
            ]}
          >
            Next ({selectedMembers.length})
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderGroupDetails = () => (
    <>
      <View style={styles.detailsContainer}>
        <TouchableOpacity
          style={[styles.imageUpload, { backgroundColor: colors.background }]}
          onPress={() => console.log('Upload group image')}
        >
          {groupImage ? (
            <Image source={{ uri: groupImage }} style={styles.groupImage} />
          ) : (
            <>
              <Camera size={32} color={colors.textSecondary} />
              <Text style={[styles.imageUploadText, { color: colors.textSecondary }]}>
                Add Group Photo
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={[styles.inputGroup, { backgroundColor: colors.background }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Group Name (required)"
            placeholderTextColor={colors.textSecondary}
            value={groupName}
            onChangeText={setGroupName}
            maxLength={50}
          />
        </View>

        <View style={[styles.inputGroup, { backgroundColor: colors.background }]}>
          <TextInput
            style={[styles.input, styles.textArea, { color: colors.text }]}
            placeholder="Group Description (optional)"
            placeholderTextColor={colors.textSecondary}
            value={groupDescription}
            onChangeText={setGroupDescription}
            multiline
            maxLength={200}
          />
        </View>

        <View style={styles.membersPreview}>
          <View style={styles.membersHeader}>
            <Users size={20} color={colors.text} />
            <Text style={[styles.membersTitle, { color: colors.text }]}>
              Members ({selectedMembers.length})
            </Text>
          </View>
          <FlatList
            data={selectedMembers}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.membersList}
            renderItem={({ item }) => {
              const user = mockUsers.find(u => u.id === item);
              if (!user) return null;
              return (
                <View style={styles.memberPreview}>
                  <Avatar uri={user.profileImage} size={40} />
                  <Text style={[styles.memberName, { color: colors.text }]}>
                    {user.displayName}
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </View>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.background }]}
          onPress={() => setStep('select')}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.createButton,
            { backgroundColor: groupName.trim() ? colors.primary : colors.card },
          ]}
          onPress={handleCreate}
          disabled={!groupName.trim()}
        >
          <Text
            style={[
              styles.createButtonText,
              { color: groupName.trim() ? '#fff' : colors.textSecondary },
            ]}
          >
            Create Group
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={[styles.container, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={handleClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>
              {step === 'select' ? 'Add Members' : 'Group Details'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {step === 'select' ? renderSelectMembers() : renderGroupDetails()}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  selectedContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  selectedList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  selectedMember: {
    alignItems: 'center',
    width: 70,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedName: {
    fontSize: 12,
    marginTop: 4,
  },
  userList: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  imageUpload: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imageUploadText: {
    fontSize: 12,
    marginTop: 8,
  },
  inputGroup: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  membersPreview: {
    marginTop: 8,
  },
  membersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  membersList: {
    gap: 12,
  },
  memberPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberName: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  createButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
