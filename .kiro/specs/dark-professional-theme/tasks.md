# Implementation Plan

- [x] 1. Update background and color system




  - [ ] 1.1 Update HomePage background gradient to use darker slate tones
    - Change background from current gradient to `from-slate-900 via-slate-950 to-[#020617]`


    - Ensure smooth gradient transition
    - _Requirements: 1.1, 1.4_


  - [ ] 1.2 Reduce gradient orb opacity for subtler effects
    - Update GradientOrb components to use opacity range 0.05-0.15
    - Adjust blur and scale values for more refined appearance


    - _Requirements: 3.1_
  - [ ] 1.3 Write property test for gradient orb opacity
    - **Property 2: Gradient Orb Opacity Range**




    - **Validates: Requirements 3.1**
  - [x] 1.4 Reduce floating particle visibility


    - Lower particle opacity to 0.3-0.4 range
    - Adjust animation timing for smoother effect
    - _Requirements: 3.4_


- [ ] 2. Refine hero section styling
  - [x] 2.1 Update hero headline typography

    - Apply refined gradient text effect with emerald-400 to cyan-400

    - Ensure proper font weight and tracking




    - _Requirements: 2.1, 5.1_
  - [x] 2.2 Update CTA button styling

    - Primary button: `from-emerald-600 to-cyan-600` with refined shadow
    - Secondary button: `bg-slate-800/60` with subtle border
    - Add smooth hover transitions

    - _Requirements: 5.2_
  - [ ] 2.3 Refine trust indicators styling
    - Use muted icon colors (emerald-400, amber-400, cyan-400)
    - Apply slate-400 text color for labels
    - _Requirements: 5.3_
  - [x] 2.4 Update hero visual cards (JD and Resume cards)





    - Apply refined dark backgrounds with subtle borders
    - Reduce glow effects for professional appearance

    - _Requirements: 5.4_

- [x] 3. Update feature cards styling

  - [x] 3.1 Refine feature card backgrounds and borders

    - Update to `bg-slate-900/80` with `border-slate-700/50`
    - Add subtle backdrop blur


    - _Requirements: 4.1_

  - [ ] 3.2 Update feature card hover effects
    - Reduce glow intensity to `rgba(16,185,129,0.1)`

    - Add smooth scale transition (1.02)

    - _Requirements: 4.2_
  - [ ] 3.3 Refine feature card icon styling
    - Use muted accent colors for icon backgrounds
    - Ensure consistent sizing (w-6 h-6)
    - _Requirements: 4.3_
  - [x] 3.4 Update accent styles object for all card variants




    - Reduce overlay opacity values

    - Refine border and shadow colors
    - _Requirements: 4.1, 4.4_





- [ ] 4. Update stats section styling
  - [ ] 4.1 Refine stat card backgrounds and borders
    - Apply `bg-slate-900/60` with `border-slate-700/40`
    - Add subtle gradient accent backgrounds
    - _Requirements: 6.2_
  - [ ] 4.2 Update stat number typography
    - Use `text-3xl font-bold` for numbers
    - Apply white color for emphasis
    - _Requirements: 6.3_
  - [ ] 4.3 Refine stat supporting text
    - Use slate-400 for labels
    - Use slate-500 for microcopy
    - _Requirements: 6.4_

- [ ] 5. Typography and spacing refinements
  - [ ] 5.1 Update text color hierarchy throughout
    - Headings: white
    - Body text: slate-300
    - Secondary text: slate-400
    - _Requirements: 1.2_
  - [ ] 5.2 Ensure consistent line heights
    - Body text: leading-relaxed (1.625)
    - Headings: leading-tight (1.25)
    - _Requirements: 2.2_
  - [ ] 5.3 Write property test for line height consistency
    - **Property 1: Line Height Consistency**
    - **Validates: Requirements 2.2**

- [ ] 6. Final polish and integration
  - [ ] 6.1 Update badge styling in hero section
    - Use refined emerald accent with subtle border
    - _Requirements: 1.3_
  - [ ] 6.2 Ensure Christmas mode compatibility
    - Verify theme toggle still works correctly
    - Maintain Christmas color overrides where appropriate
    - _Requirements: 1.1_
  - [ ] 6.3 Test responsive behavior across breakpoints
    - Verify mobile, tablet, and desktop layouts
    - Ensure typography scales appropriately
    - _Requirements: 2.4_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
