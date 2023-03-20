import { Button, FormGroup, IconName, NumericInput } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { useTranslation } from "react-i18next";
import useSelectedElem from "../../../hooks/jotai/useSelectedElem";
import LIProperties from "../../../types/li/LIProperties";

export interface NumericInputProps {
    name: string;
    prop: keyof LIProperties;
    defaultValue: number;

    icon?: IconName;
    label?: string;
    min?: number;
    max?: number;
    minorStepSize?: number;
    stepSize?: number;
    majorStepSize?: number;
}

export default function NumericPanelInput(props: NumericInputProps) {
    const [selectedElem, setSelectedElem] = useSelectedElem();
    const { t } = useTranslation();

    const defaultValue = selectedElem?.properties[props.prop] !== undefined ? selectedElem.properties[props.prop] : props.defaultValue;

    return (
        <FormGroup
            style={{
                marginBottom: 5,
                marginTop: 5
            }}
        >
            <Tooltip2
                content={t(props.name) as string}
                hoverOpenDelay={200}
                hoverCloseDelay={0}
                fill
            >
                <NumericInput
                    key={`${selectedElem?.id}-${props.prop}`}
                    fill
                    placeholder={props.defaultValue.toString()}
                    defaultValue={defaultValue as number}
                    min={props.min}
                    minorStepSize={props.minorStepSize}
                    stepSize={props.stepSize}
                    majorStepSize={props.majorStepSize}
                    leftIcon={props.icon}
                    rightElement={<Button minimal disabled>{props.label}</Button>}
                    onValueChange={(val, stringVal) => {
                        if (selectedElem) {
                            setSelectedElem({
                                ...selectedElem,
                                properties: {
                                    ...selectedElem.properties,
                                    [props.prop]: isNaN(parseFloat(stringVal)) ? props.defaultValue : val
                                }
                            });
                        }
                    }}
                />
            </Tooltip2>
        </FormGroup>
    )
}