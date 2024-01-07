import {Grid} from "@mui/material";
import toolbarIconList from './toolbarIconList.js'
// @ts-ignore
import useOnClickListener from "../../customHooks/useOnClickListener/useOnClickListener.tsx";

const Toolbar = () => {
    const {onClick} = useOnClickListener()
    return (
        <Grid
            container
            justifyContent="space-between"
            spacing={2}
            alignItems="center"
            sx={{ background: "white", py: 3, px: 0.5 }}
        >
            {toolbarIconList.map((plugin) => (
                <Grid
                    key={plugin.id}
                    sx={{
                        cursor: "pointer",
                    }}
                    item
                >
                    {
                        <plugin.Icon
                            onClick={() => onClick(plugin.event)}
                            sx={plugin.iconSx}
                        />
                    }
                </Grid>
            ))}
        </Grid>
    );
};

export default Toolbar;