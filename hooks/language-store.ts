import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'zh' | 'ja' | 'ar' | 'hi';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

type TranslationKey = string;
type Translations = Record<SupportedLanguage, Record<TranslationKey, string>>;

const translations: Translations = {
  en: {
    'app.name': 'VibeSync',
    'home.title': 'Home',
    'discover.title': 'Discover',
    'vibes.title': 'Vibes',
    'studio.title': 'Studio',
    'profile.title': 'Profile',
    'settings.title': 'Settings',
    'notifications.title': 'Notifications',
    'messages.title': 'Messages',
    'trending.title': 'Trending',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.share': 'Share',
    'common.follow': 'Follow',
    'common.following': 'Following',
    'common.like': 'Like',
    'common.comment': 'Comment',
    'common.send': 'Send',
  },
  es: {
    'app.name': 'VibeSync',
    'home.title': 'Inicio',
    'discover.title': 'Descubrir',
    'vibes.title': 'Vibes',
    'studio.title': 'Estudio',
    'profile.title': 'Perfil',
    'settings.title': 'Configuración',
    'notifications.title': 'Notificaciones',
    'messages.title': 'Mensajes',
    'trending.title': 'Tendencias',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.share': 'Compartir',
    'common.follow': 'Seguir',
    'common.following': 'Siguiendo',
    'common.like': 'Me gusta',
    'common.comment': 'Comentar',
    'common.send': 'Enviar',
  },
  fr: {
    'app.name': 'VibeSync',
    'home.title': 'Accueil',
    'discover.title': 'Découvrir',
    'vibes.title': 'Vibes',
    'studio.title': 'Studio',
    'profile.title': 'Profil',
    'settings.title': 'Paramètres',
    'notifications.title': 'Notifications',
    'messages.title': 'Messages',
    'trending.title': 'Tendances',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.share': 'Partager',
    'common.follow': 'Suivre',
    'common.following': 'Suivi',
    'common.like': 'Aimer',
    'common.comment': 'Commenter',
    'common.send': 'Envoyer',
  },
  de: {
    'app.name': 'VibeSync',
    'home.title': 'Startseite',
    'discover.title': 'Entdecken',
    'vibes.title': 'Vibes',
    'studio.title': 'Studio',
    'profile.title': 'Profil',
    'settings.title': 'Einstellungen',
    'notifications.title': 'Benachrichtigungen',
    'messages.title': 'Nachrichten',
    'trending.title': 'Trends',
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.cancel': 'Abbrechen',
    'common.save': 'Speichern',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.share': 'Teilen',
    'common.follow': 'Folgen',
    'common.following': 'Folge ich',
    'common.like': 'Gefällt mir',
    'common.comment': 'Kommentieren',
    'common.send': 'Senden',
  },
  pt: {
    'app.name': 'VibeSync',
    'home.title': 'Início',
    'discover.title': 'Descobrir',
    'vibes.title': 'Vibes',
    'studio.title': 'Estúdio',
    'profile.title': 'Perfil',
    'settings.title': 'Configurações',
    'notifications.title': 'Notificações',
    'messages.title': 'Mensagens',
    'trending.title': 'Tendências',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.share': 'Compartilhar',
    'common.follow': 'Seguir',
    'common.following': 'Seguindo',
    'common.like': 'Curtir',
    'common.comment': 'Comentar',
    'common.send': 'Enviar',
  },
  zh: {
    'app.name': 'VibeSync',
    'home.title': '首页',
    'discover.title': '发现',
    'vibes.title': 'Vibes',
    'studio.title': '工作室',
    'profile.title': '个人资料',
    'settings.title': '设置',
    'notifications.title': '通知',
    'messages.title': '消息',
    'trending.title': '趋势',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.save': '保存',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.share': '分享',
    'common.follow': '关注',
    'common.following': '已关注',
    'common.like': '点赞',
    'common.comment': '评论',
    'common.send': '发送',
  },
  ja: {
    'app.name': 'VibeSync',
    'home.title': 'ホーム',
    'discover.title': '発見',
    'vibes.title': 'Vibes',
    'studio.title': 'スタジオ',
    'profile.title': 'プロフィール',
    'settings.title': '設定',
    'notifications.title': '通知',
    'messages.title': 'メッセージ',
    'trending.title': 'トレンド',
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.cancel': 'キャンセル',
    'common.save': '保存',
    'common.delete': '削除',
    'common.edit': '編集',
    'common.share': '共有',
    'common.follow': 'フォロー',
    'common.following': 'フォロー中',
    'common.like': 'いいね',
    'common.comment': 'コメント',
    'common.send': '送信',
  },
  ar: {
    'app.name': 'VibeSync',
    'home.title': 'الرئيسية',
    'discover.title': 'اكتشف',
    'vibes.title': 'Vibes',
    'studio.title': 'الاستوديو',
    'profile.title': 'الملف الشخصي',
    'settings.title': 'الإعدادات',
    'notifications.title': 'الإشعارات',
    'messages.title': 'الرسائل',
    'trending.title': 'الرائج',
    'common.loading': 'جار التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.share': 'مشاركة',
    'common.follow': 'متابعة',
    'common.following': 'متابَع',
    'common.like': 'إعجاب',
    'common.comment': 'تعليق',
    'common.send': 'إرسال',
  },
  hi: {
    'app.name': 'VibeSync',
    'home.title': 'होम',
    'discover.title': 'खोजें',
    'vibes.title': 'Vibes',
    'studio.title': 'स्टूडियो',
    'profile.title': 'प्रोफ़ाइल',
    'settings.title': 'सेटिंग्स',
    'notifications.title': 'सूचनाएं',
    'messages.title': 'संदेश',
    'trending.title': 'ट्रेंडिंग',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.share': 'साझा करें',
    'common.follow': 'फ़ॉलो करें',
    'common.following': 'फ़ॉलो किया',
    'common.like': 'पसंद',
    'common.comment': 'टिप्पणी',
    'common.send': 'भेजें',
  },
};

const STORAGE_KEY = '@vibesync_language';

export const [LanguageProvider, useLanguage] = createContextHook(() => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.find(l => l.code === saved)) {
        setCurrentLanguage(saved as SupportedLanguage);
        console.log('[Language] Loaded language:', saved);
      }
    } catch (error) {
      console.error('[Language] Error loading language:', error);
    }
  }, []);

  const changeLanguage = useCallback(async (language: SupportedLanguage) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, language);
      setCurrentLanguage(language);
      console.log('[Language] Changed language to:', language);
    } catch (error) {
      console.error('[Language] Error changing language:', error);
    }
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  }, [currentLanguage]);

  const getCurrentLanguageInfo = useCallback(() => {
    return SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  }, [currentLanguage]);

  return useMemo(() => ({
    currentLanguage,
    changeLanguage,
    t,
    getCurrentLanguageInfo,
    supportedLanguages: SUPPORTED_LANGUAGES,
  }), [currentLanguage, changeLanguage, t, getCurrentLanguageInfo]);
});
