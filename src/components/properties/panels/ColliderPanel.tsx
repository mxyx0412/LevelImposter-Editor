import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelectedColliderID } from "../../../hooks/elements/colliders/useSelectedCollider";
import useSelectedElem from "../../../hooks/elements/useSelectedElem";
import generateGUID from "../../../utils/generateGUID";
import ColliderEditorPanel from "../editors/ColliderEditorPanel";
import DropdownList from "../util/DropdownList";
import MapError from "../util/MapError";
import PanelContainer from "../util/PanelContainer";

const BLACKLISTED_TYPES = [
    "util-dummy",
    "util-meeting",
    "util-triggerrepeat",
    "util-triggertimer",
    "util-triggerstart",
    "util-triggerrand",
    "util-minimap",
    "util-minimapsprite",
    "util-layer",
    "util-spawn1",
    "util-spawn2",
    "util-sabotages",
];

const SOLID_ONLY_TYPES = [
    "util-room",
    "util-sound1",
    "util-sound2",
    "util-tele",
    "util-triggerarea",
    "util-triggersound",
    "util-decontamination"
];

const SHADOW_ONLY_TYPES = [
    "util-onewaycollider"
];

const EDGE_ONLY_TYPES = [
    "util-binocularscollider",
    "util-ghostcollider",
];

const SINGULAR_TYPES = [
    "util-room",
    "util-sound2",
    "util-decontamination"
];

export default function ColliderPanel() {
    const { t } = useTranslation();
    const [selectedElem, setSelectedElem] = useSelectedElem();
    const [selectedColliderID, setSelectedColliderID] = useSelectedColliderID();

    const isSolidOnly = React.useMemo(() => {
        return SOLID_ONLY_TYPES.includes(selectedElem?.type || "");
    }, [selectedElem?.type]);

    const isShadowOnly = React.useMemo(() => {
        return SHADOW_ONLY_TYPES.includes(selectedElem?.type || "");
    }, [selectedElem?.type]);

    const isEdgeOnly = React.useMemo(() => {
        return EDGE_ONLY_TYPES.includes(selectedElem?.type || "");
    }, [selectedElem?.type]);

    const isAddDisabled = React.useMemo(() => {
        return selectedElem
            && SINGULAR_TYPES.includes(selectedElem?.type)
            && selectedElem.properties.colliders
            && selectedElem.properties.colliders.length > 0;
    }, [selectedElem?.properties?.colliders]);

    const addCollider = React.useCallback(() => {
        if (!selectedElem)
            return;
        if (selectedElem.properties.colliders === undefined)
            selectedElem.properties.colliders = [];

        const collider = {
            id: generateGUID(),
            blocksLight: !isSolidOnly && !isEdgeOnly,
            isSolid: isSolidOnly && !isEdgeOnly,
            points: [
                { x: -0.5, y: 0.5 },
                { x: -0.5, y: -0.5 },
                { x: 0.5, y: -0.5 },
                { x: 0.5, y: 0.5 },
            ]
        };

        const elem = {
            ...selectedElem,
            properties: {
                ...selectedElem.properties,
                colliders: [
                    ...selectedElem.properties.colliders,
                    collider
                ]
            }
        };
        setSelectedElem(elem);
        setSelectedColliderID(collider?.id);
    }, [selectedElem, setSelectedElem, setSelectedColliderID, isSolidOnly]);

    if (!selectedElem || BLACKLISTED_TYPES.includes(selectedElem.type))
        return null;

    return (
        <>
            <PanelContainer title={t("collider.title") as string}>
                <Button
                    size={"small"}
                    fullWidth
                    endIcon={<Add />}
                    onClick={addCollider}
                    disabled={isAddDisabled}
                    color={"inherit"}
                    style={{ marginTop: 5, marginBottom: 0 }}
                >
                    {t("collider.add") as string}
                </Button>
                <DropdownList
                    elements={selectedElem.properties.colliders?.map((collider, index) => ({
                        id: collider.id,
                        name: collider.name !== undefined ? collider.name : t("collider.defaultName", { index: index + 1 }) as string,
                        intent: collider.blocksLight ? "error" : "success",
                        icon: "Edit"
                    })) ?? []}
                    selectedID={selectedColliderID}
                    onSelectID={setSelectedColliderID}
                    renderElement={(element) => (
                        <ColliderEditorPanel
                            key={element.id}
                            colliderID={element.id}
                            setSelectedColliderID={setSelectedColliderID}
                            isSolidOnly={isSolidOnly}
                            isShadowOnly={isShadowOnly}
                            isEdgeOnly={isEdgeOnly}
                        />
                    )}
                />

            </PanelContainer>

            <MapError
                isVisible={selectedColliderID !== undefined}
                info
                icon="HighlightAlt"
            >
                {t("collider.colliderInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type.startsWith("sab-door")}
                info
                icon="HighlightAlt"
            >
                {t("collider.doorInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type === "util-room"}
                info
                icon="Room"
            >
                {t("collider.roomInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type.startsWith("util-sound") || selectedElem.type === "util-triggersound"}
                info
                icon="VolumeUp"
            >
                {t("collider.soundInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type === "util-triggerarea"}
                info
                icon="HighlightAlt"
            >
                {t("collider.triggerAreaInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type === "util-tele"}
                info
                icon="HighlightAlt"
            >
                {t("collider.teleInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type === "util-onewaycollider"}
                info
                icon="HighlightAlt"
            >
                {t("collider.oneWayColliderInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type === "util-decontamination"}
                info
                icon="VolumeUp"
            >
                {t("collider.soundInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type === "util-ghostcollider"}
                info
                icon="Person"
            >
                {t("collider.ghostInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type === "util-binocularscollider"}
                info
                icon="CameraAlt"
            >
                {t("collider.binocularsInfo") as string}
            </MapError>
        </>
    );
}
