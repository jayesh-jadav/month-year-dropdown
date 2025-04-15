# rn-month-year-dropdown-picker

<div align="center">
  <h2 align="center">📽️ Demo</h2>
  <p align="center">
    <img
      src="https://raw.githubusercontent.com/jayesh-jadav/month-year-dropdown/main/Assets/demo.gif"
      width="300"
    />
  </p>
</div>

A simple and customizable month and year dropdown picker for React Native.

## ✨ Features

- Select Month and Year easily
- Fully customizable
- Supports both Android & iOS

---

## 📄 Example Usage

```jsx
import React, { useState } from "react";
import { View } from "react-native";
import MonthYearPicker from "rn-month-year-dropdown-picker";

const App = () => {
  const [fullDate, setFullDate] = useState(null);
  const now = new Date();

  return (
    <View>
      <MonthYearPicker
        enableIndividualSelection={true}
        onSelect={(fullDate) => {
          setFullDate(fullDate);
        }}
        startYear={2024}
        endYear={now.getFullYear()}
      />
    </View>
  );
};

export default App;
```

## 📦 Installation

```bash
npm install rn-month-year-dropdown-picker
# or
yarn add rn-month-year-dropdown-picker
```
