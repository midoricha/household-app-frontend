import { createTheme } from "@mui/material/styles";

// Import the CSS variables
import "./styles/variables.css";

const theme = createTheme({
    palette: {
        primary: {
            main: "#6a7d72", // var(--primary-sage)
            light: "#eef2ef", // var(--primary-sage-light)
            contrastText: "#ffffff", // var(--neutral-100)
        },
        secondary: {
            main: "#f2a68d", // var(--accent-peach)
            light: "#fcebe4", // var(--accent-peach-light)
            contrastText: "#262626", // var(--neutral-700)
        },
        error: {
            main: "#d00000", // var(--error)
        },
        warning: {
            main: "#f7b801", // var(--warning)
        },
        info: {
            main: "#0096c7", // var(--info)
        },
        success: {
            main: "#6a994e", // var(--success)
        },
        background: {
            default: "#f9f9f9", // var(--neutral-200)
            paper: "#ffffff", // var(--neutral-100)
        },
        text: {
            primary: "#525252", // var(--neutral-600)
            secondary: "#a3a3a3", // var(--neutral-500)
        },
    },
    typography: {
        fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
        h1: {
            fontFamily: 'Lora, serif',
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: 0.5,
            color: '#6a7d72',
        },
        h2: {
            fontFamily: 'Lora, serif',
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: 0.5,
            color: '#6a7d72',
        },
        h3: {
            fontFamily: 'Lora, serif',
            fontWeight: 700,
            fontSize: '1.5rem',
            color: '#262626',
        },
        h4: {
            fontFamily: 'Lora, serif',
            fontWeight: 700,
            fontSize: '1.25rem',
            color: '#6a7d72',
        },
        h5: {
            fontFamily: 'Lora, serif',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: '#262626',
        },
        h6: {
            fontFamily: 'Lora, serif',
            fontWeight: 700,
            fontSize: '1rem',
            color: '#262626',
        },
        body1: {
            fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
            fontWeight: 500,
            fontSize: '1rem',
        },
        body2: {
            fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
            fontWeight: 400,
            fontSize: '0.95rem',
        },
        button: {
            fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            letterSpacing: 0.2,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    padding: "0.75rem 1.5rem",
                    boxShadow: "none",
                    letterSpacing: 0.2,
                    transition: "background 0.2s, box-shadow 0.2s",
                },
                containedSecondary: {
                    backgroundColor: "#f2a68d",
                    color: "#3c503c",
                    boxShadow: "0 2px 8px 0 rgba(247, 197, 159, 0.10)",
                    "&:hover": {
                        backgroundColor: "#fcebe4",
                        color: "#3c503c",
                        boxShadow: "0 4px 16px 0 rgba(247, 197, 159, 0.18)",
                    },
                },
                outlinedSecondary: {
                    borderColor: "#f2a68d",
                    color: "#f2a68d",
                    backgroundColor: "#fff5ec",
                    "&:hover": {
                        backgroundColor: "#fcebe4",
                        borderColor: "#f2a68d",
                        color: "#3c503c",
                    },
                },
                containedError: {
                    backgroundColor: "#d00000",
                    color: "#fff",
                    "&:hover": {
                        backgroundColor: "#a30000",
                        color: "#fff",
                    },
                },
                outlinedError: {
                    borderColor: "#d00000",
                    color: "#d00000",
                    backgroundColor: "#fff5f5",
                    "&:hover": {
                        backgroundColor: "#ffeaea",
                        borderColor: "#d00000",
                        color: "#fff",
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: "#6a7d72", // var(--primary-sage)
                },
            },
        },
    },
});

export default theme;

