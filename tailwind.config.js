import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                // Menggunakan Inter sebagai font utama agar mirip seperti di foto referensi
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shine: {
                    '100%': { transform: 'translateX(100%)' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(-10px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            },
            animation: {
                // Konfigurasi class standar Tailwind (opsional jika kamu pakai arbitrary value di JSX)
                'fade-up': 'fadeUp 0.6s ease-out forwards',
                'shine': 'shine 1.2s ease-in-out infinite',
                'slide-in': 'slideIn 0.4s ease-out forwards',
                'fade-in': 'fadeIn 0.3s ease-out forwards',
            }
        },
    },

    plugins: [forms],
};