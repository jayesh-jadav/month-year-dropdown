import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ListRenderItemInfo,
} from "react-native";

// Types
export interface MonthYearDropdownProps {
  initialValue?: string;
  mode?: "month" | "year" | "month-year";
  startYear?: number;
  endYear?: number;

  style?: {
    container?: ViewStyle;
    dropdown?: ViewStyle;
    dropdownText?: TextStyle;
    caretIcon?: TextStyle;
    modalContent?: ViewStyle;
    optionItem?: ViewStyle;
    optionText?: TextStyle;
    selectedOptionItem?: ViewStyle;
    selectedOptionText?: TextStyle;
  };

  onSelect?: (value: string) => void;
  onMonthSelect?: (month: string) => void;
  onYearSelect?: (year: number) => void;
  renderDropdownIcon?: () => React.ReactNode;
  formatMonthYear?: (date: Date) => string;

  showFullMonthName?: boolean;
  sortOrder?: "asc" | "desc";
  enableIndividualSelection?: boolean;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ITEM_HEIGHT = 50; // Estimated height of each list item

const MonthYearDropdown: React.FC<MonthYearDropdownProps> = ({
  mode = "month-year",
  startYear = 2000,
  endYear = new Date().getFullYear() + 10,
  style = {},
  onSelect,
  onMonthSelect,
  onYearSelect,
  showFullMonthName = false,
  sortOrder = "desc",
  renderDropdownIcon,
  formatMonthYear,
  enableIndividualSelection = false,
  initialValue,
}) => {
  // Determine initial selected value
  const getInitialSelected = () => {
    // If initialValue is provided, use it
    if (initialValue) return initialValue;

    // Otherwise, use current date based on mode
    return formatMonthYear
      ? formatMonthYear(new Date())
      : (() => {
          if (mode === "year") {
            return `${new Date().getFullYear()}`;
          }
          return `${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`;
        })();
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentSelectionMode, setCurrentSelectionMode] = useState<
    "month" | "year"
  >("month");
  const [selected, setSelected] = useState<string>(getInitialSelected());
  const dropdownRef = useRef<any>(null);
  const listRef = useRef<FlatList>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // Measure dropdown position
  const measureDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.measureInWindow(
        (x: any, y: any, width: any, height: any) => {
          setDropdownPosition({
            top: y + height,
            left: x,
            width,
          });
        }
      );
    }
  };

  // Generate options based on mode
  const generateOptions = useCallback(() => {
    let options: string[] = [];

    if (currentSelectionMode === "month") {
      options = MONTHS.map((month) =>
        showFullMonthName
          ? month.replace(
              /^(.{3})/,
              (match) => match.charAt(0).toUpperCase() + match.slice(1)
            )
          : month
      );
    } else if (currentSelectionMode === "year") {
      options = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => `${sortOrder === "asc" ? startYear + i : endYear - i}`
      );
    }

    return options;
  }, [currentSelectionMode, startYear, endYear, showFullMonthName, sortOrder]);

  const options = useMemo(generateOptions, [generateOptions]);

  // Find index of selected item
  const selectedIndex = options.findIndex(
    (item) =>
      item ===
      (currentSelectionMode === "month"
        ? selectedMonth
        : currentSelectionMode === "year"
        ? `${selectedYear}`
        : item)
  );

  // Scroll to selected item when dropdown opens
  useEffect(() => {
    if (isOpen && selectedIndex !== -1 && listRef.current) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({
          index: selectedIndex,
          viewPosition: 0.5, // Center the item
        });
      }, 100);
    }
  }, [isOpen, selectedIndex]);

  const handleSelect = (value: string) => {
    if (enableIndividualSelection) {
      if (currentSelectionMode === "month") {
        setSelectedMonth(value);
        onMonthSelect?.(value);

        // If year is already selected, combine and call onSelect
        if (selectedYear) {
          const combinedValue = `${value} ${selectedYear}`;
          setSelected(combinedValue);
          onSelect?.(combinedValue);
        }

        // Switch to year selection
        setCurrentSelectionMode("year");
      } else if (currentSelectionMode === "year") {
        const yearValue = parseInt(value);
        setSelectedYear(yearValue);
        onYearSelect?.(yearValue);

        // If month is already selected, combine and call onSelect
        if (selectedMonth) {
          const combinedValue = `${selectedMonth} ${yearValue}`;
          setSelected(combinedValue);
          onSelect?.(combinedValue);
        }

        // Close dropdown if both month and year are selected
        if (selectedMonth) {
          setIsOpen(false);
        } else {
          // Switch back to month selection if no month selected
          setCurrentSelectionMode("month");
        }
      }
    } else {
      // Original single selection logic
      setSelected(value);
      setIsOpen(false);
      onSelect?.(value);
    }
  };

  const openDropdown = () => {
    measureDropdown();

    // Reset selection mode when opening dropdown
    if (enableIndividualSelection) {
      setCurrentSelectionMode("month");
      setSelectedMonth(null);
      setSelectedYear(null);
    }

    setIsOpen(true);
  };

  const styles = StyleSheet.create({
    container: {
      width: style.container?.width || 150,
      ...style.container,
    },
    dropdown: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 32,
      ...style.dropdown,
    },
    dropdownText: {
      fontSize: 16,
      color: "#333",
      ...style.dropdownText,
    },
    caretIcon: {
      fontSize: 10,
      color: "#888",
      marginLeft: 5,
      ...style.caretIcon,
    },
    modalContent: {
      position: "absolute",
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "#e0e0e0",
      borderRadius: 5,
      maxHeight: 200,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
      ...style.modalContent,
    },
    optionItem: {
      padding: 12,
      height: ITEM_HEIGHT,
      justifyContent: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
      ...style.optionItem,
    },
    optionText: {
      fontSize: 16,
      color: "#333",
      textAlign: "center",
      ...style.optionText,
    },
    selectedOptionItem: {
      backgroundColor: "#f0f0f0",
      ...style.selectedOptionItem,
    },
    selectedOptionText: {
      fontWeight: "bold",
      ...style.selectedOptionText,
    },
    modeIndicator: {
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: 10,
      color: "#666",
    },
  });

  const renderItem = ({ item }: ListRenderItemInfo<string>) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        (currentSelectionMode === "month"
          ? item === selectedMonth
          : item === `${selectedYear}`) && styles.selectedOptionItem,
      ]}
      onPress={() => handleSelect(item)}
    >
      <Text
        style={[
          styles.optionText,
          (currentSelectionMode === "month"
            ? item === selectedMonth
            : item === `${selectedYear}`) && styles.selectedOptionText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { width: style.container?.width || 150, ...style.container },
      ]}
    >
      <TouchableOpacity
        ref={dropdownRef}
        style={styles.dropdown}
        onPress={openDropdown}
        activeOpacity={0.6}
      >
        <Text style={styles.dropdownText}>{selected}</Text>
        <View style={isOpen && { transform: [{ rotate: "180deg" }] }}>
          {renderDropdownIcon ? (
            renderDropdownIcon()
          ) : (
            <Text style={styles.caretIcon}> ▼</Text>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isOpen}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPressOut={() => setIsOpen(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              },
            ]}
          >
            {enableIndividualSelection && (
              <Text style={styles.modeIndicator}>
                {currentSelectionMode === "month"
                  ? "Select Month"
                  : "Select Year"}
              </Text>
            )}
            <FlatList
              ref={listRef}
              data={options}
              keyExtractor={(item) => item}
              renderItem={renderItem}
              getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              initialScrollIndex={selectedIndex}
              initialNumToRender={10}
              maxToRenderPerBatch={20}
              windowSize={10}
              removeClippedSubviews={true}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MonthYearDropdown;
