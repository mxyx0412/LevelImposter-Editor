import { Autocomplete, TextField, Tooltip } from "@mui/material";
import React from "react";
import { useElementValue } from "../../../../hooks/elements/useElements";
import { useSelectedElemIDValue } from "../../../../hooks/elements/useSelectedElem";
import { useElementsOfType } from "../../../../hooks/elements/useElementsOfType";
import { MaybeGUID } from "../../../../types/generic/GUID";
import LIElement from "../../../../types/li/LIElement";

export interface ElementSelectProps {
    nameFilter?: string;
    typeFilter?: string;
    allowSelected?: boolean;
    blacklistedIDs?: MaybeGUID[];
    whitelistedIDs?: MaybeGUID[];

    label?: string;
    noElementsText: string;
    defaultText: string;
    selectedID: MaybeGUID;
    onPick: (elem: LIElement) => void;
    onReset: () => void;
}

export default function ElementSelect(props: ElementSelectProps) {
    const selectedElemID = useSelectedElemIDValue();
    const currentElem = useElementValue(props.selectedID);
    const elems = useElementsOfType(props.typeFilter ?? "");
    const filteredElems = React.useMemo(() => {
        return props.whitelistedIDs ?
            elems.filter((e) => props.whitelistedIDs?.includes(e.id))
            :
            elems.filter((e) => e.name.includes(props.nameFilter ?? "")
                && (props.allowSelected || e.id !== selectedElemID)
                && !props.blacklistedIDs?.includes(e.id));
    }, [elems, props.nameFilter, props.allowSelected, selectedElemID, props.blacklistedIDs]);

    return (
        <Tooltip
            title={filteredElems.length === 0 ? props.noElementsText : undefined}
            color={"error"}
        >
            <span>
                <Autocomplete
                    key={props.selectedID}
                    fullWidth
                    disablePortal
                    options={filteredElems}
                    disabled={filteredElems.length === 0 && !currentElem}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={props.defaultText}
                            size={"small"}
                            label={props.label}
                            fullWidth
                        />
                    )}
                    value={currentElem}
                    style={{ marginTop: 5, marginBottom: 5 }}
                    onChange={(_, elem) => {
                        if (elem)
                            props.onPick(elem);
                        else
                            props.onReset();
                    }}
                    getOptionLabel={(elem) => elem.name}
                />
            </span>
        </Tooltip>
    );
}