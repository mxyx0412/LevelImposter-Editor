import { Shape } from "react-konva";
import { useSelectedElemValue } from "../../hooks/elements/useSelectedElem";
import { DEFAULT_SPORE_GAS_RANGE, UNITY_SCALE } from "../../types/generic/Constants";
import useIsSelectedElemType from "../../hooks/elements/useSelectedElemIsType";
import { useSelectedElemPropValue } from "../../hooks/elements/useSelectedElemProperty";

export default function SporeRange() {
    const selectedElem = useSelectedElemValue();
    const isSpore = useIsSelectedElemType("util-spore");
    const radius = useSelectedElemPropValue("sporeRange") ?? DEFAULT_SPORE_GAS_RANGE;

    if (!selectedElem || !isSpore)
        return null;
    return (
        <Shape
            sceneFunc={(ctx, shape) => {
                ctx.beginPath();
                ctx.arc(
                    selectedElem.x * UNITY_SCALE,
                    -selectedElem.y * UNITY_SCALE,
                    radius * UNITY_SCALE,
                    0,
                    Math.PI * 2,
                    false
                );
                ctx.closePath();
                ctx.fillStrokeShape(shape);
            }}
            fill="#00aaff22"
            stroke="#00aaffff"
            strokeWidth={4}
            dashEnabled={true}
            dash={[10, 10]}
            listening={false}
        />
    );
}