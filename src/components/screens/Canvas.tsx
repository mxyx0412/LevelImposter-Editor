import { Provider } from 'jotai';
import React from 'react';
import { Layer, Stage } from 'react-konva';
import CanvasGrid from '../canvas/CanvasGrid';
import { MapSorter } from '../canvas/MapSorter';
import SelectedMapElement from '../canvas/SelectedMapElement';
import primaryStore from '../../hooks/primaryStore';
import { useMapProperties } from '../../hooks/map/useMap';
import useCameraControl from "../../hooks/canvas/useCameraControl";
import useWindowSize from "../../hooks/canvas/useWindowSize";
import MapElementsRenderer from "../canvas/MapElementsRenderer";
import { useHotkeysContext } from "react-hotkeys-hook";
import { Scope } from "../../hooks/input/useHotkeysHandler";
import { Paper } from "@mui/material";
import useDeselectAll from "../../hooks/map/useDeselectAll";

const TOP_PADDING = 50;
const LEFT_PADDING = 250;
const RIGHT_PADDING = 316;

export default function Canvas() {
    const stageRef = useCameraControl();
    const [windowWidth, windowHeight] = useWindowSize();
    const [properties] = useMapProperties();
    const { enableScope, disableScope } = useHotkeysContext();
    const deselectAll = useDeselectAll();

    const canvasWidth = windowWidth - LEFT_PADDING - RIGHT_PADDING;
    const canvasHeight = windowHeight - TOP_PADDING;

    return (
        <Paper
            style={properties.bgColor ? { backgroundColor: properties.bgColor } : undefined}
            tabIndex={-1}
            elevation={0}
            onFocus={() => enableScope(Scope.Canvas)}
            onBlur={() => disableScope(Scope.Canvas)}
            sx={{
                position: "absolute",
                top: TOP_PADDING,
                left: LEFT_PADDING,
                right: RIGHT_PADDING,
                bottom: 0,
                zIndex: -1
            }}
        >
            <Stage
                id="canvas"
                width={canvasWidth}
                height={canvasHeight}
                x={canvasWidth / 2}
                y={canvasHeight / 2}
                ref={stageRef}
                perfectDrawEnabled={false}
                imageSmoothingEnabled={properties.pixelArtMode !== true}
                onClick={deselectAll}
            >
                <Provider store={primaryStore}>
                    <Layer>
                        <MapElementsRenderer />
                        <SelectedMapElement />
                        <CanvasGrid />
                    </Layer>
                </Provider>
            </Stage>
            <MapSorter />
        </Paper>
    );
}