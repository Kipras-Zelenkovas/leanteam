/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "#374151",
                text: "#090435",
                primary: "#008038",
                "primary-light": "#78BE20",
                secondary: "#998fef",
                accent: "#4935fe",
            },
            borderWidth: {
                3: "3px",
            },
            width: {
                "1/10": "10%",
                "2/10": "20%",
                "3/10": "30%",
                "4/10": "40%",
                "5/10": "50%",
                "6/10": "60%",
                "7/10": "70%",
                "8/10": "80%",
                "9/10": "90%",
                "main-window": "calc(100% - 4rem)",
            },
            maxWidth: {
                "1/10": "10%",
                "2/10": "20%",
                "3/10": "30%",
                "4/10": "40%",
                "5/10": "50%",
                "6/10": "60%",
                "7/10": "70%",
                "8/10": "80%",
                "9/10": "90%",
                "main-window": "calc(100% - 4rem)",
            },
        },
    },
    plugins: [],
};
