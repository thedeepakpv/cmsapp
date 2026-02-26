# Canteen Management System - Design Specification

## Overview
This document outlines the current design system, UI components, and styling conventions used in the Canteen Management System. The project primarily uses **React**, **Vite**, and **Material UI (MUI)**.

## 1. Color Palette (MUI Theme)
The application defines a custom Material UI theme mapping.
- **Primary Color:** `#6a1b9a` (Purple) - Used for the main Navbar (`AppBar`) and primary actions.
- **Secondary Color:** `#ff6f00` (Amber/Orange) - Used for secondary actions (e.g., "Add to cart" buttons).
- **Background Color:** `#f3e5f5` (Light Purple/Pink tint) - Set as the default background in the MUI theme.

## 2. Global CSS (`index.css` & `App.css`)
In addition to the MUI theme, there are global CSS rules for basic HTML elements:
- **Font Family:** `system-ui, Avenir, Helvetica, Arial, sans-serif`
- **Link Text:** `#646cff` (Hover: `#535bf2` or `#747bff` in light mode)
- **Base Body Background:** Dark mode (`#242424`) and Light mode (`#ffffff`) using `prefers-color-scheme`.
- **Base Text Color:** Dark mode (`rgba(255, 255, 255, 0.87)`) and Light mode (`#213547`).

## 3. UI Components Overview
The application relies heavily on Material UI components to maintain a consistent look and feel across all pages.

### Core Layout Components
- **Container (`<Container>`)**: Used to constrain page widths (e.g., `maxWidth="sm"` on the Start Page).
- **Box (`<Box>`)**: Used heavily as a utility wrapper for margins, paddings, and flexbox alignments (e.g., `textAlign="center"`, `mt={17}`).
- **AppBar & Toolbar (`<AppBar>`, `<Toolbar>`)**: Used in the `Navbar` component, adopting the primary color for background, with flex layouts to space titles and icon buttons.

### Typography (`<Typography>`)
- **Headers**: Use variants like `h4` and `h6`.
- **Body Text**: Use variants like `body1` and `body2`.
- **Colors**: Uses semantic colors like `text.secondary` alongside direct color assignments like `green` or `red` for item availability status.

### Buttons & Interactivity
- **MUI Buttons (`<Button>`)**:
  - `variant="contained"`: Used for primary calls to action (e.g., "Enter as User", "Add to cart").
  - `variant="outlined"`: Used for secondary paths (e.g., "Enter as Admin").
  - Takes advantage of the `fullWidth` property and semantic color props like `color="secondary"`.
- **Icon Buttons (`<IconButton>`)**: Employs `@mui/icons-material` (e.g., `AccountCircleIcon`, `ArrowBackIcon`, `ShoppingCartIcon`) with `color="inherit"`.

### Cards (`<Card>`)
- Heavily utilized for item display (e.g., `MenuCard`).
- Standard components used: `<CardMedia>` (for images), `<CardContent>`.
- **Interactive Styles (via `sx` prop):**
  - Base width: `250px`
  - Margin: `2` (MUI spacing unit)
  - CSS Transitions (`0.3s`) to animate hovering.
  - Scale transform on hover (`transform: "scale(1.03)"`).
  - **Dynamic Styling:** Colors and opacity dynamically shift based on item availability:
    - Available: Background `#e8f5e9` (Light green), opacity `1`.
    - Unavailable: Background `#fce4ec` (Light pink), opacity `0.5`, with buttons disabled.

## 4. Layout Strategy
- **Centering & Alignment:** Uses Flexbox and utility margins (`mt`, `mb`) on `Box` components to center content horizontally and vertically.
- **Routing:** `<Routes>` and `<Route>` from `react-router-dom` manage page transitions seamlessly.

## 5. Icons
The application uses standard Material UI Icons:
- **AccountCircleIcon**: User Profile navigation
- **ArrowBackIcon**: Go back navigation.
- **ShoppingCartIcon**: Cart page navigation.
