import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { colors, typography, spacing, radius, shadows } from '../../theme/theme';
import { filtersData } from '../../data';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.3;

type TabType = 'sort' | 'filter';

export default function FilterScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('filter');
  const [activeCategory, setActiveCategory] = useState('quickFilters');
  const [filters, setFilters] = useState(filtersData);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showAreaUnitDropdown, setShowAreaUnitDropdown] = useState(false);

  const categories = useMemo(() => [
    { id: 'quickFilters', label: 'Quick Filters' },
    { id: 'location', label: 'Location' },
    { id: 'budget', label: 'Budget' },
    { id: 'availability', label: 'Availability' },
    { id: 'propertyType', label: 'Property Type' },
    { id: 'bhk', label: 'BHK' },
    { id: 'constructionStatus', label: 'Construction Status' },
    { id: 'furnishingStatus', label: 'Furnishing Status' },
    { id: 'area', label: 'Area' },
    { id: 'bathrooms', label: 'Bathrooms' },
    { id: 'newBookingResale', label: 'New Booking / Resale' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'floorPreference', label: 'Floor Preference' },
    { id: 'postedBy', label: 'Posted By' },
    { id: 'builders', label: 'Builders' },
    { id: 'projects', label: 'Projects' },
    { id: 'facing', label: 'Facing Direction' },
  ], []);

  const toggleQuickFilter = (filterId: string) => {
    setFilters((prev: any) => ({
      ...prev,
      quickFilters: prev.quickFilters.map((filter: any) =>
        filter.id === filterId ? { ...filter, selected: !filter.selected } : filter
      ),
    }));
  };

  const clearQuickFiltersSelection = () => {
    setFilters((prev: any) => ({
      ...prev,
      quickFilters: prev.quickFilters.map((filter: any) => ({
        ...filter,
        selected: false,
      })),
    }));
  };

  const toggleLocationOption = (locationId: string) => {
    setFilters((prev: any) => {
      const updatedLocation = { ...prev.location };
      const locationIndex = updatedLocation.allLocations.findIndex((loc: any) => loc.id === locationId);
      
      if (locationIndex !== -1) {
        updatedLocation.allLocations[locationIndex] = {
          ...updatedLocation.allLocations[locationIndex],
          selected: !updatedLocation.allLocations[locationIndex].selected
        };
      }
      
      return { ...prev, location: updatedLocation };
    });
  };

  const getSelectedLocations = () => {
    return filters.location.allLocations.filter((loc: any) => loc.selected);
  };

  const getUnselectedLocations = () => {
    return filters.location.allLocations.filter((loc: any) => !loc.selected);
  };

  const getFilteredLocations = () => {
    if (!filters.location.searchQuery) return [];
    return filters.location.allLocations.filter((loc: any) =>
      loc.label.toLowerCase().includes(filters.location.searchQuery.toLowerCase())
    );
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹ ${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `₹ ${(value / 100000).toFixed(0)} L`;
    } else {
      return `₹ ${value.toLocaleString('en-IN')}`;
    }
  };

  const updateBudgetRange = (type: 'min' | 'max', value: number) => {
    setFilters((prev: any) => {
      const updatedBudget = { ...prev.budget };
      if (type === 'min') {
        updatedBudget.minValue = Math.min(value, updatedBudget.maxValue - 1);
      } else {
        updatedBudget.maxValue = Math.max(value, updatedBudget.minValue + 1);
      }
      return { ...prev, budget: updatedBudget };
    });
  };

  const toggleExpandedSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleConstructionStatusOption = (optionId: string) => {
    setFilters((prev: any) => {
      const updatedConstructionStatus = { ...prev.constructionStatus };
      const optionIndex = updatedConstructionStatus.options.findIndex((opt: any) => opt.id === optionId);
      
      if (optionIndex !== -1) {
        updatedConstructionStatus.options[optionIndex] = {
          ...updatedConstructionStatus.options[optionIndex],
          selected: !updatedConstructionStatus.options[optionIndex].selected
        };
      }
      
      return { ...prev, constructionStatus: updatedConstructionStatus };
    });
  };

  const toggleConstructionSubOption = (optionId: string, subOptionId: string) => {
    setFilters((prev: any) => {
      const updatedConstructionStatus = { ...prev.constructionStatus };
      const optionIndex = updatedConstructionStatus.options.findIndex((opt: any) => opt.id === optionId);
      
      if (optionIndex !== -1) {
        const subOptionIndex = updatedConstructionStatus.options[optionIndex].subOptions.findIndex((sub: any) => sub.id === subOptionId);
        if (subOptionIndex !== -1) {
          updatedConstructionStatus.options[optionIndex].subOptions[subOptionIndex] = {
            ...updatedConstructionStatus.options[optionIndex].subOptions[subOptionIndex],
            selected: !updatedConstructionStatus.options[optionIndex].subOptions[subOptionIndex].selected
          };
        }
      }
      
      return { ...prev, constructionStatus: updatedConstructionStatus };
    });
  };

  const toggleMultiSelect = (categoryKey: string, optionId: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        options: prev[categoryKey].options.map((opt: any) =>
          opt.id === optionId ? { ...opt, selected: !opt.selected } : opt
        ),
      },
    }));
  };

  const handlePropertyTypeToggle = (typeId: string) => {
    setFilters((prev: any) => ({
      ...prev,
      propertyType: prev.propertyType.map((pt: any) =>
        pt.id === typeId ? { ...pt, selected: true } : { ...pt, selected: false }
      ),
    }));
  };

  const applyFilters = () => {
    console.log('Applying filters:', filters);
    // Navigate back or apply filters logic here
    navigation.goBack();
  };

  const closeFilter = () => navigation.goBack();
  const resetFilters = () => {
     setFilters(filtersData);
     setSearchQuery('');
     setActiveCategory('quickFilters');
  };

  // ── Render Helpers ───────────────────────────────────────────

  const renderSidebar = () => (
    <View style={styles.sidebar}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.sidebarItem,
              activeCategory === cat.id && styles.sidebarItemActive,
            ]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Text
              style={[
                styles.sidebarText,
                activeCategory === cat.id && styles.sidebarTextActive,
              ]}
            >
              {cat.label}
            </Text>
            {activeCategory === cat.id && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    switch (activeCategory) {
      case 'quickFilters':
        return renderQuickFilters();
      case 'location':
        return renderLocation();
      case 'budget':
        return renderBudget();
      case 'propertyType':
        return renderPropertyTypes();
      case 'amenities':
        return renderAmenities();
      case 'bhk':
        return renderBHK();
      case 'constructionStatus':
        return renderConstructionStatus();
      case 'area':
        return renderArea();
      case 'dimension':
        return renderRange(activeCategory);
      default:
        return renderMultiSelectContent(activeCategory);
    }
  };

  const renderQuickFilters = () => (
    <View style={styles.contentSection}>
      <View style={styles.quickFiltersContainer}>
        {filters.quickFilters.map((filter: any) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.quickFilterChip,
              filter.selected && styles.quickFilterChipActive
            ]}
            onPress={() => toggleQuickFilter(filter.id)}
          >
            {filter.selected && (
              <Ionicons name="checkmark-circle" size={16} color={colors.brand} />
            )}
            <Text style={[
              styles.quickFilterText,
              filter.selected && styles.quickFilterTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity style={styles.clearSelection} onPress={clearQuickFiltersSelection}>
        <Text style={styles.clearSelectionText}>Clear Selection</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBudget = () => {
    const budgetData = filters.budget;

    return (
      <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>{budgetData.label}</Text>

        {/* Min/Max Header */}
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetHeaderText}>MIN</Text>
          <Text style={styles.budgetHeaderText}>MAX</Text>
        </View>

        {/* Budget Options - Two Columns */}
        <View style={styles.budgetContainer}>
          {/* Min Column */}
          <View style={styles.budgetColumn}>
            {budgetData.minOptions.map((option: any) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.budgetChip,
                  option.selected && styles.budgetChipSelected
                ]}
                onPress={() => {
                  setFilters((prev: any) => ({
                    ...prev,
                    budget: {
                      ...prev.budget,
                      minOptions: prev.budget.minOptions.map((opt: any) =>
                        opt.id === option.id ? { ...opt, selected: !opt.selected } : { ...opt, selected: false }
                      )
                    }
                  }));
                }}
              >
                {option.selected && (
                  <Ionicons name="checkmark-circle" size={18} color={colors.brand} style={styles.budgetChipIcon} />
                )}
                <Text style={[
                  styles.budgetChipText,
                  option.selected && styles.budgetChipTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Max Column */}
          <View style={styles.budgetColumn}>
            {budgetData.maxOptions.map((option: any) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.budgetChip,
                  option.selected && styles.budgetChipSelected
                ]}
                onPress={() => {
                  setFilters((prev: any) => ({
                    ...prev,
                    budget: {
                      ...prev.budget,
                      maxOptions: prev.budget.maxOptions.map((opt: any) =>
                        opt.id === option.id ? { ...opt, selected: !opt.selected } : { ...opt, selected: false }
                      )
                    }
                  }));
                }}
              >
                {option.selected && (
                  <Ionicons name="checkmark-circle" size={18} color={colors.brand} style={styles.budgetChipIcon} />
                )}
                <Text style={[
                  styles.budgetChipText,
                  option.selected && styles.budgetChipTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Clear Selection Button */}
        <View style={styles.budgetClearContainer}>
          <TouchableOpacity
            style={styles.budgetClearBtn}
            onPress={() => {
              setFilters((prev: any) => ({
                ...prev,
                budget: {
                  ...prev.budget,
                  minOptions: prev.budget.minOptions.map((opt: any) => ({
                    ...opt,
                    selected: opt.id === 'no-min'
                  })),
                  maxOptions: prev.budget.maxOptions.map((opt: any) => ({
                    ...opt,
                    selected: opt.id === 'no-max'
                  }))
                }
              }));
            }}
          >
            <Text style={styles.budgetClearBtnText}>Clear Selection</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBHK = () => {
    const bhkData = filters.bhk;

    return (
      <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>{bhkData.label}</Text>

        {/* BHK - Pill/Chip Buttons */}
        <View style={styles.bhkContainer}>
          {bhkData.options.map((option: any) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.bhkChip,
                option.selected && styles.bhkChipSelected
              ]}
              onPress={() => {
                setFilters((prev: any) => ({
                  ...prev,
                  bhk: {
                    ...prev.bhk,
                    options: prev.bhk.options.map((opt: any) =>
                      opt.id === option.id ? { ...opt, selected: !opt.selected } : opt
                    )
                  }
                }));
              }}
            >
              {option.selected && (
                <Ionicons name="checkmark-circle" size={20} color={colors.brand} style={styles.bhkChipIcon} />
              )}
              <Text style={[
                styles.bhkChipText,
                option.selected && styles.bhkChipTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Clear Selection Button */}
        <View style={styles.bhkClearContainer}>
          <TouchableOpacity
            style={styles.bhkClearBtn}
            onPress={() => {
              setFilters((prev: any) => ({
                ...prev,
                bhk: {
                  ...prev.bhk,
                  options: prev.bhk.options.map((opt: any) => ({
                    ...opt,
                    selected: false
                  }))
                }
              }));
            }}
          >
            <Text style={styles.bhkClearBtnText}>Clear Selection</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAmenities = () => {
    const amenitiesData = filters.amenities;

    return (
      <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>{amenitiesData.label}</Text>

        {/* Amenities - Pill/Chip Buttons */}
        <View style={styles.amenitiesContainer}>
          {amenitiesData.options.map((option: any) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.amenityChip,
                option.selected && styles.amenityChipSelected
              ]}
              onPress={() => {
                setFilters((prev: any) => ({
                  ...prev,
                  amenities: {
                    ...prev.amenities,
                    options: prev.amenities.options.map((opt: any) =>
                      opt.id === option.id ? { ...opt, selected: !opt.selected } : opt
                    )
                  }
                }));
              }}
            >
              {option.selected && (
                <Ionicons name="checkmark-circle" size={20} color={colors.brand} style={styles.amenityChipIcon} />
              )}
              <Text style={[
                styles.amenityChipText,
                option.selected && styles.amenityChipTextSelected
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Clear Selection Button */}
        <View style={styles.amenitiesClearContainer}>
          <TouchableOpacity
            style={styles.amenitiesClearBtn}
            onPress={() => {
              setFilters((prev: any) => ({
                ...prev,
                amenities: {
                  ...prev.amenities,
                  options: prev.amenities.options.map((opt: any) => ({
                    ...opt,
                    selected: false
                  }))
                }
              }));
            }}
          >
            <Text style={styles.amenitiesClearBtnText}>Clear Selection</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderConstructionStatus = () => {
  const constructionData = filters.constructionStatus;
  
  return (
    <View style={styles.contentSection}>
      <Text style={styles.contentTitle}>{constructionData.label}</Text>
      
      {/* Main Options - Pill/Chip Buttons */}
      <View style={styles.constructionMainOptions}>
        {constructionData.mainOptions.map((option: any) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.constructionMainChip,
              option.selected && styles.constructionMainChipSelected
            ]}
            onPress={() => {
              setFilters((prev: any) => ({
                ...prev,
                constructionStatus: {
                  ...prev.constructionStatus,
                  mainOptions: prev.constructionStatus.mainOptions.map((opt: any) =>
                    opt.id === option.id ? { ...opt, selected: !opt.selected } : opt
                  )
                }
              }));
            }}
          >
            {option.selected && (
              <Ionicons name="checkmark-circle" size={20} color={colors.brand} style={styles.constructionMainChipIcon} />
            )}
            <Text style={[
              styles.constructionMainChipText,
              option.selected && styles.constructionMainChipTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Sub Categories - Show when main option is selected */}
      {constructionData.mainOptions.map((mainOption: any) => {
        if (!mainOption.selected) return null;
        
        const subCategory = constructionData.subCategories[mainOption.id as keyof typeof constructionData.subCategories];
        if (!subCategory) return null;
        
        return (
          <View key={mainOption.id} style={styles.constructionSubCategory}>
            <Text style={styles.constructionSubCategoryLabel}>{subCategory.label}</Text>
            <View style={styles.constructionSubOptions}>
              {subCategory.options.map((subOption: any) => (
                <TouchableOpacity
                  key={subOption.id}
                  style={[
                    styles.constructionSubChip,
                    subOption.selected && styles.constructionSubChipSelected
                  ]}
                  onPress={() => {
                    setFilters((prev: any) => ({
                      ...prev,
                      constructionStatus: {
                        ...prev.constructionStatus,
                        subCategories: {
                          ...prev.constructionStatus.subCategories,
                          [mainOption.id]: {
                            ...prev.constructionStatus.subCategories[mainOption.id],
                            options: prev.constructionStatus.subCategories[mainOption.id].options.map((opt: any) =>
                              opt.id === subOption.id ? { ...opt, selected: !opt.selected } : opt
                            )
                          }
                        }
                      }
                    }));
                  }}
                >
                  {subOption.selected && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.brand} style={styles.constructionSubChipIcon} />
                  )}
                  <Text style={[
                    styles.constructionSubChipText,
                    subOption.selected && styles.constructionSubChipTextSelected
                  ]}>
                    {subOption.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
      
      {/* Clear Selection Button */}
      <View style={styles.constructionStatusClearContainer}>
        <TouchableOpacity 
          style={styles.constructionStatusClearBtn}
          onPress={() => {
            setFilters((prev: any) => ({
              ...prev,
              constructionStatus: {
                ...prev.constructionStatus,
                mainOptions: prev.constructionStatus.mainOptions.map((opt: any) => ({
                  ...opt,
                  selected: false
                })),
                subCategories: Object.keys(prev.constructionStatus.subCategories).reduce((acc: any, key: string) => {
                  acc[key] = {
                    ...prev.constructionStatus.subCategories[key],
                    options: prev.constructionStatus.subCategories[key].options.map((opt: any) => ({
                      ...opt,
                      selected: false
                    }))
                  };
                  return acc;
                }, {})
              }
            }));
          }}
        >
          <Text style={styles.constructionStatusClearBtnText}>Clear Selection</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

  const renderLocation = () => {
    const selectedLocations = getSelectedLocations();
    const unselectedLocations = getUnselectedLocations();
    const filteredLocations = getFilteredLocations();
    const hasSearchQuery = filters.location.searchQuery.length > 0;

    return (
      <View style={styles.contentSection}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={filters.location.placeholder}
            value={filters.location.searchQuery}
            onChangeText={(text) => setFilters((prev: any) => ({
              ...prev,
              location: { ...prev.location, searchQuery: text }
            }))}
          />
        </View>

        {/* Use Current Location */}
        <TouchableOpacity 
          style={styles.currentLocationRow}
          onPress={() => setFilters((prev: any) => ({
            ...prev,
            location: {
              ...prev.location,
              useCurrentLocation: {
                ...prev.location.useCurrentLocation,
                selected: !prev.location.useCurrentLocation.selected
              }
            }
          }))}
        >
          <Ionicons name="location" size={20} color={colors.brand} />
          <Text style={styles.currentLocationText}>{filters.location.useCurrentLocation.label}</Text>
        </TouchableOpacity>

        {/* Search Results - Show when typing */}
        {hasSearchQuery && (
          <View style={styles.locationSection}>
            <View style={styles.locationList}>
              {filteredLocations.map((location: any) => (
                <TouchableOpacity
                  key={location.id}
                  style={styles.locationRow}
                  onPress={() => toggleLocationOption(location.id)}
                >
                  <Ionicons 
                    name={location.selected ? "checkmark-circle" : "ellipse-outline"} 
                    size={20} 
                    color={location.selected ? colors.brand : colors.textMuted} 
                  />
                  <Text style={styles.locationLabel}>{location.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* When not searching, show Nearby Localities and Selected Locations */}
        {!hasSearchQuery && (
          <>
            {/* Selected Locations - Show if any are selected */}
            {selectedLocations.length > 0 && (
              <View style={styles.locationSection}>
                <Text style={styles.sectionTitle}>Selected Locations</Text>
                <View style={styles.locationList}>
                  {selectedLocations.map((location: any) => (
                    <TouchableOpacity
                      key={location.id}
                      style={styles.locationRow}
                      onPress={() => toggleLocationOption(location.id)}
                    >
                      <Ionicons 
                        name={location.selected ? "checkmark-circle" : "ellipse-outline"} 
                        size={20} 
                        color={location.selected ? colors.brand : colors.textMuted} 
                      />
                      <Text style={styles.locationLabel}>{location.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Nearby Localities - Show unselected locations */}
            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>Nearby Localities</Text>
              <View style={styles.locationList}>
                {unselectedLocations.map((location: any) => (
                  <TouchableOpacity
                    key={location.id}
                    style={styles.locationRow}
                    onPress={() => toggleLocationOption(location.id)}
                  >
                    <Ionicons 
                      name={location.selected ? "checkmark-circle" : "ellipse-outline"} 
                      size={20} 
                      color={location.selected ? colors.brand : colors.textMuted} 
                    />
                    <Text style={styles.locationLabel}>{location.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Apply Button - Only for Location */}
        <TouchableOpacity style={styles.locationApplyBtn} onPress={applyFilters}>
          <Text style={styles.locationApplyBtnText}>Apply</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPropertyTypes = () => (
    <View style={styles.contentSection}>
      <View style={styles.chipGrid}>
        {filters.propertyType.map((pt: any) => (
          <TouchableOpacity
            key={pt.id}
            style={[styles.typeChip, pt.selected && styles.typeChipActive]}
            onPress={() => handlePropertyTypeToggle(pt.id)}
          >
            <Text style={[styles.typeChipText, pt.selected && styles.typeChipTextActive]}>
              {pt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Clear Selection Button */}
      <TouchableOpacity style={styles.clearSelectionBtn}>
        <Text style={styles.clearSelectionBtnText}>Clear Selection</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMultiSelectContent = (key: string) => {
    const data = (filters as any)[key];
    if (!data || !data.options) return null;

    return (
      <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>{data.label}</Text>
        <View style={styles.chipGrid}>
          {data.options.map((opt: any) => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.optionChip, opt.selected && styles.optionChipActive]}
              onPress={() => toggleMultiSelect(key, opt.id)}
            >
              <Text style={[styles.optionChipText, opt.selected && styles.optionChipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Clear Selection Button */}
        <TouchableOpacity style={styles.clearSelectionBtn}>
          <Text style={styles.clearSelectionBtnText}>Clear Selection</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderArea = () => {
    const areaData = filters.area;
    const selectedUnit = areaData.units.find((u: any) => u.selected)?.label || 'sq.ft.';

    return (
      <View style={styles.contentSection}>
        {/* Unit Selector Dropdown */}
        <View style={styles.areaUnitSelector}>
          <TouchableOpacity 
            style={styles.areaUnitDropdown}
            onPress={() => setShowAreaUnitDropdown(!showAreaUnitDropdown)}
          >
            <Text style={styles.areaUnitLabel}>Size in <Text style={styles.areaUnitUnderline}>{selectedUnit}</Text></Text>
            <Ionicons name={showAreaUnitDropdown ? "chevron-up" : "chevron-down"} size={16} color={colors.textPrimary} />
          </TouchableOpacity>
          
          {/* Unit Options Dropdown */}
          {showAreaUnitDropdown && (
            <View style={styles.areaUnitOptions}>
              {areaData.units.map((unit: any) => (
                <TouchableOpacity
                  key={unit.id}
                  style={styles.areaUnitOption}
                  onPress={() => {
                    setFilters((prev: any) => ({
                      ...prev,
                      area: {
                        ...prev.area,
                        units: prev.area.units.map((u: any) => ({
                          ...u,
                          selected: u.id === unit.id
                        })),
                        selectedUnit: unit.id
                      }
                    }));
                    setShowAreaUnitDropdown(false);
                  }}
                >
                  <View style={[
                    styles.areaUnitRadio,
                    unit.selected && styles.areaUnitRadioSelected
                  ]}>
                    {unit.selected && <View style={styles.areaUnitRadioInner} />}
                  </View>
                  <Text style={[
                    styles.areaUnitOptionText,
                    unit.selected && styles.areaUnitOptionTextSelected
                  ]}>
                    {unit.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Min/Max Input Boxes */}
        <View style={styles.areaInputContainer}>
          <View style={styles.areaInputBox}>
            <Text style={styles.areaInputLabel}>MIN</Text>
            <Text style={styles.areaInputValue}>₹ NA</Text>
          </View>
          <Text style={styles.areaInputSeparator}>-</Text>
          <View style={styles.areaInputBox}>
            <Text style={styles.areaInputLabel}>MAX</Text>
            <Text style={styles.areaInputValue}>₹ NA</Text>
          </View>
        </View>

        {/* Min/Max Header */}
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetHeaderText}></Text>
          <Text style={styles.budgetHeaderText}></Text>
        </View>

        {/* Area Options - Two Columns */}
        <View style={styles.budgetContainer}>
          {/* Min Column */}
          <View style={styles.budgetColumn}>
            {areaData.minOptions.map((option: any) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.budgetChip,
                  option.selected && styles.budgetChipSelected
                ]}
                onPress={() => {
                  setFilters((prev: any) => ({
                    ...prev,
                    area: {
                      ...prev.area,
                      minOptions: prev.area.minOptions.map((opt: any) =>
                        opt.id === option.id ? { ...opt, selected: !opt.selected } : { ...opt, selected: false }
                      )
                    }
                  }));
                }}
              >
                {option.selected && (
                  <Ionicons name="checkmark-circle" size={18} color={colors.brand} style={styles.budgetChipIcon} />
                )}
                <Text style={[
                  styles.budgetChipText,
                  option.selected && styles.budgetChipTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Max Column */}
          <View style={styles.budgetColumn}>
            {areaData.maxOptions.map((option: any) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.budgetChip,
                  option.selected && styles.budgetChipSelected
                ]}
                onPress={() => {
                  setFilters((prev: any) => ({
                    ...prev,
                    area: {
                      ...prev.area,
                      maxOptions: prev.area.maxOptions.map((opt: any) =>
                        opt.id === option.id ? { ...opt, selected: !opt.selected } : { ...opt, selected: false }
                      )
                    }
                  }));
                }}
              >
                {option.selected && (
                  <Ionicons name="checkmark-circle" size={18} color={colors.brand} style={styles.budgetChipIcon} />
                )}
                <Text style={[
                  styles.budgetChipText,
                  option.selected && styles.budgetChipTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Clear Selection Button */}
        <View style={styles.budgetClearContainer}>
          <TouchableOpacity
            style={styles.budgetClearBtn}
            onPress={() => {
              setFilters((prev: any) => ({
                ...prev,
                area: {
                  ...prev.area,
                  minOptions: prev.area.minOptions.map((opt: any) => ({
                    ...opt,
                    selected: opt.id === 'no-min'
                  })),
                  maxOptions: prev.area.maxOptions.map((opt: any) => ({
                    ...opt,
                    selected: opt.id === 'no-max'
                  }))
                }
              }));
            }}
          >
            <Text style={styles.budgetClearBtnText}>Clear Selection</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderRange = (key: string) => {
    const data = (filters as any)[key];
    
    const formatAreaDisplay = (value: number) => {
      if (!value) return '';
      return Math.floor(value).toString();
    };

    const parseAreaInput = (text: string) => {
      const cleanText = text.replace(/[^0-9.]/g, '');
      return Math.floor(parseFloat(cleanText) || 0);
    };

    const maxValue = key === 'area' ? 10000 : 50000000;

    return (
      <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>{data.label}</Text>
        
        {/* Area Input Boxes */}
        <View style={styles.rangeInputContainer}>
          <View style={styles.rangeInputBox}>
            <Text style={styles.rangeInputLabel}>MIN</Text>
            <TextInput
              style={styles.rangeInputValue}
              value={formatAreaDisplay(data.min)}
              keyboardType="numeric"
              onChangeText={(text) => {
                const value = parseAreaInput(text);
                setFilters((prev: any) => ({
                  ...prev,
                  [key]: { 
                    ...prev[key], 
                    min: Math.min(value, data.max - 1)
                  }
                }));
              }}
            />
          </View>
          <Text style={styles.rangeSeparator}>-</Text>
          <View style={styles.rangeInputBox}>
            <Text style={styles.rangeInputLabel}>MAX</Text>
            <TextInput
              style={styles.rangeInputValue}
              value={formatAreaDisplay(data.max)}
              keyboardType="numeric"
              onChangeText={(text) => {
                const value = parseAreaInput(text);
                setFilters((prev: any) => ({
                  ...prev,
                  [key]: { 
                    ...prev[key], 
                    max: Math.max(value, data.min + 1)
                  }
                }));
              }}
            />
          </View>
        </View>

        {/* Multi-Thumb Range Slider */}
        <View style={styles.multiSliderContainer}>
          <MultiSlider
            values={[data.min, data.max]}
            sliderLength={width - SIDEBAR_WIDTH - 80}
            onValuesChange={(values) => {
              setFilters((prev: any) => ({
                ...prev,
                [key]: { 
                  ...prev[key], 
                  min: Math.floor(values[0]),
                  max: Math.floor(values[1])
                }
              }));
            }}
            min={0}
            max={maxValue}
            step={100} // 100 sq.ft. steps
            allowOverlap={false}
            snapped={true}
            markerStyle={{
              height: 24,
              width: 24,
              borderRadius: 12,
              backgroundColor: colors.brand,
              borderColor: colors.white,
              borderWidth: 2,
            }}
            pressedMarkerStyle={{
              height: 28,
              width: 28,
              borderRadius: 14,
            }}
            selectedStyle={{
              backgroundColor: colors.brand,
            }}
            unselectedStyle={{
              backgroundColor: colors.border,
            }}
            trackStyle={{
              height: 4,
              borderRadius: 2,
            }}
          />
          
          {/* Value Labels */}
          <View style={styles.multiSliderLabels}>
            <Text style={styles.multiSliderLabel}>{formatAreaDisplay(data.min)}</Text>
            <Text style={styles.multiSliderLabel}>{formatAreaDisplay(data.max)}</Text>
          </View>
        </View>

        {/* Clear Selection Button */}
        <TouchableOpacity style={styles.clearSelectionBtn}>
          <Text style={styles.clearSelectionBtnText}>Clear Selection</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={closeFilter}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sort & Filters</Text>
        <TouchableOpacity onPress={resetFilters}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sort' && styles.tabActive]}
          onPress={() => setActiveTab('sort')}
        >
          <Text style={[styles.tabText, activeTab === 'sort' && styles.tabTextActive]}>Sort</Text>
          <Ionicons name="filter-outline" size={16} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'filter' && styles.tabActive]}
          onPress={() => setActiveTab('filter')}
        >
          <Text style={[styles.tabText, activeTab === 'filter' && styles.tabTextActive]}>Filter</Text>
          <MaterialCommunityIcons name="sort-ascending" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Sub-tabs (Residential/Commercial/Land) */}
      <View style={styles.subTabContainer}>
        <TouchableOpacity style={styles.subTabActive}>
          <Text style={styles.subTabTextActive}>Residential</Text>
          <MaterialIcons name="home" size={16} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.subTab}>
          <Text style={styles.subTabText}>Commercial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.subTab}>
          <Text style={styles.subTabText}>Land</Text>
        </TouchableOpacity>
      </View>

      {/* Main Body */}
      <View style={styles.mainBody}>
        {renderSidebar()}
        <View style={styles.contentArea}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderContent()}
          </ScrollView>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.seeAllBtn}>
          <Text style={styles.seeAllBtnText}>See all 34K+ Properties</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  resetText: {
    ...typography.labelSmall,
    color: colors.brand,
    fontWeight: 'bold',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    margin: spacing.l,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.s,
    borderRadius: radius.sm,
    gap: 8,
  },
  tabActive: {
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  tabText: {
    ...typography.labelLarge,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },

  // Sub-tabs
  subTabContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.l,
    marginBottom: spacing.m,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: 4,
  },
  subTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.s,
    borderRadius: radius.sm,
    gap: 8,
  },
  subTabActive: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.s,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    ...shadows.card,
    gap: 8,
  },
  subTabText: {
    ...typography.labelSmall,
    color: colors.textMuted,
  },
  subTabTextActive: {
    ...typography.labelSmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },

  // Main Body
  mainBody: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  // Sidebar
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.background,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  sidebarItem: {
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.m,
    position: 'relative',
  },
  sidebarItemActive: {
    backgroundColor: colors.surface,
  },
  sidebarText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontSize: 11,
  },
  sidebarTextActive: {
    color: colors.brand,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '25%',
    height: '50%',
    width: 3,
    backgroundColor: colors.brand,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

  // Content Area
  contentArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  contentSection: {
    padding: spacing.l,
  },
  contentTitle: {
    ...typography.h4,
    marginBottom: spacing.m,
  },

  // Content styles
  quickFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.l,
  },
  quickFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    gap: 6,
  },
  quickFilterChipActive: {
    backgroundColor: '#E0F2FE', // Light sky blue color
    borderColor: colors.brand,
  },
  quickFilterText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  quickFilterTextActive: {
    fontSize: 12,
    color: colors.brand,
    fontWeight: '600',
  },

  quickFiltersSub: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.l,
  },

  optionGroup: {
    gap: spacing.l,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },

  clearSelection: {
    marginTop: spacing.xl,
  },
  clearSelectionText: {
    ...typography.labelSmall,
    color: colors.brand,
    textDecorationLine: 'underline',
  },

  // Location specific styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.m,
    marginBottom: spacing.l,
  },
  searchIcon: {
    marginRight: spacing.s,
  },
  searchInput: {
    flex: 1,
    height: 44,
    ...typography.body,
    color: colors.textPrimary,
  },
  locationSection: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    ...typography.h4,
    marginBottom: spacing.m,
    color: colors.textPrimary,
  },
  locationList: {
    gap: spacing.m,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: spacing.s,
  },
  locationLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  currentLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.m,
  },
  currentLocationText: {
    ...typography.body,
    color: colors.brand,
    fontWeight: '600',
  },

  // Range input styles
  rangeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  rangeInputBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.m,
  },
  rangeInputLabel: {
    ...typography.labelSmall,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  rangeInputValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 16,
  },
  rangeSeparator: {
    fontSize: 20,
    color: colors.textMuted,
    marginHorizontal: spacing.m,
  },

  // Unit selector styles
  unitSelectorContainer: {
    marginBottom: spacing.xl,
  },
  unitLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.s,
  },
  unitOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  unitOptionSelected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  unitOptionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  unitOptionTextSelected: {
    color: colors.white,
  },

  // Clear selection button styles
  clearSelectionBtn: {
    alignSelf: 'flex-start',
    marginTop: spacing.l,
  },
  clearSelectionBtnText: {
    ...typography.labelSmall,
    color: colors.primary,
    textDecorationLine: 'underline',
  },

  // Budget specific styles
  budgetValuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  budgetValueItem: {
    alignItems: 'center',
  },
  budgetValueLabel: {
    ...typography.labelSmall,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  budgetValueText: {
    ...typography.h3,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  sliderContainer: {
    marginBottom: spacing.xl,
  },
  sliderWrapper: {
    marginBottom: spacing.l,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    backgroundColor: colors.brand,
    borderRadius: 12,
  },
  sliderLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.s,
  },

  // Range slider styles (single slider with min/max)
  rangeSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  rangeSliderMinLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginRight: spacing.m,
    minWidth: 60,
  },
  rangeSlider: {
    flex: 1,
    height: 40,
  },
  rangeSliderMaxLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginLeft: spacing.m,
    minWidth: 60,
    textAlign: 'right',
  },

  // Dual slider styles (two separate sliders for min and max)
  dualSliderContainer: {
    marginBottom: spacing.xl,
  },
  singleSliderContainer: {
    marginBottom: spacing.l,
  },

  // Multi-slider styles (proper dual-thumb slider)
  multiSliderContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.m,
  },
  multiSliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.m,
  },
  multiSliderLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  // Area Unit Selector styles
  areaUnitSelector: {
    marginBottom: spacing.m,
    zIndex: 10,
  },
  areaUnitDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  areaUnitLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  areaUnitUnderline: {
    textDecorationLine: 'underline',
  },
  areaUnitOptions: {
    marginTop: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    ...shadows.card,
    padding: spacing.m,
  },
  areaUnitOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s,
    gap: spacing.m,
  },
  areaUnitRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaUnitRadioSelected: {
    borderColor: colors.brand,
  },
  areaUnitRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.brand,
  },
  areaUnitOptionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  areaUnitOptionTextSelected: {
    color: colors.brand,
    fontWeight: '600',
  },

  // Area Input Box styles
  areaInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  areaInputBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.m,
    backgroundColor: colors.surface,
  },
  areaInputLabel: {
    ...typography.labelSmall,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  areaInputValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  areaInputSeparator: {
    fontSize: 20,
    color: colors.textMuted,
    marginHorizontal: spacing.m,
  },

  // Budget styles - Two Column Layout
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.m,
    marginBottom: spacing.m,
  },
  budgetHeaderText: {
    ...typography.labelSmall,
    color: colors.textMuted,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.m,
  },
  budgetColumn: {
    flex: 1,
    gap: spacing.s,
  },
  budgetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  budgetChipSelected: {
    backgroundColor: colors.brandLight,
    borderColor: colors.brand,
  },
  budgetChipIcon: {
    marginRight: spacing.xs,
  },
  budgetChipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  budgetChipTextSelected: {
    color: colors.brand,
    fontWeight: '600',
  },
  budgetClearContainer: {
    marginTop: spacing.xl,
    alignItems: 'flex-start',
  },
  budgetClearBtn: {
    paddingVertical: spacing.xs,
  },
  budgetClearBtnText: {
    ...typography.body,
    color: colors.brand,
    textDecorationLine: 'underline',
  },

  // BHK styles - Pill/Chip Layout
  bhkContainer: {
    gap: spacing.m,
  },
  bhkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignSelf: 'flex-start',
  },
  bhkChipSelected: {
    backgroundColor: colors.brandLight,
    borderColor: colors.brand,
  },
  bhkChipIcon: {
    marginRight: spacing.s,
  },
  bhkChipText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  bhkChipTextSelected: {
    color: colors.brand,
    fontWeight: '600',
  },
  bhkClearContainer: {
    marginTop: spacing.xl,
    alignItems: 'flex-start',
  },
  bhkClearBtn: {
    paddingVertical: spacing.xs,
  },
  bhkClearBtnText: {
    ...typography.body,
    color: colors.brand,
    textDecorationLine: 'underline',
  },

    // Amenities styles - Pill/Chip Layout
  amenitiesContainer: {
    gap: spacing.m,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignSelf: 'flex-start',
  },
  amenityChipSelected: {
    backgroundColor: colors.brandLight,
    borderColor: colors.brand,
  },
  amenityChipIcon: {
    marginRight: spacing.s,
  },
  amenityChipText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  amenityChipTextSelected: {
    color: colors.brand,
    fontWeight: '600',
  },
  amenitiesClearContainer: {
    marginTop: spacing.xl,
    alignItems: 'flex-start',
  },
  amenitiesClearBtn: {
    paddingVertical: spacing.xs,
  },
  amenitiesClearBtnText: {
    ...typography.body,
    color: colors.brand,
    textDecorationLine: 'underline',
  },

  // Construction Status styles - Pill/Chip Layout
  constructionMainOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.m,
    marginBottom: spacing.l,
  },
  constructionMainChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  constructionMainChipSelected: {
    backgroundColor: colors.brandLight,
    borderColor: colors.brand,
  },
  constructionMainChipIcon: {
    marginRight: spacing.s,
  },
  constructionMainChipText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  constructionMainChipTextSelected: {
    color: colors.brand,
    fontWeight: '600',
  },
  constructionSubCategory: {
    marginTop: spacing.m,
    marginBottom: spacing.m,
  },
  constructionSubCategoryLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  constructionSubOptions: {
    gap: spacing.m,
  },
  constructionSubChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignSelf: 'flex-start',
  },
  constructionSubChipSelected: {
    backgroundColor: colors.brandLight,
    borderColor: colors.brand,
  },
  constructionSubChipIcon: {
    marginRight: spacing.s,
  },
  constructionSubChipText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  constructionSubChipTextSelected: {
    color: colors.brand,
    fontWeight: '600',
  },
  constructionStatusClearContainer: {
    marginTop: spacing.xl,
    alignItems: 'flex-start',
  },
  constructionStatusClearBtn: {
    paddingVertical: spacing.xs,
  },
  constructionStatusClearBtnText: {
    ...typography.body,
    color: colors.brand,
    textDecorationLine: 'underline',
  },
  budgetOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  budgetOptionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  budgetOptionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipActive: {
    backgroundColor: colors.brandLight,
    borderColor: colors.brand,
  },
  typeChipText: {
    ...typography.body,
  },
  typeChipTextActive: {
    color: colors.brand,
    fontWeight: '700',
  },

  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionChipActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  optionChipText: {
    ...typography.bodySmall,
  },
  optionChipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },

  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rangeInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.m,
  },
  rangeDash: {
    width: 8,
    height: 1,
    backgroundColor: colors.textMuted,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    padding: spacing.l,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  saveBtn: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveBtnText: {
    ...typography.labelSmall,
    color: colors.textPrimary,
  },
  seeAllBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.brand,
    paddingVertical: 12,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  seeAllBtnText: {
    ...typography.buttonSmall,
    color: colors.white,
  },

  // Location specific Apply button
  locationApplyBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.brand,
    paddingVertical: 14,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  locationApplyBtnText: {
    ...typography.buttonSmall,
    color: colors.white,
    fontWeight: '600',
  },
});