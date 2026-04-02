// src/screens/listing/HomeScreen.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { colors, typography, spacing, radius, shadows } from '../../theme/theme';

// ─── Types ────────────────────────────────────────────────────
interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  badges: Badge[];
  specs: Spec[];
  isWishlisted: boolean;
  isReraRegistered: boolean;
}

interface Badge {
  label: string;
  type: 'topRated' | 'newLaunch' | 'mostSearched' | 'roodVerified' | 'featured';
}

interface Spec {
  icon: string;
  label: string;
}

// ─── Mock Data ────────────────────────────────────────────────
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Plot near Virara Vihar i...',
    location: 'Agashi, Virar West, Mumbai',
    price: '₹ 20 L',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    badges: [
      { label: 'Top Rated', type: 'topRated' },
      { label: 'New Launch', type: 'newLaunch' },
    ],
    specs: [
      { icon: 'maximize', label: '4,500 sqft' },
      { icon: 'droplet', label: 'Borewell' },
      { icon: 'git-branch', label: 'Sewage' },
    ],
    isWishlisted: false,
    isReraRegistered: true,
  },
  {
    id: '2',
    title: 'Luxury Villa with Pool',
    location: 'Bandra West, Mumbai',
    price: '₹ 4.5 Cr',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    badges: [
      { label: 'New Launch', type: 'newLaunch' },
      { label: 'Most Searched', type: 'mostSearched' },
    ],
    specs: [
      { icon: 'maximize', label: '3,200 sqft' },
      { icon: 'home', label: '4 BHK' },
      { icon: 'droplet', label: 'Swimming Pool' },
    ],
    isWishlisted: true,
    isReraRegistered: true,
  },
  {
    id: '3',
    title: 'Office Space in Bandra...',
    location: 'Vaibhav apartment, pune',
    price: '₹ 25L',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    badges: [
      { label: 'Top Rated', type: 'topRated' },
      { label: 'New Launch', type: 'newLaunch' },
    ],
    specs: [
      { icon: 'briefcase', label: 'Office Space' },
      { icon: 'maximize', label: '4,500 sqft' },
      { icon: 'home', label: 'Full - furnished' },
    ],
    isWishlisted: false,
    isReraRegistered: true,
  },
  {
    id: '4',
    title: 'ROOD Signature Towers',
    location: 'Sector 45, Gurugram, Haryana',
    price: '₹ 1.8 Cr onwards',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    badges: [
      { label: 'Top Rated', type: 'topRated' },
    ],
    specs: [
      { icon: 'layers', label: '2, 3, 4 BHK' },
      { icon: 'maximize', label: '1,200 sqft' },
      { icon: 'check-circle', label: 'RERA Approved' },
    ],
    isWishlisted: false,
    isReraRegistered: true,
  },
];

// ─── Badge colors ─────────────────────────────────────────────
const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  topRated:    { bg: colors.info,        color: colors.white },
  newLaunch:   { bg: colors.badgePremium, color: colors.white },
  mostSearched:{ bg: '#FF8718',           color: colors.white },
  roodVerified:{ bg: colors.success,      color: colors.white },
  featured:    { bg: colors.warning,      color: colors.white },
};

// ─── Sub-components ───────────────────────────────────────────

function BadgeChip({ badge }: { badge: Badge }) {
  const style = BADGE_STYLES[badge.type] ?? BADGE_STYLES.featured;
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      {badge.type === 'topRated' && (
        <Ionicons name="star" size={9} color={style.color} style={{ marginRight: 3 }} />
      )}
      {badge.type === 'newLaunch' && (
        <Ionicons name="arrow-up" size={9} color={style.color} style={{ marginRight: 3 }} />
      )}
      {badge.type === 'mostSearched' && (
        <Ionicons name="search" size={9} color={style.color} style={{ marginRight: 3 }} />
      )}
      <Text style={[styles.badgeText, { color: style.color }]}>{badge.label}</Text>
    </View>
  );
}

function PropertyCard({
  property,
  onWishlist,
  onPress,
}: {
  property: Property;
  onWishlist: (id: string) => void;
  onPress: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.95}
      onPress={() => onPress(property.id)}
    >
      {/* Image */}
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: property.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        {/* Badges top-left */}
        <View style={styles.cardBadges}>
          {property.badges.map((badge, i) => (
            <BadgeChip key={i} badge={badge} />
          ))}
        </View>

        {/* Action buttons top-right */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onWishlist(property.id)}
          >
            <Ionicons
              name={property.isWishlisted ? 'heart' : 'heart-outline'}
              size={16}
              color={property.isWishlisted ? colors.error : colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="share-social-outline" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        {/* Title row */}
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {property.title}
          </Text>
          {property.isReraRegistered && (
            <View style={styles.reraTag}>
              <Ionicons name="shield-checkmark" size={10} color={colors.brand} />
              <Text style={styles.reraText}>RERA Registered</Text>
            </View>
          )}
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color={colors.textMuted} />
          <Text style={styles.locationText}>{property.location}</Text>
        </View>

        {/* Price */}
        <Text style={styles.price}>{property.price}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Specs */}
        <View style={styles.specsRow}>
          {property.specs.map((spec, i) => (
            <View key={i} style={styles.specItem}>
              <Feather name={spec.icon as any} size={16} color={colors.textSecondary} />
              <Text style={styles.specText}>{spec.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────
export default function HomeScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [properties, setProperties] = useState(MOCK_PROPERTIES);

  const toggleWishlist = (id: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isWishlisted: !p.isWishlisted } : p
      )
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Good morning 👋</Text>
          <Text style={styles.headerTitle}>Find Your Dream Property</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* ── Search Bar ── */}
      <View style={styles.searchRow}>
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

      {/* ── Filter & Sort Bar ── */}
      <View style={styles.filterSortRow}>
        <TouchableOpacity 
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('Filter')}
        >
          <Feather name="sliders" size={16} color={colors.white} />
          <Text style={styles.btnPrimaryText}>Filter</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.btnSecondary}
          onPress={() => navigation.navigate('Filter')}
        >
          <MaterialIcons name="sort" size={18} color={colors.textPrimary} />
          <Text style={styles.btnSecondaryText}>Sort</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>Recommended</Text>
        </TouchableOpacity>
      </View>

      {/* ── Property List ── */}
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onWishlist={toggleWishlist}
            onPress={(id) => navigation?.navigate('PropertyDetail', { propertyId: id })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              {properties.length} Properties Found
            </Text>
            <TouchableOpacity style={styles.sortBtn}>
              <Feather name="bar-chart-2" size={14} color={colors.brand} />
              <Text style={styles.sortText}>Sort</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
  },
  headerGreeting: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: 2,
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
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },

  // Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[3],
    height: 46,
    gap: 8,
    ...shadows.card,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },

  // Filter & Sort Bar
  filterSortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    gap: 12,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
    gap: 8,
  },
  btnPrimaryText: {
    ...typography.label,
    color: colors.white,
    fontSize: 14,
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  btnSecondaryText: {
    ...typography.label,
    color: colors.textPrimary,
    fontSize: 14,
  },

  // List
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  listHeaderText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    ...typography.labelSmall,
    color: colors.brand,
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardImageContainer: {
    height: 200,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardBadges: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'column',
    gap: 4,
  },
  cardActions: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'column',
    gap: 6,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.2,
  },

  // Card content
  cardContent: {
    padding: spacing[4],
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  reraTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.brandLight,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  reraText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: colors.brand,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: spacing[2],
  },
  locationText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  price: {
    ...typography.price,
    color: colors.textPrimary,
    marginBottom: spacing[3],
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: spacing[3],
  },

  // Specs
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  specItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  specText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});