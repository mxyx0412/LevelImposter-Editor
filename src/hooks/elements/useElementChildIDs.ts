import { atom, useAtomValue } from "jotai/index";
import { atomFamily } from "jotai/utils";
import { MaybeGUID } from "../../types/generic/GUID";
import { elementsAtom } from "../map/useMap";

export const elementChildIDsAtomFamily = atomFamily((id: MaybeGUID) => {
    let prevValue: MaybeGUID[] = [];
    return atom(
        (get) => {
            const elements = get(elementsAtom);
            const filteredValues = elements.filter(elem => elem.parentID === id).map((elem) => elem.id);

            // HACK: Only update if the values have changed
            if (filteredValues.length !== prevValue.length ||
                filteredValues.some((value, index) => value !== prevValue[index])) {
                prevValue = filteredValues;
            }

            return prevValue;
        }
    );
});

export function useElementChildIDs(id: MaybeGUID) {
    return useAtomValue(elementChildIDsAtomFamily(id));
}