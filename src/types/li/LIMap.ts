import LIElement from "./LIElement";
import LIMetadata from "./LIMetadata";
import MapAsset from "./MapAsset";
import LIMapProperties from "./LIMapProperties";

export default interface LIMap extends LIMetadata {
    elements: LIElement[];
    assets?: MapAsset[];
    properties: LIMapProperties;
}