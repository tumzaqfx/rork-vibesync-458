import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/theme-store';
import { statusBackgrounds } from '@/mocks/statuses';

interface TextStatusCreatorProps {
  onComplete: (textData: any) => void;
  onCancel: () => void;
}

export default function TextStatusCreator({ onComplete, onCancel }: TextStatusCreatorProps) {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const [selectedBg, setSelectedBg] = useState(statusBackgrounds[0]);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');

  const handleComplete = () => {
    if (text.trim()) {
      onComplete({
        text: text.trim(),
        backgroundColor: selectedBg.type === 'solid' ? selectedBg.colors[0] : undefined,
        gradient: selectedBg.type === 'gradient' ? selectedBg.colors : undefined,
        textAlign,
        fontSize: 32,
      });
    }
  };

  const renderBackground = () => {
    if (selectedBg.type === 'gradient') {
      return (
        <LinearGradient
          colors={selectedBg.colors as any}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      );
    }
    return <View style={[StyleSheet.absoluteFill, { backgroundColor: selectedBg.colors[0] }]} />;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Text Status</Text>
        <TouchableOpacity 
          onPress={handleComplete} 
          style={styles.headerButton}
          disabled={!text.trim()}
        >
          <Check size={24} color={text.trim() ? '#4ECDC4' : colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.preview}>
        {renderBackground()}
        <TextInput
          style={[styles.textInput, { textAlign }]}
          value={text}
          onChangeText={setText}
          placeholder="Type something..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          multiline
          maxLength={200}
          autoFocus
        />
      </View>

      <View style={[styles.controls, { backgroundColor: colors.card }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.backgroundPicker}>
            {statusBackgrounds.map((bg) => (
              <TouchableOpacity
                key={bg.id}
                onPress={() => setSelectedBg(bg)}
                style={[
                  styles.bgOption,
                  selectedBg.id === bg.id && styles.bgOptionSelected,
                ]}
              >
                {bg.type === 'gradient' ? (
                  <LinearGradient
                    colors={bg.colors as any}
                    style={styles.bgPreview}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                ) : (
                  <View style={[styles.bgPreview, { backgroundColor: bg.colors[0] }]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.alignmentControls}>
          {(['left', 'center', 'right'] as const).map((align) => (
            <TouchableOpacity
              key={align}
              onPress={() => setTextAlign(align)}
              style={[
                styles.alignButton,
                { backgroundColor: textAlign === align ? colors.primary : colors.background },
              ]}
            >
              <Text style={[styles.alignText, { color: textAlign === align ? '#FFFFFF' : colors.text }]}>
                {align[0].toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  preview: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 24,
  },
  textInput: {
    fontSize: 32,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    width: '100%',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  controls: {
    padding: 16,
    gap: 16,
  },
  backgroundPicker: {
    flexDirection: 'row' as const,
    gap: 12,
    paddingVertical: 8,
  },
  bgOption: {
    borderRadius: 12,
    padding: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bgOptionSelected: {
    borderColor: '#FFFFFF',
  },
  bgPreview: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  alignmentControls: {
    flexDirection: 'row' as const,
    gap: 12,
    justifyContent: 'center' as const,
  },
  alignButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  alignText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
