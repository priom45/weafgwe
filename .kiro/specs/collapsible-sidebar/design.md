# Design Document: Collapsible Sidebar Navigation

## Overview

This feature implements a collapsible sidebar navigation component for the Tutorials, About Us, and Contact Us pages. The sidebar provides quick access to all main tools (JD-Based Optimizer, Guided Resume Builder, AI Mock Interview, Resume Score Check, Outreach Message Generator, Gaming Aptitude) and informational pages (Tutorials, About Us, Contact Us). It displays icons when collapsed and expands with smooth Framer Motion animations to show full labels when toggled.

## Architecture

The sidebar will be implemented as a reusable React component that integrates with the existing `DarkPageWrapper` component used by the target pages. The component will use:

- **React** for component structure and state management
- **Framer Motion** for smooth expand/collapse animations
- **React Router** for navigation
- **Lucide React** for consistent iconography (already used throughout the app)
- **Session Storage** for state persistence

```
┌─────────────────────────────────────────────────────────────┐
│                        Page Layout                          │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ Sidebar  │              Main Content                        │
│ (fixed)  │              (scrollable)                        │
│          │                                                  │
│ [Icons]  │                                                  │
│    or    │                                                  │
│ [Icons + │                                                  │
│  Labels] │                                                  │
│          │                                                  │
│ [Toggle] │                                                  │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

## Components and Interfaces

### PageSidebar Component

```typescript
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  requiresAuth?: boolean;
}

interface SidebarSection {
  id: string;
  label: string;
  items: SidebarItem[];
}

interface PageSidebarProps {
  currentPath: string;
}
```

### Component Structure

```
src/components/navigation/
├── PageSidebar.tsx        # Main sidebar component
└── SidebarItem.tsx        # Individual navigation item (optional)
```

### Integration Points

The sidebar will be integrated into:
- `src/components/pages/Tutorials.tsx`
- `src/components/pages/AboutUs.tsx`
- `src/components/pages/Contact.tsx`

Each page will wrap its content with a layout that includes the sidebar.

## Data Models

### Navigation Items Configuration

```typescript
const toolsSection: SidebarSection = {
  id: 'tools',
  label: 'Tools',
  items: [
    { id: 'optimizer', label: 'JD-Based Optimizer', icon: <Target />, path: '/optimizer' },
    { id: 'guided-builder', label: 'Guided Resume Builder', icon: <PlusCircle />, path: '/guided-builder' },
    { id: 'mock-interview', label: 'AI Mock Interview', icon: <MessageSquare />, path: '/mock-interview' },
    { id: 'score-checker', label: 'Resume Score Check', icon: <TrendingUp />, path: '/score-checker' },
    { id: 'linkedin-generator', label: 'Outreach Message Generator', icon: <MessageCircle />, path: '/linkedin-generator' },
    { id: 'gaming', label: 'Gaming Aptitude', icon: <Gamepad2 />, path: '/gaming' },
  ]
};

const pagesSection: SidebarSection = {
  id: 'pages',
  label: 'Pages',
  items: [
    { id: 'tutorials', label: 'Tutorials', icon: <BookOpen />, path: '/tutorials' },
    { id: 'about', label: 'About Us', icon: <Info />, path: '/about' },
    { id: 'contact', label: 'Contact Us', icon: <Phone />, path: '/contact' },
  ]
};
```

### State Model

```typescript
interface SidebarState {
  isExpanded: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Toggle state consistency
*For any* sidebar state (expanded or collapsed), clicking the toggle button SHALL result in the opposite state being displayed and persisted to session storage.
**Validates: Requirements 2.2, 2.5, 5.1**

### Property 2: Navigation correctness
*For any* navigation item click, the application SHALL navigate to the correct path corresponding to that item's configured route.
**Validates: Requirements 4.1**

### Property 3: Active state indication
*For any* page with the sidebar, the navigation item corresponding to the current URL path SHALL display the active visual indicator.
**Validates: Requirements 4.2**

### Property 4: State persistence round-trip
*For any* sidebar state change, storing to session storage and then retrieving SHALL return the same state value.
**Validates: Requirements 5.1, 5.2**

### Property 5: Section visibility based on state
*For any* sidebar in expanded state, section labels SHALL be visible; for collapsed state, section labels SHALL be hidden and a divider SHALL be visible.
**Validates: Requirements 6.1, 6.2, 6.3**

## Error Handling

| Error Scenario | Handling Strategy |
|----------------|-------------------|
| Session storage unavailable | Default to collapsed state, continue without persistence |
| Invalid stored state value | Reset to default collapsed state |
| Navigation failure | Let React Router handle with existing error boundaries |
| Missing icon component | Render placeholder or fallback icon |

## Testing Strategy

### Unit Testing

Unit tests will verify:
- Component renders correctly in both collapsed and expanded states
- Toggle button click changes state
- Navigation items render with correct icons and labels
- Active state is correctly applied based on current path
- Tooltips appear on hover in collapsed state

### Property-Based Testing

Using **fast-check** library for property-based testing:

1. **Toggle state consistency**: Generate random sequences of toggle actions and verify state always alternates correctly
2. **State persistence round-trip**: Generate random boolean states, store and retrieve, verify equality
3. **Active state indication**: Generate random paths from valid routes, verify correct item is marked active

Each property-based test will:
- Run minimum 100 iterations
- Be tagged with format: `**Feature: collapsible-sidebar, Property {number}: {property_text}**`
- Reference the correctness property from this design document

### Animation Testing

Manual verification of:
- Width transition smoothness (300ms duration)
- Label fade-in stagger effect on expand
- Label fade-out before width reduction on collapse
- Arrow rotation animation on toggle

## Visual Design

### Collapsed State (width: 64px)
```
┌────────┐
│  [→]   │  ← Toggle button (right arrow)
├────────┤
│  [🎯]  │  ← Tool icons
│  [📝]  │
│  [🎤]  │
│  [📊]  │
│  [💬]  │
│  [🎮]  │
├────────┤  ← Divider line
│  [📚]  │  ← Page icons
│  [ℹ️]  │
│  [📞]  │
└────────┘
```

### Expanded State (width: 240px)
```
┌──────────────────────────┐
│  [←]                     │  ← Toggle button (left arrow)
├──────────────────────────┤
│  TOOLS                   │  ← Section label
│  [🎯] JD-Based Optimizer │
│  [📝] Guided Resume...   │
│  [🎤] AI Mock Interview  │
│  [📊] Resume Score Check │
│  [💬] Outreach Message.. │
│  [🎮] Gaming Aptitude    │
├──────────────────────────┤
│  PAGES                   │  ← Section label
│  [📚] Tutorials          │
│  [ℹ️] About Us           │
│  [📞] Contact Us         │
└──────────────────────────┘
```

### Styling (matching existing dark theme)
- Background: `bg-slate-900/90 backdrop-blur-xl`
- Border: `border-r border-slate-800/70`
- Active item: `bg-emerald-500/20 text-emerald-400 border-l-2 border-emerald-400`
- Hover: `hover:bg-slate-800/50 hover:text-emerald-400`
- Section labels: `text-xs uppercase tracking-wider text-slate-500`
- Divider: `border-t border-slate-700/50`

### Animation Specifications (Framer Motion)

```typescript
// Sidebar width animation
const sidebarVariants = {
  collapsed: { width: 64 },
  expanded: { width: 240 }
};

// Label fade animation
const labelVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

// Arrow rotation
const arrowVariants = {
  collapsed: { rotate: 0 },
  expanded: { rotate: 180 }
};

// Transition config
const transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] // ease-out
};
```
