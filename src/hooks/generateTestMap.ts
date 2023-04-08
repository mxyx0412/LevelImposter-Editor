import React from "react";
import { useTranslation } from "react-i18next";
import AUElementDB from "../types/au/AUElementDB";
import AUMinigameDB from "../types/au/AUMinigameDB";
import GUID, { MaybeGUID } from "../types/generic/GUID";
import LIElement from "../types/li/LIElement";
import generateGUID from "./generateGUID";
import useMap from "./jotai/useMap";
import { UNITY_SCALE } from "../types/generic/Constants";

const TASK_TYPES = AUElementDB.filter((type) => type.startsWith("task-"));
const UTIL_TYPES = AUElementDB.filter((type) => type.startsWith("util-"));
const SAB_TYPES = AUElementDB.filter((type) => type.startsWith("sab-"));
const ROOM_TYPES = AUElementDB.filter((type) => type.startsWith("room-"));
const DEC_TYPES = AUElementDB.filter((type) => type.startsWith("dec-"));

const CONSOLE_SPACING = 2;
const ROOM_SPACING = 15;
const DEC_SPACING = 2;

export default function useTestMapGenerator() {
    const [map, setMap] = useMap();
    const { t } = useTranslation();

    const generateTestSprite = React.useCallback((color?: string, size?: number) => {
        const canvas = document.createElement("canvas");
        canvas.width = size ?? 100;
        canvas.height = size ?? 100;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return "";
        }
        ctx.fillStyle = color ?? `hsla(${Math.random() * 360}, 100%, 50%, 50%)`;
        ctx.fillRect(0, 0, size ?? 100, size ?? 100);
        return canvas.toDataURL("image/png");
    }, []);

    const generateDotGridSprite = React.useCallback(() => {
        const width = 150;
        const height = 30;

        const canvas = document.createElement("canvas");
        canvas.width = UNITY_SCALE * width;
        canvas.height = UNITY_SCALE * height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return "";
        }
        ctx.fillStyle = "white";
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                ctx.fillRect(
                    x * UNITY_SCALE - 2.5,
                    y * UNITY_SCALE - 2.5,
                    5,
                    5
                );
            }
        }
        return canvas.toDataURL("image/png");
    }, []);


    const generateMap = React.useCallback(() => {
        const elemList: LIElement[] = [];
        const addElement = (type: string, x: number, y: number, z: number, parentID?: GUID) => {
            const elem = {
                id: generateGUID(),
                parentID,
                name: t(`au.${type}`),
                type,
                x,
                y,
                z: z ?? 0,
                xScale: 1,
                yScale: 1,
                rotation: 0,
                properties: {}
            };
            elemList.push(elem);
            return elem;
        };

        // Tasks
        let roomID: MaybeGUID = undefined;
        const taskParent = addElement("util-layer", 0, 0, 0);
        taskParent.name = "Tasks";
        TASK_TYPES.forEach((type, index) => {
            if (index % 10 == 0 ||
                type.startsWith("task-garbage") ||
                type.startsWith("task-temp")) {

                const roomElem = addElement("util-room", index * CONSOLE_SPACING, -5, 0, taskParent.id);
                roomID = roomElem.id;
            }

            const task = addElement(type, index * CONSOLE_SPACING, 0, 0, taskParent.id);
            const taskMinigames: string[] = AUMinigameDB.filter((mgType) => mgType.startsWith(`${type}_`));
            task.properties = {
                minigames: taskMinigames.map((mgType) => ({
                    id: generateGUID(),
                    type: mgType,
                    spriteData: generateTestSprite(),
                })),
                parent: roomID,
            };
        });

        // Utilities
        const utilParent = addElement("util-layer", 0, 0, 0);
        utilParent.name = "Utilities";
        UTIL_TYPES.forEach((type, index) => {
            addElement(type, index * CONSOLE_SPACING, 4, 0, utilParent.id);
        });
        addElement("util-dummy", -CONSOLE_SPACING, 4, 0, utilParent.id);

        // Sabotage
        const sabRooms: Record<string, GUID> = {};
        const sabParent = addElement("util-layer", 0, 0, 0);
        sabParent.name = "Sabotage";
        SAB_TYPES.forEach((type, index) => {
            const sab = addElement(type, index * CONSOLE_SPACING, 8, 0, sabParent.id);
            if (type === "sab-btnreactor" || type == "sab-reactorright") {
                sab.properties = {
                    parent: sabRooms["sab-reactorleft"],
                };
            }
            else if (type === "sab-btnoxygen" || type == "sab-oxygen2") {
                sab.properties = {
                    parent: sabRooms["sab-oxygen1"],
                };
            }
            else if (type === "sab-btncomms") {
                sab.properties = {
                    parent: sabRooms["sab-comms"],
                };
            }
            else if (type === "sab-btnlights") {
                sab.properties = {
                    parent: sabRooms["sab-electric"],
                };
            }
            else if (type === "sab-btndoors" || type === "sab-doorh") {
                sab.properties = {
                    parent: sabRooms["sab-doorv"],
                };
            }
            else {
                const roomElem = addElement("util-room", index * CONSOLE_SPACING, -10, 0, sabParent.id);
                sab.properties = {
                    parent: roomElem.id,
                };
                sabRooms[type] = roomElem.id;
            }
        });

        // Decals
        const decParent = addElement("util-layer", 0, 0, 0);
        decParent.name = "Decals";
        DEC_TYPES.forEach((type, index) => {
            addElement(type, index * DEC_SPACING, 12, 0, decParent.id);
        });

        // Rooms
        const roomParent = addElement("util-layer", 0, 0, 0);
        roomParent.name = "Rooms";
        ROOM_TYPES.forEach((type, index) => {
            addElement(type, index * ROOM_SPACING, 20, 5, roomParent.id);
        });

        // Grid Dot
        const gridParent = addElement("util-layer", 0, 0, 0);
        gridParent.name = "Grid Dots";
        const gridDotSprite = generateDotGridSprite();
        const gridDot = addElement("util-blank", 75, 15, 10, gridParent.id);
        gridDot.properties = {
            spriteData: gridDotSprite,
        };

        setMap({
            ...map,
            name: "Test Map",
            description: `Test map generated at ${new Date().toLocaleString()}`,
            elements: elemList,
            properties: {
                ...map.properties,
                bgColor: "#1C2127"
            }
        });
    }, [map, setMap]);

    return generateMap;
}