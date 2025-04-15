import React from "react";
import { ViewStyle, TextStyle } from "react-native";
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
declare const MonthYearDropdown: React.FC<MonthYearDropdownProps>;
export default MonthYearDropdown;
