// src/screens/listing/HomeScreen.tsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, typography, spacing, radius, shadows } from '../../theme/theme';
import RoodLogo from '../../components/RoodLogo';
import type { HomeStackParams } from '../../navigation/MainNavigator';

type Nav = NativeStackNavigationProp<HomeStackParams, 'PropertyList'>;

// ─── Types ────────────────────────────────────────────────────
interface Property {
  id: string;
  price: string;
  title: string;
  location: string;
  image: string;
  badge: { label: string; type: 'topRated' | 'newLaunch' | 'mostSearched' | 'roodVerified' };
  photoCount: number;
  isWishlisted: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    price: '₹ 2.2 Cr',
    title: 'Green Valley Estate',
    location: 'Downtown, Metro City',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    badge: { label: 'Top Rated', type: 'topRated' },
    photoCount: 12,
    isWishlisted: false,
  },
  {
    id: '2',
    price: '₹ 4.5 Cr',
    title: 'Luxury Villa with Pool',
    location: 'Bandra West, Mumbai',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    badge: { label: 'New Launch', type: 'newLaunch' },
    photoCount: 8,
    isWishlisted: true,
  },
  {
    id: '3',
    price: '₹ 1.8 Cr onwards',
    title: 'ROOD Signature Towers',
    location: 'Sector 45, Gurugram',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    badge: { label: 'Top Rated', type: 'topRated' },
    photoCount: 15,
    isWishlisted: false,
  },
];

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  topRated:    { bg: '#2563EB', color: colors.white },
  newLaunch:   { bg: colors.badgePremium, color: colors.white },
  mostSearched:{ bg: '#FF8718', color: colors.white },
  roodVerified:{ bg: colors.success, color: colors.white },
};

// ─── Property Card ────────────────────────────────────────────
function PropertyCard({
  property,
  onWishlist,
  onPress,
}: {
  property: Property;
  onWishlist: (id: string) => void;
  onPress: (id: string) => void;
}) {
  const badgeStyle = BADGE_STYLES[property.badge.type];
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(property.id)} activeOpacity={0.9}>
      {/* Image */}
      <View style={styles.cardImageWrap}>
        <Image
          source={{ uri: property.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        {/* Top Rated badge */}
        <View style={[styles.cardBadge, { backgroundColor: badgeStyle.bg }]}>
          {property.badge.type === 'topRated' && (
            <Ionicons name="star" size={10} color={colors.white} style={{ marginRight: 4 }} />
          )}
          {property.badge.type === 'newLaunch' && (
            <Ionicons name="arrow-up" size={10} color={colors.white} style={{ marginRight: 4 }} />
          )}
          <Text style={[styles.cardBadgeText, { color: badgeStyle.color }]}>
            {property.badge.label}
          </Text>
        </View>
        {/* Wishlist button */}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => onWishlist(property.id)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={property.isWishlisted ? 'heart' : 'heart-outline'}
            size={18}
            color={property.isWishlisted ? colors.error : colors.textSecondary}
          />
        </TouchableOpacity>
        {/* Photo count */}
        <View style={styles.photoCount}>
          <Ionicons name="camera-outline" size={12} color={colors.white} />
          <Text style={styles.photoCountText}>{property.photoCount}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <Text style={styles.price}>{property.price}</Text>
        <Text style={styles.propertyTitle}>{property.title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={colors.textMuted} />
          <Text style={styles.locationText}>{property.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────
export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'filter' | 'sort' | 'recommended'>('filter');
  const [properties, setProperties] = useState(MOCK_PROPERTIES);

  const toggleWishlist = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isWishlisted: !p.isWishlisted } : p))
    );
  };

  const openDetail = (id: string) => {
    navigation.navigate('PropertyDetail', { propertyId: id });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <RoodLogo width={90} />
        <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Search Bar ── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locality / project / builder..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* ── Filter Chips ── */}
      <View style={styles.chipsRow}>
        {/* Filter */}
        <TouchableOpacity
          style={[styles.chip, activeFilter === 'filter' && styles.chipActive]}
          activeOpacity={0.85}
          onPress={() => { setActiveFilter('filter'); navigation.navigate('Filter'); }}
        >
          <Feather
            name="sliders"
            size={14}
            color={activeFilter === 'filter' ? colors.white : colors.textPrimary}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.chipText, activeFilter === 'filter' && styles.chipTextActive]}>
            Filter
          </Text>
        </TouchableOpacity>

        {/* Sort */}
        <TouchableOpacity
          style={[styles.chip, activeFilter === 'sort' && styles.chipActive]}
          activeOpacity={0.85}
          onPress={() => { setActiveFilter('sort'); navigation.navigate('Filter'); }}
        >
          <Feather
            name="bar-chart-2"
            size={14}
            color={activeFilter === 'sort' ? colors.white : colors.textPrimary}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.chipText, activeFilter === 'sort' && styles.chipTextActive]}>
            Sort
          </Text>
        </TouchableOpacity>

        {/* Recommended */}
        <TouchableOpacity
          style={[styles.chip, activeFilter === 'recommended' && styles.chipActive]}
          activeOpacity={0.85}
          onPress={() => setActiveFilter('recommended')}
        >
          <Text style={[styles.chipText, activeFilter === 'recommended' && styles.chipTextActive]}>
            Recommended
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Content List ── */}
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyCard property={item} onWishlist={toggleWishlist} onPress={openDetail} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={
          /* ── Lucky Draw Card ── */
          <View style={styles.luckyDrawCard}>
            <View style={styles.luckyDrawImageWrap}>
              <Text style={styles.luckyDrawEmoji}>🎰</Text>
            </View>
            <View style={styles.luckyDrawContent}>
              <Text style={styles.luckyDrawTitle}>Lucky Draw</Text>
              <Text style={styles.luckyDrawDesc}>
                Lorem ipsum dolor sit amet consectetur. Dolor vitae sem ac eget aliquam ipsum.
              </Text>
              <Text style={[styles.luckyDrawDesc, { marginTop: 6 }]}>
                Tempus et in diam interdum suspendisse.
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[3],
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  notifBadgeText: {
    fontSize: 9,
    fontFamily: 'Roboto_700Bold',
    color: colors.white,
  },

  // Search
  searchWrap: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing[4],
    height: 48,
    gap: 10,
    ...shadows.card,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },

  // Chips
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    gap: 10,
    marginBottom: spacing[4],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  chipText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: colors.white,
  },

  // List
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },

  // Lucky Draw
  luckyDrawCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF0F8',
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    alignItems: 'center',
    gap: 14,
  },
  luckyDrawImageWrap: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  luckyDrawEmoji: {
    fontSize: 62,
  },
  luckyDrawContent: {
    flex: 1,
  },
  luckyDrawTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  luckyDrawDesc: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  // Property Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardImageWrap: {
    height: 220,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  cardBadgeText: {
    fontSize: 11,
    fontFamily: 'Roboto_700Bold',
    letterSpacing: 0.2,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCount: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  photoCountText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
    color: colors.white,
  },
  cardInfo: {
    padding: spacing[4],
  },
  price: {
    fontFamily: 'Roboto_900Black',
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  propertyTitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: colors.textMuted,
  },
});
