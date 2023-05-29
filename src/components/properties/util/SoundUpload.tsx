import { Button, ButtonGroup, Icon } from "@blueprintjs/core";
import React from "react";
import { useTranslation } from "react-i18next";
import generateGUID from "../../../hooks/generateGUID";
import openUploadDialog from "../../../hooks/openUploadDialog";
import useToaster from "../../../hooks/useToaster";
import { DEFAULT_VOLUME } from "../../../types/generic/Constants";
import LISound from "../../../types/li/LISound";
import SizeTag from "../../utils/SizeTag";
import AudioPlayer from "./AudioPlayer";
import useAudioDownmixer from "../../../hooks/useAudioDownmixer";

interface SoundUploadProps {
    sound?: LISound;
    onChange: (soundURL: LISound) => void;
    onReset: () => void;

    title?: string;
    soundType?: string;
    onFinish?: () => void;
    loop?: boolean;
}

export default function SoundUpload(props: SoundUploadProps) {
    const { t } = useTranslation();
    const [isHovering, setIsHovering] = React.useState(false);
    const toaster = useToaster();
    const downmixAudio = useAudioDownmixer();

    const soundSize = React.useMemo(() => {
        return props.sound?.isPreset ? 0 : (props.sound?.data?.length ?? 0);
    }, [props.sound]);

    const onUploadClick = React.useCallback(() => {
        openUploadDialog("audio/*").then((audioData) => {
            downmixAudio(audioData).then((downmixedData) => {
                props.onChange({
                    id: props.sound?.id ?? generateGUID(),
                    type: props.soundType,
                    data: downmixedData ?? "",
                    volume: DEFAULT_VOLUME,
                    isPreset: false
                });
            }).catch((e) => {
                console.error(e);
                toaster.danger(e);
            });
        });
    }, [props.onChange]);

    const onFileDrop = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovering(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith("audio/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (!e.target?.result)
                        return;
                    downmixAudio(e.target.result as string).then((downmixedData) => {
                        props.onChange({
                            id: props.sound?.id ?? generateGUID(),
                            type: props.soundType,
                            data: downmixedData as string,
                            volume: DEFAULT_VOLUME,
                            isPreset: false
                        });
                    }).catch((e) => {
                        console.error(e);
                        toaster.danger(e);
                    });
                };
                reader.readAsDataURL(file);
            } else {
                toaster.danger(t("audio.errorInvalidType"));
            }
        }
    }, [props.onChange]);

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                setIsHovering(true);
            }}
            onDragLeave={(e) => {
                e.preventDefault();
                setIsHovering(false);
            }}
            onDrop={onFileDrop}
        >
            {/* Sound Preview */}
            {props.sound ? (
                <AudioPlayer
                    title={props.title}
                    sound={props.sound}
                    onSoundChange={props.onChange}
                    loop={props.loop}
                />
            ) : (
                <p
                    style={{
                        textAlign: "center",
                        paddingTop: 10
                    }}
                >
                    {t("audio.notUploaded")}
                </p>
            )}

            {/* Size Tag */}
            <div style={{ textAlign: "center", marginBottom: 10 }}>
                <SizeTag
                    sizeBytes={soundSize}
                    warningMsg={t("audio.errorSize") as string}
                    okMsg={t("audio.okSize") as string}
                />
            </div>

            {/* Buttons */}
            <ButtonGroup fill>
                <Button
                    icon="cloud-upload"
                    intent="primary"
                    onClick={() => onUploadClick()}
                    style={{ margin: 3 }}
                />
                <Button
                    icon="tick"
                    intent="success"
                    style={{ margin: 3 }}
                    disabled={!props.onFinish}
                    onClick={props.onFinish}
                />

                <Button
                    icon="refresh"
                    intent="danger"
                    onClick={props.onReset}
                    style={{ margin: 3 }}
                    disabled={props.sound === undefined}
                />
            </ButtonGroup>

            {/* Drag & Drop File Upload */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 5,
                    right: 5,
                    bottom: 5,
                    borderRadius: 5,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    opacity: isHovering ? 1 : 0,
                    transition: "opacity 0.2s",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    zIndex: 1000,
                    pointerEvents: "none",
                }}>

                <Icon
                    icon="cloud-upload"
                    iconSize={40}
                    style={{ marginRight: 10 }}
                />
                <span style={{
                    fontSize: 20,
                    fontWeight: "bold",
                }}>
                    {t("audio.upload")}
                </span>
                <span style={{
                    fontSize: 14,
                }}>
                    {props.title}
                </span>

            </div>
        </div>
    );
}