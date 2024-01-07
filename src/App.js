import './App.css';
import {CssBaseline, Grid, ThemeProvider, Typography} from "@mui/material";
import Editor from "./components/editor/Editor.tsx";
import theme from "./theme";

function App() {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Grid container sx={{minHeight: "100vh"}} justifyContent="center" alignItems="center" flexDirection="column">
                <Grid item>
                    <Typography variant="h3" sx={{mb: 1}}>Lexical Editor App</Typography>
                </Grid>
                <Grid item xs={9} sx={{width: "100%"}}>
                    <Editor />
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default App;
