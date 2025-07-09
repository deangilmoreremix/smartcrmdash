Here's the fixed version with all missing closing brackets added:

```javascript
// At the end of the Navbar component definition, add closing bracket:
  const renderBadge = (count: number, bgColor = 'bg-red-500') => {
    return (
      <span className={`absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 ${bgColor} text-[10px] font-medium text-white rounded-full`}>
        {count}
      </span>
    );
  };

  return (
    // ... rest of the JSX ...
  );
}; // Close Navbar component

// Add closing bracket for mainTabs useMemo:
], [handleNavigation, counters.activeDeals, counters.todayAppointments, aiTools.length]);

// Add closing bracket for the export default:
export default Navbar;
```

The main issues were:

1. Missing closing bracket for the Navbar component function
2. Missing closing bracket for the mainTabs useMemo array
3. Missing closing bracket for the export statement

The fixed structure properly closes all opened brackets and maintains the correct scope levels throughout the code.