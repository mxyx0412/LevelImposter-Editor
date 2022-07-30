import CamPanel from "../components/properties/CamPanel";
import ColliderPanel from "../components/properties/ColliderPanel";
import ConsolePanel from "../components/properties/ConsolePanel";
import MinimapPanel from "../components/properties/MinimapPanel";
import SabPanel from "../components/properties/SabPanel";
import SpritePanel from "../components/properties/SpritePanel";
import TaskPanel from "../components/properties/TaskPanel";
import TransformPanel from "../components/properties/TransformPanel";
import VentPanel from "../components/properties/VentPanel";

export default function RightSidebar() {
    return (
        <div className="right-sidebar">
            <TransformPanel />
            <SpritePanel />
            <TaskPanel />
            <SabPanel />
            <ConsolePanel />
            <VentPanel />
            <CamPanel />
            <ColliderPanel />
            <MinimapPanel />

            <div style={{ height: 40 }} />
        </div>
    );
}