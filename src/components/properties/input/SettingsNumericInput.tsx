import React from "react";
import { Button, Card, Classes, Icon, IconName, NumericInput } from "@blueprintjs/core";
import LISettings, { DEFAULT_SETTINGS } from "../../../types/li/LISettings";
import useSettings from "../../../hooks/useSettings";
import clamp from "../../../utils/clamp";

export interface SettingsNumericInputProps {
    name: string;
    prop?: keyof LISettings;

    icon?: IconName;
    disabled?: boolean;
    min?: number;
    max?: number;
    minorStepSize?: number;
    stepSize?: number;
    majorStepSize?: number;
    label?: string;
    isPercentage?: boolean;
}

export default function SettingsNumericInput(props: SettingsNumericInputProps) {
    const [settings, setSettings] = useSettings();

    const defaultValue = React.useMemo(() => {
        if (props.prop === undefined)
            return 0;
        return DEFAULT_SETTINGS[props.prop] as number;
    }, [props.prop]);

    const value = React.useMemo(() => {
        if (props.prop === undefined)
            return 0;
        return settings[props.prop] as number;
    }, [settings, props.prop]);

    const onChange = React.useCallback((numericVal: number, stringVal: string) => {
        if (props.prop === undefined)
            return;
        setSettings({
            ...settings,
            [props.prop]: isNaN(parseFloat(stringVal)) ? defaultValue : clamp(numericVal, props.min ?? -Infinity, props.max ?? Infinity)
        });
    }, [setSettings, settings, props.prop, props.min, props.max, defaultValue]);

    return (
        <Card style={{ justifyContent: "space-between" }}>
            <div>
                <Icon
                    icon={props.icon}
                    className={Classes.TEXT_MUTED}
                    style={{ marginRight: 8 }}
                />
                {props.name}
            </div>

            <div style={{ maxWidth: 200 }}>
                <NumericInput
                    fill
                    placeholder={defaultValue.toString()}
                    defaultValue={value as number}
                    min={props.min}
                    minorStepSize={props.minorStepSize}
                    stepSize={props.stepSize}
                    majorStepSize={props.majorStepSize}
                    leftIcon={props.icon}
                    rightElement={props.label ? (<Button minimal disabled>{props.label}</Button>) : undefined}
                    onValueChange={onChange}
                />
            </div>
        </Card>
    )
}