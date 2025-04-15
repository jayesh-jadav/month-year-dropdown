var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useState, useRef, useCallback, useMemo, useEffect, } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, } from "react-native";
var MONTHS = [
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
var ITEM_HEIGHT = 50; // Estimated height of each list item
var MonthYearDropdown = function (_a) {
    var _b, _c;
    var _d = _a.mode, mode = _d === void 0 ? "month-year" : _d, _e = _a.startYear, startYear = _e === void 0 ? 2000 : _e, _f = _a.endYear, endYear = _f === void 0 ? new Date().getFullYear() + 10 : _f, _g = _a.style, style = _g === void 0 ? {} : _g, onSelect = _a.onSelect, onMonthSelect = _a.onMonthSelect, onYearSelect = _a.onYearSelect, _h = _a.showFullMonthName, showFullMonthName = _h === void 0 ? false : _h, _j = _a.sortOrder, sortOrder = _j === void 0 ? "desc" : _j, renderDropdownIcon = _a.renderDropdownIcon, formatMonthYear = _a.formatMonthYear, _k = _a.enableIndividualSelection, enableIndividualSelection = _k === void 0 ? false : _k, initialValue = _a.initialValue;
    // Determine initial selected value
    var getInitialSelected = function () {
        // If initialValue is provided, use it
        if (initialValue)
            return initialValue;
        // Otherwise, use current date based on mode
        return formatMonthYear
            ? formatMonthYear(new Date())
            : (function () {
                if (mode === "year") {
                    return "".concat(new Date().getFullYear());
                }
                return "".concat(MONTHS[new Date().getMonth()], " ").concat(new Date().getFullYear());
            })();
    };
    var _l = useState(false), isOpen = _l[0], setIsOpen = _l[1];
    var _m = useState(null), selectedMonth = _m[0], setSelectedMonth = _m[1];
    var _o = useState(null), selectedYear = _o[0], setSelectedYear = _o[1];
    var _p = useState("month"), currentSelectionMode = _p[0], setCurrentSelectionMode = _p[1];
    var _q = useState(getInitialSelected()), selected = _q[0], setSelected = _q[1];
    var dropdownRef = useRef(null);
    var listRef = useRef(null);
    var _r = useState({
        top: 0,
        left: 0,
        width: 0,
    }), dropdownPosition = _r[0], setDropdownPosition = _r[1];
    // Measure dropdown position
    var measureDropdown = function () {
        if (dropdownRef.current) {
            dropdownRef.current.measureInWindow(function (x, y, width, height) {
                setDropdownPosition({
                    top: y + height,
                    left: x,
                    width: width,
                });
            });
        }
    };
    // Generate options based on mode
    var generateOptions = useCallback(function () {
        var options = [];
        if (currentSelectionMode === "month") {
            options = MONTHS.map(function (month) {
                return showFullMonthName
                    ? month.replace(/^(.{3})/, function (match) { return match.charAt(0).toUpperCase() + match.slice(1); })
                    : month;
            });
        }
        else if (currentSelectionMode === "year") {
            options = Array.from({ length: endYear - startYear + 1 }, function (_, i) { return "".concat(sortOrder === "asc" ? startYear + i : endYear - i); });
        }
        return options;
    }, [currentSelectionMode, startYear, endYear, showFullMonthName, sortOrder]);
    var options = useMemo(generateOptions, [generateOptions]);
    // Find index of selected item
    var selectedIndex = options.findIndex(function (item) {
        return item ===
            (currentSelectionMode === "month"
                ? selectedMonth
                : currentSelectionMode === "year"
                    ? "".concat(selectedYear)
                    : item);
    });
    // Scroll to selected item when dropdown opens
    useEffect(function () {
        if (isOpen && selectedIndex !== -1 && listRef.current) {
            setTimeout(function () {
                var _a;
                (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndex({
                    index: selectedIndex,
                    viewPosition: 0.5, // Center the item
                });
            }, 100);
        }
    }, [isOpen, selectedIndex]);
    var handleSelect = function (value) {
        if (enableIndividualSelection) {
            if (currentSelectionMode === "month") {
                setSelectedMonth(value);
                onMonthSelect === null || onMonthSelect === void 0 ? void 0 : onMonthSelect(value);
                // If year is already selected, combine and call onSelect
                if (selectedYear) {
                    var combinedValue = "".concat(value, " ").concat(selectedYear);
                    setSelected(combinedValue);
                    onSelect === null || onSelect === void 0 ? void 0 : onSelect(combinedValue);
                }
                // Switch to year selection
                setCurrentSelectionMode("year");
            }
            else if (currentSelectionMode === "year") {
                var yearValue = parseInt(value);
                setSelectedYear(yearValue);
                onYearSelect === null || onYearSelect === void 0 ? void 0 : onYearSelect(yearValue);
                // If month is already selected, combine and call onSelect
                if (selectedMonth) {
                    var combinedValue = "".concat(selectedMonth, " ").concat(yearValue);
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
    var openDropdown = function () {
        measureDropdown();
        // Reset selection mode when opening dropdown
        if (enableIndividualSelection) {
            setCurrentSelectionMode("month");
            setSelectedMonth(null);
            setSelectedYear(null);
        }
        setIsOpen(true);
    };
    var styles = StyleSheet.create({
        container: __assign({ width: ((_b = style.container) === null || _b === void 0 ? void 0 : _b.width) || 150 }, style.container),
        dropdown: __assign({ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 32 }, style.dropdown),
        dropdownText: __assign({ fontSize: 16, color: "#333" }, style.dropdownText),
        caretIcon: __assign({ fontSize: 10, color: "#888", marginLeft: 5 }, style.caretIcon),
        modalContent: __assign({ position: "absolute", backgroundColor: "white", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 5, maxHeight: 200, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 }, style.modalContent),
        optionItem: __assign({ padding: 12, height: ITEM_HEIGHT, justifyContent: "center", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" }, style.optionItem),
        optionText: __assign({ fontSize: 16, color: "#333", textAlign: "center" }, style.optionText),
        selectedOptionItem: __assign({ backgroundColor: "#f0f0f0" }, style.selectedOptionItem),
        selectedOptionText: __assign({ fontWeight: "bold" }, style.selectedOptionText),
        modeIndicator: {
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: 10,
            color: "#666",
        },
    });
    var renderItem = function (_a) {
        var item = _a.item;
        return (React.createElement(TouchableOpacity, { style: [
                styles.optionItem,
                (currentSelectionMode === "month"
                    ? item === selectedMonth
                    : item === "".concat(selectedYear)) && styles.selectedOptionItem,
            ], onPress: function () { return handleSelect(item); } },
            React.createElement(Text, { style: [
                    styles.optionText,
                    (currentSelectionMode === "month"
                        ? item === selectedMonth
                        : item === "".concat(selectedYear)) && styles.selectedOptionText,
                ] }, item)));
    };
    return (React.createElement(View, { style: [
            styles.container,
            __assign({ width: ((_c = style.container) === null || _c === void 0 ? void 0 : _c.width) || 150 }, style.container),
        ] },
        React.createElement(TouchableOpacity, { ref: dropdownRef, style: styles.dropdown, onPress: openDropdown, activeOpacity: 0.6 },
            React.createElement(Text, { style: styles.dropdownText }, selected),
            React.createElement(View, { style: isOpen && { transform: [{ rotate: "180deg" }] } }, renderDropdownIcon ? (renderDropdownIcon()) : (React.createElement(Text, { style: styles.caretIcon }, " \u25BC")))),
        React.createElement(Modal, { transparent: true, visible: isOpen, animationType: "fade", onRequestClose: function () { return setIsOpen(false); } },
            React.createElement(TouchableOpacity, { style: { flex: 1 }, activeOpacity: 1, onPressOut: function () { return setIsOpen(false); } },
                React.createElement(View, { style: [
                        styles.modalContent,
                        {
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            width: dropdownPosition.width,
                        },
                    ] },
                    enableIndividualSelection && (React.createElement(Text, { style: styles.modeIndicator }, currentSelectionMode === "month"
                        ? "Select Month"
                        : "Select Year")),
                    React.createElement(FlatList, { ref: listRef, data: options, keyExtractor: function (item) { return item; }, renderItem: renderItem, getItemLayout: function (data, index) { return ({
                            length: ITEM_HEIGHT,
                            offset: ITEM_HEIGHT * index,
                            index: index,
                        }); }, initialScrollIndex: selectedIndex, initialNumToRender: 10, maxToRenderPerBatch: 20, windowSize: 10, removeClippedSubviews: true }))))));
};
export default MonthYearDropdown;
