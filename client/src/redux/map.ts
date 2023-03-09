import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface INode {
  x: number,
  y: number
}

export interface IRoad {
  start: number,
  end: number
}

export type IBuilding = {
  x: number,
  y: number
} & ({
  type: "rectangular",
  width: number,
  height: number,
  rotation: number, // in radians
} | {
  type: "circular",
  radius: number
})

export interface IMap {
  nodes: INode[],
  roads: IRoad[],
  buildings: IBuilding[]
}


type MapObjectType = "node" | "road" | "building"; 

export interface Target { 
  type: MapObjectType, 
  index: number 
}

interface MapState {
  map: IMap,
  hoverTarget?: Target,
  selection?: Target
}

const node1 = { x: 20, y: 20 }
const node2 = { x: 100, y: 100 }
const node3 = { x: 50, y: 150 }
const node4 = { x: 200, y: 200 }
const node5 = { x: 250, y: 200 }

const initialState: MapState = {
  map: {
    nodes: [node1, node2, node3, node4, node5],
    roads: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 3, end: 4 }
    ],
    buildings: [
      { 
        type: "rectangular",
        x: 300,
        y: 300,
        width: 40,
        height: 70,
        rotation: Math.PI/4
      }
    ]
  }
}

interface NodeEdits {
  x?: number,
  y?: number
}

interface BuildingEdits {
  x?: number,
  y?: number,
  rotation?: number
}

export const mapSlice = createSlice({
  name: "map",
  initialState, 
  reducers: {
    setHoverTarget: (state, action: PayloadAction<Target | undefined>) => {
      state.hoverTarget = action.payload; 
    },
    setSelection: (state, action: PayloadAction<Target | undefined>) => {
      state.selection = action.payload;
    },
    editNode: (state, action: PayloadAction<{ index: number, edits: NodeEdits }>) => {
      const { index, edits } = action.payload;
      if (index < 0 || index >= state.map.nodes.length) return;
      const node = state.map.nodes[index];
      state.map.nodes[index] = Object.assign(node, edits);
    },
    editBuilding: (state, action: PayloadAction<{ index: number, edits: BuildingEdits }>) => {
      const { index, edits } = action.payload;
      if (index < 0 || index >= state.map.buildings.length) return;
      const building = state.map.buildings[index];
      state.map.buildings[index] = Object.assign(building, edits);
    }
  }
});

const mapReducer = mapSlice.reducer;

export const { setHoverTarget, setSelection, editNode, editBuilding } = mapSlice.actions;
export default mapReducer;
