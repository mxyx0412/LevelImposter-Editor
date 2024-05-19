import { atom } from "jotai/index";
import LIElement from "../../../types/li/LIElement";
import GLOBAL_PROPERTIES from "../../../types/generic/GlobalProps";
import { elementsAtom } from "../useMap";
import { trimAssetsAtom } from "../useMapAssets";
import { saveHistoryAtom } from "../useHistory";
import { useSetAtom } from "jotai";

export const addElementAtom = atom(null, (get, set, elem: LIElement) => {
    const globalProps = GLOBAL_PROPERTIES.filter((globalProp) => globalProp.types.includes(elem.type));
    globalProps.forEach((globalProp) => {
        const prop = globalProp.prop as keyof LIElement["properties"];
        get(elementsAtom).forEach((e) => {
            if (globalProp.types.includes(e.type)) {
                elem.properties = {
                    ...elem.properties,
                    [prop]: e.properties[prop],
                };
                return;
            }
        });
    });

    set(elementsAtom, [...get(elementsAtom), elem]);
    set(trimAssetsAtom);
    set(saveHistoryAtom);
});

// Debug
addElementAtom.debugLabel = "addElementAtom";

export default function useAddElement() {
    return useSetAtom(addElementAtom);
}