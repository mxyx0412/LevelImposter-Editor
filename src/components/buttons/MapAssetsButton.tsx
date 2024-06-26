import React from "react";
import MapAssetsModal from "../modals/MapAssets/MapAssetsModal";
import { useTranslation } from "react-i18next";
import { IconButton, Tooltip } from "@mui/material";
import { PermMedia } from "@mui/icons-material";

export default function MapAssetsButton() {
    const [isOpen, setIsOpen] = React.useState(false);
    const { t } = useTranslation();

    return (
        <>
            <Tooltip title={t("edit.mapAssets")}>
                <IconButton onClick={() => setIsOpen(true)}>
                    <PermMedia />
                </IconButton>
            </Tooltip>

            <MapAssetsModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}