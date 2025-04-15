"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
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
const MonthYearDropdown = ({ mode = "month-year", startYear = 2000, endYear = new Date().getFullYear() + 10, style = {}, onSelect, onMonthSelect, onYearSelect, showFullMonthName = false, sortOrder = "desc", renderDropdownIcon, formatMonthYear, enableIndividualSelection = false, initialValue, }) => {
    var _a, _b;
    // Determine initial selected value
    const getInitialSelected = () => {
        // If initialValue is provided, use it
        if (initialValue)
            return initialValue;
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
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [selectedMonth, setSelectedMonth] = (0, react_1.useState)(null);
    const [selectedYear, setSelectedYear] = (0, react_1.useState)(null);
    const [currentSelectionMode, setCurrentSelectionMode] = (0, react_1.useState)("month");
    const [selected, setSelected] = (0, react_1.useState)(getInitialSelected());
    const dropdownRef = (0, react_1.useRef)(null);
    const listRef = (0, react_1.useRef)(null);
    const [dropdownPosition, setDropdownPosition] = (0, react_1.useState)({
        top: 0,
        left: 0,
        width: 0,
    });
    // Measure dropdown position
    const measureDropdown = () => {
        if (dropdownRef.current) {
            dropdownRef.current.measureInWindow((x, y, width, height) => {
                setDropdownPosition({
                    top: y + height,
                    left: x,
                    width,
                });
            });
        }
    };
    // Generate options based on mode
    const generateOptions = (0, react_1.useCallback)(() => {
        let options = [];
        if (currentSelectionMode === "month") {
            options = MONTHS.map((month) => showFullMonthName
                ? month.replace(/^(.{3})/, (match) => match.charAt(0).toUpperCase() + match.slice(1))
                : month);
        }
        else if (currentSelectionMode === "year") {
            options = Array.from({ length: endYear - startYear + 1 }, (_, i) => `${sortOrder === "asc" ? startYear + i : endYear - i}`);
        }
        return options;
    }, [currentSelectionMode, startYear, endYear, showFullMonthName, sortOrder]);
    const options = (0, react_1.useMemo)(generateOptions, [generateOptions]);
    // Find index of selected item
    const selectedIndex = options.findIndex((item) => item ===
        (currentSelectionMode === "month"
            ? selectedMonth
            : currentSelectionMode === "year"
                ? `${selectedYear}`
                : item));
    // Scroll to selected item when dropdown opens
    (0, react_1.useEffect)(() => {
        if (isOpen && selectedIndex !== -1 && listRef.current) {
            setTimeout(() => {
                var _a;
                (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndex({
                    index: selectedIndex,
                    viewPosition: 0.5, // Center the item
                });
            }, 100);
        }
    }, [isOpen, selectedIndex]);
    const handleSelect = (value) => {
        if (enableIndividualSelection) {
            if (currentSelectionMode === "month") {
                setSelectedMonth(value);
                onMonthSelect === null || onMonthSelect === void 0 ? void 0 : onMonthSelect(value);
                // If year is already selected, combine and call onSelect
                if (selectedYear) {
                    const combinedValue = `${value} ${selectedYear}`;
                    setSelected(combinedValue);
                    onSelect === null || onSelect === void 0 ? void 0 : onSelect(combinedValue);
                }
                // Switch to year selection
                setCurrentSelectionMode("year");
            }
            else if (currentSelectionMode === "year") {
                const yearValue = parseInt(value);
                setSelectedYear(yearValue);
                onYearSelect === null || onYearSelect === void 0 ? void 0 : onYearSelect(yearValue);
                // If month is already selected, combine and call onSelect
                if (selectedMonth) {
                    const combinedValue = `${selectedMonth} ${yearValue}`;
                    setSelected(combinedValue);
                    onSelect === null || onSelect === void 0 ? void 0 : onSelect(combinedValue);
                }
                // Close dropdown if both month and year are selected
                if (selectedMonth) {
                    setIsOpen(false);
                }
                else {
                    // Switch back to month selection if no month selected
                    setCurrentSelectionMode("month");
                }
            }
        }
        else {
            // Original single selection logic
            setSelected(value);
            setIsOpen(false);
            onSelect === null || onSelect === void 0 ? void 0 : onSelect(value);
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
    const styles = react_native_1.StyleSheet.create({
        container: Object.assign({ width: ((_a = style.container) === null || _a === void 0 ? void 0 : _a.width) || 150 }, style.container),
        dropdown: Object.assign({ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 32 }, style.dropdown),
        dropdownText: Object.assign({ fontSize: 16, color: "#333" }, style.dropdownText),
        caretIcon: Object.assign({ fontSize: 10, color: "#888", marginLeft: 5 }, style.caretIcon),
        modalContent: Object.assign({ position: "absolute", backgroundColor: "white", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 5, maxHeight: 200, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 }, style.modalContent),
        optionItem: Object.assign({ padding: 12, height: ITEM_HEIGHT, justifyContent: "center", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" }, style.optionItem),
        optionText: Object.assign({ fontSize: 16, color: "#333", textAlign: "center" }, style.optionText),
        selectedOptionItem: Object.assign({ backgroundColor: "#f0f0f0" }, style.selectedOptionItem),
        selectedOptionText: Object.assign({ fontWeight: "bold" }, style.selectedOptionText),
        modeIndicator: {
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: 10,
            color: "#666",
        },
    });
    const renderItem = ({ item }) => (<react_native_1.TouchableOpacity style={[
            styles.optionItem,
            (currentSelectionMode === "month"
                ? item === selectedMonth
                : item === `${selectedYear}`) && styles.selectedOptionItem,
        ]} onPress={() => handleSelect(item)}>
      <react_native_1.Text style={[
            styles.optionText,
            (currentSelectionMode === "month"
                ? item === selectedMonth
                : item === `${selectedYear}`) && styles.selectedOptionText,
        ]}>
        {item}
      </react_native_1.Text>
    </react_native_1.TouchableOpacity>);
    return (<react_native_1.View style={[
            styles.container,
            Object.assign({ width: ((_b = style.container) === null || _b === void 0 ? void 0 : _b.width) || 150 }, style.container),
        ]}>
      <react_native_1.TouchableOpacity ref={dropdownRef} style={styles.dropdown} onPress={openDropdown} activeOpacity={0.6}>
        <react_native_1.Text style={styles.dropdownText}>{selected}</react_native_1.Text>
        <react_native_1.View style={isOpen && { transform: [{ rotate: "180deg" }] }}>
          {renderDropdownIcon ? (renderDropdownIcon()) : (<react_native_1.Text style={styles.caretIcon}> ▼</react_native_1.Text>)}
        </react_native_1.View>
      </react_native_1.TouchableOpacity>

      <react_native_1.Modal transparent={true} visible={isOpen} animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <react_native_1.TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPressOut={() => setIsOpen(false)}>
          <react_native_1.View style={[
            styles.modalContent,
            {
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
            },
        ]}>
            {enableIndividualSelection && (<react_native_1.Text style={styles.modeIndicator}>
                {currentSelectionMode === "month"
                ? "Select Month"
                : "Select Year"}
              </react_native_1.Text>)}
            <react_native_1.FlatList ref={listRef} data={options} keyExtractor={(item) => item} renderItem={renderItem} getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
        })} initialScrollIndex={selectedIndex} initialNumToRender={10} maxToRenderPerBatch={20} windowSize={10} removeClippedSubviews={true}/>
          </react_native_1.View>
        </react_native_1.TouchableOpacity>
      </react_native_1.Modal>
    </react_native_1.View>);
};
exports.default = MonthYearDropdown;
