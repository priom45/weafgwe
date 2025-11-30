# Implementation Plan

- [x] 1. Create PageSidebar component with basic structure




  - [ ] 1.1 Create `src/components/navigation/PageSidebar.tsx` with TypeScript interfaces
    - Define `SidebarItem`, `SidebarSection`, and `PageSidebarProps` interfaces

    - Set up component skeleton with useState for isExpanded
    - _Requirements: 1.1, 1.2_
  - [ ] 1.2 Implement navigation items configuration
    - Create toolsSection with 6 tool items (JD-Based Optimizer, Guided Resume Builder, AI Mock Interview, Resume Score Check, Outreach Message Generator, Gaming Aptitude)
    - Create pagesSection with 3 page items (Tutorials, About Us, Contact Us)
    - Use Lucide icons matching existing Navigation.tsx patterns
    - _Requirements: 1.3, 1.4_
  - [x]* 1.3 Write property test for toggle state consistency

    - **Property 1: Toggle state consistency**
    - **Validates: Requirements 2.2, 2.5, 5.1**

- [x] 2. Implement collapsed and expanded states

  - [ ] 2.1 Build collapsed state UI (64px width)
    - Render icons only without labels
    - Add toggle button with right-pointing arrow (ChevronRight icon)
    - Add visual divider between Tools and Pages sections
    - _Requirements: 1.2, 2.1, 6.3_
  - [ ] 2.2 Build expanded state UI (240px width)
    - Render icons with text labels
    - Add toggle button with left-pointing arrow (ChevronLeft icon)
    - Add section labels "Tools" and "Pages"

    - _Requirements: 2.3, 2.4, 6.1, 6.2_
  - [ ]* 2.3 Write property test for section visibility based on state
    - **Property 5: Section visibility based on state**

    - **Validates: Requirements 6.1, 6.2, 6.3**

- [ ] 3. Add Framer Motion animations
  - [x] 3.1 Implement sidebar width animation

    - Use motion.aside with variants for collapsed (64px) and expanded (240px)
    - Apply 300ms duration with ease-out transition
    - _Requirements: 3.1_
  - [x] 3.2 Implement label fade animations

    - Add AnimatePresence for label visibility
    - Stagger label fade-in on expand
    - Fade out labels before width reduction on collapse

    - _Requirements: 3.2, 3.3_
  - [ ] 3.3 Implement arrow rotation animation
    - Rotate arrow icon 180 degrees on state change

    - _Requirements: 3.4_

- [ ] 4. Implement navigation and active state
  - [ ] 4.1 Add React Router navigation on item click
    - Use useNavigate hook for programmatic navigation
    - Navigate to item's configured path on click
    - _Requirements: 4.1_
  - [ ] 4.2 Implement active state indicator
    - Use useLocation to get current path
    - Apply active styling (emerald border-left, background) to matching item

    - _Requirements: 4.2_
  - [ ] 4.3 Add hover effects
    - Apply hover background and text color changes
    - _Requirements: 4.3_
  - [x]* 4.4 Write property test for navigation correctness

    - **Property 2: Navigation correctness**
    - **Validates: Requirements 4.1**
  - [ ]* 4.5 Write property test for active state indication
    - **Property 3: Active state indication**
    - **Validates: Requirements 4.2**

- [ ] 5. Implement tooltips for collapsed state
  - [x] 5.1 Add tooltip on hover for navigation items





    - Show item label as tooltip when sidebar is collapsed
    - Position tooltip to the right of the icon
    - _Requirements: 1.5_





- [ ] 6. Implement state persistence
  - [ ] 6.1 Add session storage for sidebar state
    - Save isExpanded state to sessionStorage on change
    - Read initial state from sessionStorage on mount
    - Default to collapsed (false) if no saved state
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ]* 6.2 Write property test for state persistence round-trip
    - **Property 4: State persistence round-trip**
    - **Validates: Requirements 5.1, 5.2**

- [ ] 7. Integrate sidebar into target pages
  - [ ] 7.1 Update Tutorials.tsx to include PageSidebar
    - Wrap content with flex layout
    - Add PageSidebar on the left
    - Adjust main content margin/padding
    - _Requirements: 1.1_
  - [ ] 7.2 Update AboutUs.tsx to include PageSidebar
    - Same layout pattern as Tutorials
    - _Requirements: 1.1_
  - [ ] 7.3 Update Contact.tsx to include PageSidebar
    - Same layout pattern as Tutorials
    - _Requirements: 1.1_

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Final polish and responsive behavior
  - [ ] 9.1 Add responsive handling
    - Hide sidebar on mobile (below lg breakpoint)
    - Ensure sidebar doesn't overlap with existing mobile navigation
    - _Requirements: 1.1_
  - [ ] 9.2 Add Christmas theme support
    - Apply Christmas colors when isChristmas is true (matching existing pattern)
    - _Requirements: 1.1_

- [ ] 10. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
