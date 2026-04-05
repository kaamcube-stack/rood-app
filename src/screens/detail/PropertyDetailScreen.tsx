import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ContactUsSheet from '../contact/ContactUsScreen';
import { colors, typography, spacing, radius, shadows, layout } from '../../theme/theme';

const { width: SCREEN_W } = Dimensions.get('window');
const IMAGE_H = 260;

// ── Mock data ─────────────────────────────────────────────────────────────────
const PROPERTY = {
  id: '1',
  name: 'Skyline Residences',
  location: 'Kapur, Virar West, Mumbai',
  price: '₹25 L',
  pricePerSqft: '₹14,000',
  totalPrice: '30 L',
  area: '18 sq.ft',
  lastUpdated: '5 Days ago',
  viewerCount: 141,
  rentVerified: true,
  reraRegistered: true,
  stats: { sqft: '5,050', config: '3+ BHK', plotArea: '8+ sq.ft' },
  chips: ['Office Space', '2–3 bed', 'East Facing', 'Semi-Furnished', 'Parking Available'],
  details: { type: 'Row House', floor: '5th', bedrooms: 4, bathrooms: 2, balconies: 3, view: 'Mountains' },
  projectSpecs: { floors: 23, units: 23, amenities: 'Parking area, Pool, Balcony', possession: '23/08/29' },
  plotSpecs: {
    area: '12,000',
    dimensions: '40 × 80 (Length × Breadth)',
    ownership: '23/08/29',
    facing: 'North Facing',
    features: 'Freehold Property',
    note: 'Sewage, water supply, etc.',
  },
  officeAmenities: {
    furnishing: 'Furnished',
    utilities: 'Conference rooms, cabins, seating, washrooms, etc.',
    building: 'Elevator, emergency exit, etc.',
    occupancy: 'Lorem Ipsum',
  },
  locality: {
    address: 'P.R.C., Agarkar, near Airoli, Virar West, Mumbai',
    rating: 4.5,
    pois: [
      { icon: 'school', name: "St. Xavier's International School", distance: '1.2 km', type: 'nearby' },
      { icon: 'hospital-building', name: 'City General Hospital', distance: '1.5 km', type: 'nearby' },
      { icon: 'store', name: 'Westside Galleria Mall', distance: '5.0 km', type: 'lifestyle' },
      { icon: 'bus', name: 'Blueline Bus Stop', distance: '1.2 km', type: 'transit' },
      { icon: 'subway-variant', name: 'Dadar Metro Station', distance: '1.5 km', type: 'transit' },
      { icon: 'train', name: 'Dadar Railway Station', distance: '3.5 km', type: 'transit' },
    ],
  },
  builder: { name: 'Prestige Group', projects: 38, rating: 4.8, verified: true },
  rera: { builderId: 'D176543543545', reraId: 'D176543543345' },
  investment: { growth: '+12.4%', marketValue: '14K/sqft' },
  similarProperties: [
    { id: '2', name: 'Skyline Residences', location: 'Kapur, Virar West', price: '₹5 L', beds: 3, area: '110', badge: 'Rood Verified' },
    { id: '3', name: 'Prestha Grante', location: 'Kapur, Virar West', price: '₹5 L', beds: 3, area: '110', badge: 'Rood Verified' },
  ],
  recentlyViewed: [
    { id: '4', name: 'Prestha Grante', location: 'Kapur, Virar West', price: '₹5 L', beds: 3, area: '110', badge: 'Rood Verified' },
    { id: '5', name: 'Skyline Residences', location: 'Kapur, Virar West', price: '₹50 L', beds: 5, area: '150', badge: 'Rood Verified' },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionCard({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.sectionCard, style]}>{children}</View>;
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.floor(rating) ? 'star' : i - rating < 1 ? 'star-half' : 'star-outline'}
          size={14}
          color={colors.star}
        />
      ))}
      <Text style={styles.ratingText}>{rating}</Text>
    </View>
  );
}

// ── Block 1: Media ────────────────────────────────────────────────────────────
function MediaBlock({ viewerCount }: { viewerCount: number }) {
  return (
    <View style={styles.mediaContainer}>
      {/* Placeholder image */}
      <View style={styles.imagePlaceholder}>
        <Ionicons name="image-outline" size={48} color={colors.textMuted} />
      </View>
      {/* Viewer count overlay */}
      <View style={styles.viewerBanner}>
        <Ionicons name="eye-outline" size={14} color={colors.textBody} />
        <Text style={styles.viewerText}>
          {viewerCount} people are viewing this property right now
        </Text>
      </View>
      {/* Image count dot indicator */}
      <View style={styles.dotRow}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

// ── Block 2: Property Summary ─────────────────────────────────────────────────
function PropertySummaryBlock({ property }: { property: typeof PROPERTY }) {
  return (
    <SectionCard>
      {/* Title + location */}
      <Text style={styles.propertyName}>{property.name}</Text>
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.locationText}>{property.location}</Text>
      </View>

      {/* Price row */}
      <View style={styles.priceRow}>
        <Text style={styles.priceText}>{property.price}</Text>
        {property.rentVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={12} color={colors.success} />
            <Text style={styles.verifiedBadgeText}>Rent Verified</Text>
          </View>
        )}
      </View>
      <Text style={styles.priceSubText}>
        {property.pricePerSqft}  |  {property.totalPrice}  |  {property.area}
      </Text>

      {/* Points banner */}
      <View style={styles.pointsBanner}>
        <Ionicons name="star" size={14} color={colors.warning} />
        <Text style={styles.pointsText}>
          Visit property to get 200 points. Increase your chances of winning in the next lucky draw by 11%
        </Text>
      </View>

      {/* Key stats */}
      <View style={styles.statsRow}>
        <Text style={styles.statItem}>{property.stats.sqft}</Text>
        <View style={styles.statDivider} />
        <Text style={styles.statItem}>{property.stats.config}</Text>
        <View style={styles.statDivider} />
        <Text style={styles.statItem}>{property.stats.plotArea}</Text>
      </View>

      {/* Feature chips */}
      <View style={styles.chipsWrap}>
        {property.chips.map((chip) => (
          <View key={chip} style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
          </View>
        ))}
      </View>

      {/* RERA row */}
      {property.reraRegistered && (
        <View style={styles.reraRow}>
          <View style={styles.reraBadge}>
            <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
            <Text style={styles.reraBadgeText}>RERA Registered</Text>
          </View>
          <TouchableOpacity style={styles.viewMoreBtn}>
            <Text style={styles.viewMoreText}>View More Info</Text>
            <Ionicons name="chevron-forward" size={12} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </SectionCard>
  );
}

// ── Block 3 (partial): Details ─────────────────────────────────────────────────
function DetailsBlock({ details }: { details: typeof PROPERTY.details }) {
  return (
    <SectionCard>
      <SectionHeader title="Details" />
      <View style={styles.detailGrid}>
        <View style={styles.detailCol}>
          <DetailRow label="Type" value={details.type} />
          <DetailRow label="Bedrooms" value={details.bedrooms} />
          <DetailRow label="Balconies" value={details.balconies} />
        </View>
        <View style={styles.detailCol}>
          <DetailRow label="Floor" value={details.floor} />
          <DetailRow label="Bathrooms" value={details.bathrooms} />
          <DetailRow label="View" value={details.view} />
        </View>
      </View>
    </SectionCard>
  );
}

// ── Block 4: Project Specs ────────────────────────────────────────────────────
function ProjectSpecsBlock({ specs }: { specs: typeof PROPERTY.projectSpecs }) {
  return (
    <SectionCard>
      <SectionHeader title="Project Specs" />
      <View style={styles.detailGrid}>
        <View style={styles.detailCol}>
          <DetailRow label="Floor" value={specs.floors} />
          <DetailRow label="Amenities" value={specs.amenities} />
        </View>
        <View style={styles.detailCol}>
          <DetailRow label="Units" value={specs.units} />
          <DetailRow label="Possession" value={specs.possession} />
        </View>
      </View>
    </SectionCard>
  );
}

// ── Block 5: Plot Specifications ──────────────────────────────────────────────
function PlotSpecsBlock({ specs }: { specs: typeof PROPERTY.plotSpecs }) {
  const [unit, setUnit] = useState<'sqft' | 'sqm'>('sqft');
  return (
    <SectionCard>
      <SectionHeader title="Plot Specifications" />

      {/* Area with unit toggle */}
      <View style={styles.plotAreaRow}>
        <View style={styles.detailCol}>
          <Text style={styles.detailLabel}>Area</Text>
          <Text style={styles.detailValue}>{specs.area}</Text>
        </View>
        <View style={styles.unitToggle}>
          {(['sqft', 'sqm'] as const).map((u) => (
            <TouchableOpacity
              key={u}
              onPress={() => setUnit(u)}
              style={[styles.unitBtn, unit === u && styles.unitBtnActive]}
            >
              <Text style={[styles.unitBtnText, unit === u && styles.unitBtnTextActive]}>{u}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <DetailRow label="Dimensions" value={specs.dimensions} />
      <DetailRow label="Ownership" value={specs.ownership} />
      <DetailRow label="Facing" value={specs.facing} />
      <DetailRow label="Features" value={specs.features} />
      <Text style={styles.plotNote}>{specs.note}</Text>
    </SectionCard>
  );
}

// ── Block 6: Office Amenities ─────────────────────────────────────────────────
function OfficeAmenitiesBlock({ amenities }: { amenities: typeof PROPERTY.officeAmenities }) {
  return (
    <SectionCard>
      <SectionHeader title="Office Amenities" />
      <DetailRow label="Furnishing" value={amenities.furnishing} />
      <DetailRow label="Utilities" value={amenities.utilities} />
      <DetailRow label="Building" value={amenities.building} />
      <DetailRow label="Occupancy" value={amenities.occupancy} />
    </SectionCard>
  );
}

// ── Block 7: Locality Intelligence ────────────────────────────────────────────
function LocalityBlock({ locality }: { locality: typeof PROPERTY.locality }) {
  const [activeTab, setActiveTab] = useState<'nearby' | 'transit' | 'lifestyle'>('nearby');
  const tabs: Array<{ key: typeof activeTab; label: string }> = [
    { key: 'nearby', label: 'Nearby' },
    { key: 'transit', label: 'Transit' },
    { key: 'lifestyle', label: 'Lifestyle' },
  ];
  const filtered = locality.pois.filter((p) => p.type === activeTab);

  return (
    <SectionCard>
      <SectionHeader title="Locality Intelligence" />
      <View style={styles.localityAddressRow}>
        <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.localityAddress}>{locality.address}</Text>
      </View>

      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={40} color={colors.textMuted} />
        <Text style={styles.mapPlaceholderText}>Map View</Text>
      </View>

      {/* Rating */}
      <View style={styles.ratingRow}>
        <Text style={styles.ratingBig}>{locality.rating}</Text>
        <StarRating rating={locality.rating} />
      </View>

      {/* Tabs */}
      <View style={styles.localityTabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.localityTab, activeTab === tab.key && styles.localityTabActive]}
          >
            <Text style={[styles.localityTabText, activeTab === tab.key && styles.localityTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* POI list */}
      {filtered.map((poi) => (
        <View key={poi.name} style={styles.poiRow}>
          <View style={styles.poiIconWrap}>
            <MaterialCommunityIcons name={poi.icon as any} size={18} color={colors.brand} />
          </View>
          <Text style={styles.poiName} numberOfLines={1}>{poi.name}</Text>
          <Text style={styles.poiDistance}>{poi.distance}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.seeMoreBtn}>
        <Text style={styles.seeMoreText}>See More</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.primary} />
      </TouchableOpacity>
    </SectionCard>
  );
}

// ── Block 8: Development Insights ────────────────────────────────────────────
function DevelopmentInsightsBlock() {
  return (
    <SectionCard>
      <SectionHeader title="Development Insights" />
      <View style={styles.devInsightCard}>
        <View style={styles.upcomingBadge}>
          <Text style={styles.upcomingBadgeText}>UPCOMING 2027</Text>
        </View>
        <Text style={styles.devInsightTitle}>New Highway Connection</Text>
        <Text style={styles.devInsightDesc}>
          A new highway is being built nearby. This will significantly improve connectivity to the
          surrounding localities, boosting property demand by 15%.
        </Text>
      </View>
    </SectionCard>
  );
}

// ── Block 9: Builder Overview ─────────────────────────────────────────────────
function BuilderOverviewBlock({ builder }: { builder: typeof PROPERTY.builder }) {
  return (
    <SectionCard>
      <SectionHeader title="Builder Overview" />
      <View style={styles.builderRow}>
        <View style={styles.builderLogo}>
          <Text style={styles.builderLogoText}>PG</Text>
        </View>
        <View style={styles.builderInfo}>
          <Text style={styles.builderName}>{builder.name}</Text>
          <Text style={styles.builderMeta}>{builder.projects} Projects</Text>
        </View>
        <StarRating rating={builder.rating} />
      </View>
      {builder.verified && (
        <View style={styles.verifiedBadgeFull}>
          <Ionicons name="checkmark-circle" size={14} color={colors.success} />
          <Text style={styles.verifiedFullText}>Verified Builder</Text>
        </View>
      )}
      <Text style={styles.builderDesc}>
        The Real Estate (Regulation and Development) Act 2019 has established The Prestige Group
        as one of the leading and most successful developers of real estate in India, by imprinting
        its indelible mark across all segments of the real estate industry.
      </Text>
    </SectionCard>
  );
}

// ── Block 10: RERA Certificate ────────────────────────────────────────────────
function ReraCertificateBlock({ rera }: { rera: typeof PROPERTY.rera }) {
  return (
    <SectionCard>
      <SectionHeader title="RERA Certificate" />
      <View style={styles.reraContent}>
        <View style={styles.reraDetails}>
          <Text style={styles.reraItemLabel}>Builder Project RERA ID</Text>
          <Text style={styles.reraItemValue}>{rera.builderId}</Text>
          <View style={styles.reraDivider} />
          <Text style={styles.reraItemLabel}>ROOD RERA Id</Text>
          <Text style={styles.reraItemValue}>{rera.reraId}</Text>
          <TouchableOpacity style={styles.reraLinkRow}>
            <Ionicons name="globe-outline" size={14} color={colors.primary} />
            <Text style={styles.reraLink}>Go To Website</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reraQrWrap}>
          {/* QR Placeholder */}
          <View style={styles.qrPlaceholder}>
            <MaterialCommunityIcons name="qrcode" size={64} color={colors.textPrimary} />
          </View>
          <TouchableOpacity>
            <Text style={styles.viewCertText}>View Certificate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SectionCard>
  );
}

// ── Block 11: Investment Insights ─────────────────────────────────────────────
function InvestmentInsightsBlock({ investment }: { investment: typeof PROPERTY.investment }) {
  // Simple sparkline using views
  const points = [30, 45, 38, 52, 48, 60, 55, 70];
  const maxP = Math.max(...points);

  return (
    <SectionCard>
      <SectionHeader title="Investment Insights" />
      <View style={styles.investMetrics}>
        <View style={styles.investMetric}>
          <Text style={styles.investMetricValue}>{investment.growth}</Text>
          <Text style={styles.investMetricLabel}>Price Growth</Text>
        </View>
        <View style={styles.investMetricDivider} />
        <View style={styles.investMetric}>
          <Text style={styles.investMetricValue}>{investment.marketValue}</Text>
          <Text style={styles.investMetricLabel}>Market Value</Text>
        </View>
      </View>
      {/* Sparkline chart */}
      <View style={styles.chartArea}>
        <View style={styles.sparkline}>
          {points.map((p, i) => (
            <View
              key={i}
              style={[styles.sparkBar, { height: (p / maxP) * 60 }]}
            />
          ))}
        </View>
        <View style={styles.chartXLabels}>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((m) => (
            <Text key={m} style={styles.chartXLabel}>{m}</Text>
          ))}
        </View>
      </View>
    </SectionCard>
  );
}

// ── Block 12: EMI Calculator ──────────────────────────────────────────────────
function EmiCalculatorBlock() {
  const [principal, setPrincipal] = useState(1250000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const monthlyRate = rate / 100 / 12;
  const n = tenure * 12;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
  const total = emi * n;

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  return (
    <SectionCard>
      <SectionHeader title="Calculate EMI" />

      <View style={styles.emiRow}>
        <Text style={styles.emiLabel}>Loan Amount</Text>
        <Text style={styles.emiValue}>{fmt(principal)}</Text>
      </View>

      <View style={styles.emiSliderTrack}>
        <View style={[styles.emiSliderFill, { width: `${(principal / 10000000) * 100}%` as any }]} />
      </View>
      <View style={styles.emiSliderLabels}>
        <Text style={styles.emiSliderLabel}>₹1L</Text>
        <Text style={styles.emiSliderLabel}>₹1Cr</Text>
      </View>

      <View style={styles.emiRow}>
        <Text style={styles.emiLabel}>Interest Rate</Text>
        <Text style={styles.emiValue}>{rate}%</Text>
      </View>
      <View style={styles.emiSliderTrack}>
        <View style={[styles.emiSliderFill, { width: `${((rate - 5) / 15) * 100}%` as any }]} />
      </View>
      <View style={styles.emiSliderLabels}>
        <Text style={styles.emiSliderLabel}>5%</Text>
        <Text style={styles.emiSliderLabel}>20%</Text>
      </View>

      <View style={styles.emiRow}>
        <Text style={styles.emiLabel}>Tenure</Text>
        <Text style={styles.emiValue}>{tenure} yrs</Text>
      </View>
      <View style={styles.emiSliderTrack}>
        <View style={[styles.emiSliderFill, { width: `${(tenure / 30) * 100}%` as any }]} />
      </View>
      <View style={styles.emiSliderLabels}>
        <Text style={styles.emiSliderLabel}>1 yr</Text>
        <Text style={styles.emiSliderLabel}>30 yrs</Text>
      </View>

      <View style={styles.emiResultCard}>
        <View style={styles.emiResultItem}>
          <Text style={styles.emiResultLabel}>Total Amount</Text>
          <Text style={styles.emiResultValue}>{fmt(total)}</Text>
        </View>
        <View style={styles.emiResultDivider} />
        <View style={styles.emiResultItem}>
          <Text style={styles.emiResultLabel}>Monthly EMI</Text>
          <Text style={[styles.emiResultValue, styles.emiHighlight]}>{fmt(emi)}</Text>
        </View>
      </View>
    </SectionCard>
  );
}

// ── Property Card (reusable for Similar + Recently Viewed) ────────────────────
function PropertyCard({ item }: { item: (typeof PROPERTY.similarProperties)[0] }) {
  return (
    <View style={styles.propCard}>
      <View style={styles.propCardImage}>
        <Ionicons name="image-outline" size={28} color={colors.textMuted} />
      </View>
      <View style={styles.propCardBody}>
        <Text style={styles.propCardName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.propCardLocation} numberOfLines={1}>{item.location}</Text>
        <Text style={styles.propCardPrice}>{item.price}</Text>
        <View style={styles.propCardMeta}>
          <Text style={styles.propCardMetaText}>{item.beds} BHK</Text>
          <Text style={styles.propCardMetaText}> · </Text>
          <Text style={styles.propCardMetaText}>{item.area} sq.ft</Text>
        </View>
        <View style={styles.propCardVerified}>
          <Ionicons name="checkmark-circle" size={10} color={colors.success} />
          <Text style={styles.propCardVerifiedText}>{item.badge}</Text>
        </View>
      </View>
    </View>
  );
}

function HorizontalPropertyList({ data, title }: { data: typeof PROPERTY.similarProperties; title: string }) {
  return (
    <SectionCard>
      <SectionHeader title={title} />
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.propListContent}
        renderItem={({ item }) => <PropertyCard item={item} />}
        ItemSeparatorComponent={() => <View style={{ width: spacing.m }} />}
      />
    </SectionCard>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function PropertyDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [saved, setSaved] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <View style={styles.screen}>
      {/* Floating header */}
      <View style={[styles.header, { top: insets.top + 8 }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.lastUpdatedPill}>
          <View style={styles.lastUpdatedDot} />
          <Text style={styles.lastUpdatedText}>Last Updated: {PROPERTY.lastUpdated}</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={() => setSaved(!saved)}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
      >
        <MediaBlock viewerCount={PROPERTY.viewerCount} />
        <View style={styles.blocksContainer}>
          <PropertySummaryBlock property={PROPERTY} />
          <DetailsBlock details={PROPERTY.details} />
          <ProjectSpecsBlock specs={PROPERTY.projectSpecs} />
          <PlotSpecsBlock specs={PROPERTY.plotSpecs} />
          <OfficeAmenitiesBlock amenities={PROPERTY.officeAmenities} />
          <LocalityBlock locality={PROPERTY.locality} />
          <DevelopmentInsightsBlock />
          <BuilderOverviewBlock builder={PROPERTY.builder} />
          <ReraCertificateBlock rera={PROPERTY.rera} />
          <InvestmentInsightsBlock investment={PROPERTY.investment} />
          <EmiCalculatorBlock />
          <HorizontalPropertyList data={PROPERTY.similarProperties} title="Similar Properties" />
          <HorizontalPropertyList data={PROPERTY.recentlyViewed} title="Recently Viewed" />
        </View>
      </ScrollView>

      {/* Bottom CTA bar */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.ctaSecondary} onPress={() => setShowContact(true)}>
          <Ionicons name="call-outline" size={16} color={colors.primary} />
          <Text style={styles.ctaSecondaryText}>Request Callback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaPrimary}>
          <Ionicons name="calendar-outline" size={16} color={colors.white} />
          <Text style={styles.ctaPrimaryText}>Schedule Visit</Text>
        </TouchableOpacity>
      </View>

      <ContactUsSheet visible={showContact} onClose={() => setShowContact(false)} />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  lastUpdatedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    ...shadows.card,
  },
  lastUpdatedDot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
    backgroundColor: colors.success,
  },
  lastUpdatedText: {
    ...typography.caption,
    color: colors.textBody,
  },

  // Scroll
  scrollContent: {
    flexGrow: 1,
  },
  blocksContainer: {
    gap: spacing.m,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.m,
  },

  // Media
  mediaContainer: {
    height: IMAGE_H,
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerBanner: {
    position: 'absolute',
    bottom: 36,
    left: layout.screenPadding,
    right: layout.screenPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: radius.md,
    ...shadows.card,
  },
  viewerText: {
    ...typography.caption,
    color: colors.textBody,
    flex: 1,
  },
  dotRow: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface + '80',
  },
  dotActive: {
    backgroundColor: colors.surface,
    width: 18,
  },

  // Section Card
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: layout.screenPadding,
    ...shadows.card,
  },
  sectionHeader: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },

  // Property Summary
  propertyName: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.m,
  },
  locationText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    marginBottom: spacing.xs,
  },
  priceText: {
    ...typography.priceLarge,
    color: colors.textPrimary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.successBg,
    paddingHorizontal: spacing.s,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  verifiedBadgeText: {
    ...typography.labelSmall,
    color: colors.success,
  },
  priceSubText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.m,
  },
  pointsBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.warningBg,
    padding: spacing.m,
    borderRadius: radius.sm,
    marginBottom: spacing.m,
  },
  pointsText: {
    ...typography.bodySmall,
    color: colors.textBody,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  statItem: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
    marginBottom: spacing.m,
  },
  chip: {
    backgroundColor: colors.primaryFaded,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  chipText: {
    ...typography.labelSmall,
    color: colors.primary,
  },
  reraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  reraBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.infoBg,
    paddingHorizontal: spacing.s,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  reraBadgeText: {
    ...typography.labelSmall,
    color: colors.info,
  },
  viewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewMoreText: {
    ...typography.bodySmall,
    color: colors.primary,
  },

  // Detail grid
  detailGrid: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  detailCol: {
    flex: 1,
    gap: spacing.m,
  },
  detailRow: {
    gap: spacing.xs,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    ...typography.titleSmall,
    color: colors.textPrimary,
  },

  // Plot specs
  plotAreaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  unitToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  unitBtn: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
  },
  unitBtnActive: {
    backgroundColor: colors.primary,
  },
  unitBtnText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  unitBtnTextActive: {
    color: colors.white,
  },
  plotNote: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.s,
    fontStyle: 'italic',
  },

  // Locality
  localityAddressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginBottom: spacing.m,
  },
  localityAddress: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  mapPlaceholder: {
    height: 160,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapPlaceholderText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    marginBottom: spacing.m,
  },
  ratingBig: {
    ...typography.titleLarge,
    color: colors.textPrimary,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  localityTabs: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    padding: 3,
    marginBottom: spacing.m,
  },
  localityTab: {
    flex: 1,
    paddingVertical: spacing.s,
    alignItems: 'center',
    borderRadius: radius.xs,
  },
  localityTabActive: {
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  localityTabText: {
    ...typography.labelSmall,
    color: colors.textSecondary,
  },
  localityTabTextActive: {
    color: colors.textPrimary,
    fontFamily: 'Roboto_500Medium',
  },
  poiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  poiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poiName: {
    ...typography.body,
    color: colors.textBody,
    flex: 1,
  },
  poiDistance: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.m,
  },
  seeMoreText: {
    ...typography.labelLarge,
    color: colors.primary,
  },

  // Development Insights
  devInsightCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.m,
  },
  upcomingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.successBg,
    paddingHorizontal: spacing.s,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginBottom: spacing.s,
  },
  upcomingBadgeText: {
    ...typography.overline,
    color: colors.success,
  },
  devInsightTitle: {
    ...typography.titleLarge,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  devInsightDesc: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Builder
  builderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    marginBottom: spacing.s,
  },
  builderLogo: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.brandLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  builderLogoText: {
    ...typography.h4,
    color: colors.brand,
  },
  builderInfo: {
    flex: 1,
  },
  builderName: {
    ...typography.titleLarge,
    color: colors.textPrimary,
  },
  builderMeta: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  verifiedBadgeFull: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.successBg,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.s,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginBottom: spacing.m,
  },
  verifiedFullText: {
    ...typography.labelSmall,
    color: colors.success,
  },
  builderDesc: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // RERA
  reraContent: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  reraDetails: {
    flex: 1,
    gap: spacing.xs,
  },
  reraItemLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reraItemValue: {
    ...typography.titleSmall,
    color: colors.textPrimary,
  },
  reraDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.s,
  },
  reraLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.s,
  },
  reraLink: {
    ...typography.body,
    color: colors.primary,
  },
  reraQrWrap: {
    alignItems: 'center',
    gap: spacing.s,
  },
  qrPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewCertText: {
    ...typography.bodySmall,
    color: colors.primary,
    textAlign: 'center',
  },

  // Investment
  investMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  investMetric: {
    flex: 1,
    alignItems: 'center',
  },
  investMetricValue: {
    ...typography.h3,
    color: colors.success,
  },
  investMetricLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  investMetricDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  chartArea: {
    gap: spacing.xs,
  },
  sparkline: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    paddingHorizontal: spacing.xs,
  },
  sparkBar: {
    flex: 1,
    backgroundColor: colors.primaryFaded,
    borderRadius: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  chartXLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  chartXLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 9,
  },

  // EMI
  emiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  emiLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  emiValue: {
    ...typography.titleSmall,
    color: colors.textPrimary,
  },
  emiSliderTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    marginBottom: spacing.xs,
  },
  emiSliderFill: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  emiSliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  emiSliderLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  emiResultCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryFaded,
    borderRadius: radius.md,
    padding: spacing.m,
    marginTop: spacing.s,
  },
  emiResultItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  emiResultLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emiResultValue: {
    ...typography.titleSmall,
    color: colors.textPrimary,
  },
  emiHighlight: {
    color: colors.primary,
    fontFamily: 'Roboto_700Bold',
  },
  emiResultDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.m,
  },

  // Property cards
  propCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.card,
  },
  propCardImage: {
    height: 100,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  propCardBody: {
    padding: spacing.s,
    gap: 2,
  },
  propCardName: {
    ...typography.titleSmall,
    color: colors.textPrimary,
  },
  propCardLocation: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  propCardPrice: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: 2,
  },
  propCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propCardMetaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  propCardVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  propCardVerifiedText: {
    ...typography.caption,
    color: colors.success,
  },
  propListContent: {
    paddingBottom: spacing.xs,
  },

  // Bottom CTA
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: spacing.m,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.m,
    backgroundColor: colors.surface,
    ...shadows.bottomBar,
  },
  ctaSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  ctaSecondaryText: {
    ...typography.button,
    color: colors.primary,
  },
  ctaPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.s,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    ...shadows.button,
  },
  ctaPrimaryText: {
    ...typography.button,
    color: colors.white,
  },
});
