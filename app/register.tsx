import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/auth-store';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Check, Camera, ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';

type Step = 1 | 2 | 3 | 4;

const INTERESTS = [
  'Music', 'Movies', 'Food', 'Travel', 'Fitness', 'Fashion',
  'Tech', 'Gaming', 'Art', 'Photography', 'Sports', 'Reading',
  'Cooking', 'Dancing', 'Nature', 'Pets', 'Cars', 'Comedy'
];

export default function RegisterScreen() {
  const { register } = useAuth();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<string>('');
  const [showBirthday, setShowBirthday] = useState(true);
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const [enableLocation, setEnableLocation] = useState(false);
  
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleImagePicker = () => {
    if (Platform.OS === 'web') {
      pickImage();
    } else {
      Alert.alert(
        'Profile Picture',
        'Choose an option',
        [
          { text: 'Take Photo', onPress: takePhoto },
          { text: 'Choose from Library', onPress: pickImage },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const checkUsernameAvailability = async (value: string) => {
    if (value.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    
    setTimeout(() => {
      const taken = ['admin', 'vibesync', 'test', 'user'].includes(value.toLowerCase());
      setUsernameAvailable(!taken);
      setCheckingUsername(false);
    }, 500);
  };

  const handleUsernameChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(cleaned);
    checkUsernameAvailability(cleaned);
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const canContinueStep1 = () => {
    return validateEmail(email) && 
           validatePassword(password) && 
           password === confirmPassword;
  };

  const canContinueStep2 = () => {
    return firstName.trim().length > 0 && 
           username.length >= 3 && 
           usernameAvailable === true;
  };

  const canContinueStep3 = () => {
    return selectedInterests.length >= 3;
  };

  const handleNext = () => {
    if (step === 1 && canContinueStep1()) {
      setStep(2);
    } else if (step === 2 && canContinueStep2()) {
      setStep(3);
    } else if (step === 3 && canContinueStep3()) {
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    } else {
      router.back();
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    setError('');

    try {
      const displayName = `${firstName} ${lastName}`.trim();
      
      console.log('[Register] Starting registration process...');
      console.log('[Register] Email:', email);
      console.log('[Register] Username:', username);
      console.log('[Register] Display Name:', displayName);
      
      await register({
        email,
        password,
        confirmPassword,
        username,
        displayName,
        bio,
        profileImage: profileImage || undefined,
        interests: selectedInterests,
        birthday,
        gender,
        enableLocation,
      });
      
      console.log('[Register] Registration successful, navigating to home...');
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('[Register] Registration failed:', err);
      
      const isNetworkError = err.message?.includes('fetch') || 
                             err.message?.includes('Network') ||
                             err.message?.includes('Failed to fetch') ||
                             err.message?.includes('network request failed');
      
      if (isNetworkError) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
      
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
    handleFinish();
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Step {step} of 4</Text>
    </View>
  );

  const renderStep1 = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Create Your Account</Text>
      <Text style={styles.stepSubtitle}>Enter your email and create a secure password</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={Colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        {email.length > 0 && !validateEmail(email) && (
          <Text style={styles.errorHint}>Please enter a valid email address</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Create a strong password"
            placeholderTextColor={Colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password-new"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={20} color={Colors.textSecondary} />
            ) : (
              <Eye size={20} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
        <PasswordStrengthIndicator password={password} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Re-enter your password"
            placeholderTextColor={Colors.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoComplete="password-new"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff size={20} color={Colors.textSecondary} />
            ) : (
              <Eye size={20} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
        {confirmPassword.length > 0 && password !== confirmPassword && (
          <Text style={styles.errorHint}>Passwords do not match</Text>
        )}
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Create Your Vibe</Text>
      <Text style={styles.stepSubtitle}>Set up your profile and start connecting</Text>

      <TouchableOpacity style={styles.profileImageContainer} onPress={handleImagePicker}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Camera size={32} color={Colors.textSecondary} />
          </View>
        )}
        <View style={styles.cameraIconBadge}>
          <Camera size={16} color={Colors.text} />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleImagePicker}>
        <Text style={styles.skipText}>Tap to add photo • Skip for now</Text>
      </TouchableOpacity>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          placeholderTextColor={Colors.textSecondary}
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          placeholderTextColor={Colors.textSecondary}
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Username * @{username || '...'}</Text>
        <View style={styles.usernameContainer}>
          <TextInput
            style={[styles.input, styles.usernameInput]}
            placeholder="Choose a unique username"
            placeholderTextColor={Colors.textSecondary}
            value={username}
            onChangeText={handleUsernameChange}
            autoCapitalize="none"
          />
          {checkingUsername && (
            <Text style={styles.usernameStatus}>Checking...</Text>
          )}
          {!checkingUsername && usernameAvailable === true && (
            <View style={styles.availableBadge}>
              <Check size={16} color={Colors.success} />
            </View>
          )}
          {!checkingUsername && usernameAvailable === false && (
            <Text style={styles.unavailableText}>Taken</Text>
          )}
        </View>
        <Text style={styles.helperText}>This is how people will find you</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bio (Optional)</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Tell people about your vibe..."
          placeholderTextColor={Colors.textSecondary}
          value={bio}
          onChangeText={(text) => text.length <= 120 && setBio(text)}
          multiline
          maxLength={120}
        />
        <Text style={styles.charCount}>{bio.length}/120</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Birthday (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={Colors.textSecondary}
          value={birthday}
          onChangeText={setBirthday}
        />
        <TouchableOpacity 
          style={styles.checkboxRow}
          onPress={() => setShowBirthday(!showBirthday)}
        >
          <View style={[styles.checkbox, showBirthday && styles.checkboxChecked]}>
            {showBirthday && <Check size={16} color={Colors.text} />}
          </View>
          <Text style={styles.checkboxLabel}>Show on profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender (Optional)</Text>
        <View style={styles.genderRow}>
          {['Male', 'Female', 'Other', 'Prefer not to say'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.genderOption, gender === option && styles.genderOptionSelected]}
              onPress={() => setGender(option)}
            >
              <Text style={[styles.genderText, gender === option && styles.genderTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>What are you into?</Text>
      <Text style={styles.stepSubtitle}>Select at least 3 interests to personalize your feed</Text>

      <View style={styles.interestsGrid}>
        {INTERESTS.map((interest) => {
          const isSelected = selectedInterests.includes(interest);
          return (
            <TouchableOpacity
              key={interest}
              style={[styles.interestChip, isSelected && styles.interestChipSelected]}
              onPress={() => toggleInterest(interest)}
            >
              <Text style={[styles.interestText, isSelected && styles.interestTextSelected]}>
                {interest}
              </Text>
              {isSelected && (
                <View style={styles.interestCheck}>
                  <Check size={14} color={Colors.text} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.selectedCount}>
        {selectedInterests.length} selected {selectedInterests.length >= 3 ? '✓' : `(${3 - selectedInterests.length} more needed)`}
      </Text>
    </ScrollView>
  );

  const renderStep4 = () => (
    <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Discover Nearby Vibes</Text>
      <Text style={styles.stepSubtitle}>Enable location to find people and events around you</Text>

      <View style={styles.locationCard}>
        <View style={styles.locationIconContainer}>
          <Text style={styles.locationIcon}>📍</Text>
        </View>
        
        <Text style={styles.locationTitle}>Location-Based Discovery</Text>
        <Text style={styles.locationDescription}>
          Find friends nearby, discover local events, and connect with your community. You can adjust your distance preferences anytime.
        </Text>

        <TouchableOpacity
          style={styles.locationToggle}
          onPress={() => setEnableLocation(!enableLocation)}
        >
          <View style={[styles.toggleTrack, enableLocation && styles.toggleTrackActive]}>
            <View style={[styles.toggleThumb, enableLocation && styles.toggleThumbActive]} />
          </View>
          <Text style={styles.toggleLabel}>
            {enableLocation ? 'Location Enabled' : 'Enable Location'}
          </Text>
        </TouchableOpacity>

        {enableLocation && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationInfoText}>
              ✓ Discover people within 1-20km
            </Text>
            <Text style={styles.locationInfoText}>
              ✓ Find local events and meetups
            </Text>
            <Text style={styles.locationInfoText}>
              ✓ See activity heat spots
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.privacyNote}>
        Your exact location is never shared. Only approximate distance is shown to others.
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Profile Summary</Text>
        
        {profileImage && (
          <Image source={{ uri: profileImage }} style={styles.summaryImage} />
        )}
        
        <Text style={styles.summaryName}>
          {firstName} {lastName}
        </Text>
        <Text style={styles.summaryUsername}>@{username}</Text>
        
        {bio && <Text style={styles.summaryBio}>{bio}</Text>}
        
        <View style={styles.summaryInterests}>
          {selectedInterests.slice(0, 5).map((interest) => (
            <View key={interest} style={styles.summaryInterestChip}>
              <Text style={styles.summaryInterestText}>{interest}</Text>
            </View>
          ))}
          {selectedInterests.length > 5 && (
            <Text style={styles.summaryMore}>+{selectedInterests.length - 5} more</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        
        {renderProgressBar()}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          {retryCount > 0 && (
            <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 10 }]}>
        {step < 4 ? (
          <Button
            title="Continue"
            onPress={handleNext}
            disabled={
              (step === 1 && !canContinueStep1()) ||
              (step === 2 && !canContinueStep2()) ||
              (step === 3 && !canContinueStep3())
            }
            style={styles.continueButton}
          />
        ) : (
          <Button
            title="Finish & Start Vibing"
            onPress={handleFinish}
            loading={isLoading}
            disabled={isLoading}
            style={styles.continueButton}
          />
        )}
        
        {step === 4 && (
          <TouchableOpacity onPress={handleFinish}>
            <Text style={styles.skipButton}>Skip & Finish Later</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 12,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.cardLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  stepTitle: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepSubtitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginBottom: 32,
    lineHeight: 22,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 12,
    position: 'relative' as const,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.cardLight,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed' as const,
  },
  cameraIconBadge: {
    position: 'absolute' as const,
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  skipText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.cardLight,
    borderRadius: 12,
    padding: 16,
    color: Colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordContainer: {
    position: 'relative' as const,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute' as const,
    right: 16,
    top: 16,
  },
  errorHint: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 6,
  },
  usernameContainer: {
    position: 'relative' as const,
  },
  usernameInput: {
    paddingRight: 60,
  },
  usernameStatus: {
    position: 'absolute' as const,
    right: 16,
    top: 18,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  availableBadge: {
    position: 'absolute' as const,
    right: 16,
    top: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    position: 'absolute' as const,
    right: 16,
    top: 18,
    color: Colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  helperText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 6,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 6,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    color: Colors.text,
    fontSize: 14,
  },
  genderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.cardLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genderOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  genderText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  genderTextSelected: {
    color: Colors.text,
    fontWeight: '600',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: Colors.cardLight,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  interestChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  interestText: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  interestTextSelected: {
    color: Colors.text,
    fontWeight: '600',
  },
  interestCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCount: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 24,
    fontWeight: '500',
  },
  locationCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  locationIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationIcon: {
    fontSize: 40,
  },
  locationTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  locationDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  locationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleTrack: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cardLight,
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackActive: {
    backgroundColor: Colors.primary,
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.text,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
  toggleLabel: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  locationInfo: {
    marginTop: 20,
    gap: 8,
    alignSelf: 'stretch',
  },
  locationInfoText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  privacyNote: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginTop: 24,
  },
  summaryTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  summaryName: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryUsername: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginBottom: 12,
  },
  summaryBio: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  summaryInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  summaryInterestChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.cardLight,
  },
  summaryInterestText: {
    color: Colors.text,
    fontSize: 12,
  },
  summaryMore: {
    color: Colors.textSecondary,
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
    backgroundColor: Colors.background,
  },
  continueButton: {
    borderRadius: 12,
  },
  skipButton: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    padding: 12,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: Colors.error + '20',
    padding: 16,
    gap: 12,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: Colors.error,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
