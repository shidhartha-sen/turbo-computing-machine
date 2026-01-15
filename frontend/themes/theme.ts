export const theme = {
    colors: {
        // main green usask green
        primary: {
            DEFAULT: '#00654E',
            dark: '#004D3B',
            light: '#007D5E',
        },
        // yellow 
        accent: {
            yellow: '#F4C430',
            gold: '#D4AF37',
        },
        background: {
            DEFAULT: '#F5F5F5',
            card: '#FFFFFF',
            overlay: 'rgba(0, 0, 0, 0.5)',
        },
        text: {
            primary: '#1A1A1A',
            secondary: '#666666',
            tertiary: '#999999',
            inverse: '#FFFFFF',
        },
        trade: {
            DEFAULT: '#3A8B8B',
            light: '#4FA5A5',
        },
        status: {
            success: '#00654E',
            error: '#D32F2F',
            warning: '#F4C430',
            info: '#2196F3',
        },
        border: {
            DEFAULT: '#E0E0E0',
            focus: '#00654E',
        },
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
    },
    borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        full: '9999px',
    },
    shadows: {
        card: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        button: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 5,
        },
    },
    typography: {
        h1: {
            fontSize: 28,
            fontWeight: '700',
            lineHeight: 36,
        },
        h2: {
            fontSize: 24,
            fontWeight: '600',
            lineHeight: 32,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600',
            lineHeight: 28,
        },
        body: {
            fontSize: 16,
            fontWeight: '400',
            lineHeight: 24,
        },
        bodySmall: {
            fontSize: 14,
            fontWeight: '400',
            lineHeight: 20,
        },
        caption: {
            fontSize: 12,
            fontWeight: '400',
            lineHeight: 16,
        },
        button: {
            fontSize: 16,
            fontWeight: '600',
            lineHeight: 24,
        },
        price: {
            fontSize: 20,
            fontWeight: '700',
            lineHeight: 28,
        },
        badge: {
            fontSize: 12,
            fontWeight: '600',
            lineHeight: 16,
            textTransform: 'uppercase' as const,
        },
    },
} as const;

export type Theme = typeof theme;