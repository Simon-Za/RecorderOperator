import type { Item, Path, PlacedItem, Position } from "./Connecting-Minds-Data-Types/types";

export type SessionData = {
    ContainsPlayer: boolean;
    PlacedItems: PlacedItem[];
    UnlockedPaths: Path[];
    AvailablePositions: Position[];
    AvailableItems: Item[]
}