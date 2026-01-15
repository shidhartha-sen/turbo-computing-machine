/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#00654E',
                    dark: '#004D3B',
                    light: '#007D5E',
                },
                accent: {
                    yellow: '#F4C430',
                    gold: '#D4AF37',
                },
                background: {
                    DEFAULT: '#F5F5F5',
                    card: '#FFFFFF',
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
            },
            fontSize: {
                h1: ['28px', { lineHeight: '36px', fontWeight: '700' }],
                h2: ['24px', { lineHeight: '32px', fontWeight: '600' }],
                h3: ['20px', { lineHeight: '28px', fontWeight: '600' }],
                body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
                'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
                caption: ['12px', { lineHeight: '16px', fontWeight: '400' }],
                button: ['16px', { lineHeight: '24px', fontWeight: '600' }],
                price: ['20px', { lineHeight: '28px', fontWeight: '700' }],
                badge: ['12px', { lineHeight: '16px', fontWeight: '600' }],
            },
        },
    },
    plugins: [],
};