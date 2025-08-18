/**
 * SnakkaZ Chat - Cyberpunk Design Token System
 * Complete design consistency framework for liquid dream aesthetic
 */

export const CYBERPUNK_DESIGN_TOKENS = {
  colors: {
    // Primary cyberpunk palette
    primary: {
      cyan: "#0abdc6",
      pink: "#ea00d9",
      purple: "#711c91",
      yellow: "#f9c54e",
    },

    // Background hierarchy
    background: {
      dark: "#000b1e", // Deep void - primary background
      secondary: "#091833", // Secondary panels
      elevated: "#133e7c", // Elevated surfaces
      tertiary: "#0b2956", // Tertiary elements
      glass: "rgba(9, 24, 51, 0.2)", // Glassmorphism base
    },

    // Text hierarchy
    text: {
      primary: "#0abdc6", // Primary text - cyan
      secondary: "#057583", // Secondary text - muted cyan
      tertiary: "#012f3f", // Tertiary text - dark cyan
      white: "#ffffff", // Pure white for emphasis
      muted: "#64748b", // Muted gray
    },

    // Status colors
    status: {
      success: "#00ff87", // Neon green
      warning: "#ffa726", // Cyber orange
      error: "#ff5252", // Neon red
      info: "#29b6f6", // Cyber blue
    },

    // Interactive states
    interactive: {
      hover: "rgba(10, 189, 198, 0.1)",
      active: "rgba(10, 189, 198, 0.2)",
      focus: "rgba(10, 189, 198, 0.3)",
      disabled: "rgba(255, 255, 255, 0.05)",
    },
  },

  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    base: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
  },

  typography: {
    // Font families
    fonts: {
      primary: '"Advent Pro", "Barlow", system-ui, sans-serif',
      display: '"Rajdhani", "Orbitron", sans-serif',
      mono: '"Tomorrow", "Roboto Mono", "Cascadia Code", monospace',
      body: "system-ui, -apple-system, sans-serif",
    },

    // Responsive font scale
    scale: {
      xs: "clamp(0.75rem, 2vw, 0.875rem)", // 12-14px
      sm: "clamp(0.875rem, 2.5vw, 1rem)", // 14-16px
      base: "clamp(1rem, 3vw, 1.125rem)", // 16-18px
      lg: "clamp(1.125rem, 3.5vw, 1.25rem)", // 18-20px
      xl: "clamp(1.25rem, 4vw, 1.5rem)", // 20-24px
      "2xl": "clamp(1.5rem, 5vw, 2rem)", // 24-32px
      "3xl": "clamp(2rem, 6vw, 3rem)", // 32-48px
    },

    // Line heights
    leading: {
      tight: "1.2",
      normal: "1.5",
      relaxed: "1.75",
    },

    // Font weights
    weights: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      black: "900",
    },
  },

  effects: {
    // Glassmorphism variants
    glass: {
      light: {
        backdropFilter: "blur(8px) saturate(120%)",
        backgroundColor: "rgba(9, 24, 51, 0.1)",
        border: "1px solid rgba(10, 189, 198, 0.2)",
      },
      medium: {
        backdropFilter: "blur(16px) saturate(150%)",
        backgroundColor: "rgba(9, 24, 51, 0.2)",
        border: "1px solid rgba(10, 189, 198, 0.3)",
      },
      heavy: {
        backdropFilter: "blur(24px) saturate(180%)",
        backgroundColor: "rgba(9, 24, 51, 0.3)",
        border: "1px solid rgba(10, 189, 198, 0.4)",
      },
    },

    // Neon glow effects
    neon: {
      text: {
        cyan: `
          0 0 7px #fff,
          0 0 10px #fff,
          0 0 21px #fff,
          0 0 42px #0abdc6,
          0 0 82px #0abdc6,
          0 0 92px #0abdc6,
          0 0 102px #0abdc6,
          0 0 151px #0abdc6
        `,
        pink: `
          0 0 7px #fff,
          0 0 10px #fff,
          0 0 21px #fff,
          0 0 42px #ea00d9,
          0 0 82px #ea00d9,
          0 0 92px #ea00d9,
          0 0 102px #ea00d9,
          0 0 151px #ea00d9
        `,
        purple: `
          0 0 7px #fff,
          0 0 10px #fff,
          0 0 21px #fff,
          0 0 42px #711c91,
          0 0 82px #711c91,
          0 0 92px #711c91,
          0 0 102px #711c91,
          0 0 151px #711c91
        `,
        yellow: `
          0 0 7px #fff,
          0 0 10px #fff,
          0 0 21px #fff,
          0 0 42px #f9c54e,
          0 0 82px #f9c54e,
          0 0 92px #f9c54e,
          0 0 102px #f9c54e,
          0 0 151px #f9c54e
        `,
      },
      box: {
        cyan: `
          0 0 20px rgba(10, 189, 198, 0.3),
          0 0 40px rgba(10, 189, 198, 0.2),
          0 0 80px rgba(10, 189, 198, 0.1)
        `,
        pink: `
          0 0 20px rgba(234, 0, 217, 0.3),
          0 0 40px rgba(234, 0, 217, 0.2),
          0 0 80px rgba(234, 0, 217, 0.1)
        `,
        purple: `
          0 0 20px rgba(113, 28, 145, 0.3),
          0 0 40px rgba(113, 28, 145, 0.2),
          0 0 80px rgba(113, 28, 145, 0.1)
        `,
        yellow: `
          0 0 20px rgba(249, 197, 78, 0.3),
          0 0 40px rgba(249, 197, 78, 0.2),
          0 0 80px rgba(249, 197, 78, 0.1)
        `,
      },
    },

    // Gradients
    gradients: {
      cyberpunk: "linear-gradient(135deg, #0abdc6, #ea00d9)",
      liquid: "linear-gradient(135deg, #0abdc6, #711c91, #ea00d9)",
      dark: "linear-gradient(135deg, #000b1e, #091833)",
      glass:
        "linear-gradient(135deg, rgba(9, 24, 51, 0.1), rgba(19, 62, 124, 0.1))",
    },
  },

  animation: {
    // Duration presets
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
      slower: "800ms",
    },

    // Easing functions
    easing: {
      linear: "linear",
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
      cyberpunk: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      liquid: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  layout: {
    // Border radius scale
    radius: {
      none: "0",
      sm: "4px",
      base: "8px",
      lg: "12px",
      xl: "16px",
      "2xl": "24px",
      full: "9999px",
    },

    // Z-index scale
    zIndex: {
      behind: -1,
      auto: "auto",
      base: 0,
      dropdown: 1000,
      sticky: 1020,
      overlay: 1030,
      modal: 1040,
      popover: 1050,
      tooltip: 1060,
      toast: 1070,
    },

    // Container sizes
    containers: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
} as const;

// Type-safe token access
export type DesignTokens = typeof CYBERPUNK_DESIGN_TOKENS;
export type ColorTokens = DesignTokens["colors"];
export type SpacingTokens = DesignTokens["spacing"];
export type TypographyTokens = DesignTokens["typography"];
export type EffectTokens = DesignTokens["effects"];
