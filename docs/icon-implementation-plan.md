## Icon Implementation Plan for SmartCRM Dashboard

This document outlines the steps needed to fix the current icon loading issues and implement a more robust icon system.

### Issues Identified

1. Failed loading of Lucide React icons: `/node_modules/lucide-react/dist/esm/icons/corner-left-up.js`
2. Incorrect icon props (`size` property not supported directly on Lucide SVG components)
3. Inconsistent icon usage across components

### Implementation Steps

1. **Run the Fix Script**
   ```bash
   node scripts/fix-lucide-icons.js
   ```

2. **Update the Navbar Component**
   - Replace direct Lucide icon imports with our new icon helper
   - Update all icon usage to use the `<Icon>` wrapper component
   - Make sure icon sizing is consistent

3. **Update AITools Icons**
   - Update `/src/utils/aiToolsData.ts` to use the new icon helper

4. **Update Components with Icon Issues**
   - Search for components using Lucide icons directly
   - Refactor to use our new icon helper component

5. **Testing**
   - Test all navigation items to ensure icons display correctly
   - Verify that dropdown menus show their icons properly
   - Check that AI Tools section renders correctly

### Code Examples

**Before:**
```tsx
import { ChevronDown, User, Bell } from 'lucide-react';

// Later in component:
<ChevronDown size={12} className="text-blue-500" />
```

**After:**
```tsx
import { Icon, Icons } from '../utils/icons';

// Later in component:
<Icon icon={Icons.ChevronDown} size={12} className="text-blue-500" />
```

### Component Priority List

1. Navbar.tsx - Primary navigation component with many icons
2. aiToolsData.ts - Central store for AI tool icons
3. Breadcrumbs.tsx - Navigation breadcrumbs component
4. Individual AI tool components under `/components/aiTools/`
5. UI components that use icons (buttons, panels, etc.)

### Post-Fix Verification

After implementing the fix:

1. Verify console has no icon-related errors
2. Check that all icons render correctly in light and dark modes
3. Test responsive layouts to ensure icons scale appropriately
4. Confirm that icon animations (if any) still function properly
