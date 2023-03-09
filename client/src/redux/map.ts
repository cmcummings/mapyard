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

export type AddMode = "road" | "rectangular-building";

interface MapState {
  map: IMap,
  hoverTarget?: Target,
  selection?: Target,
  addMode?: AddMode | null
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

export interface NodeEdits {
  x?: number,
  y?: number
}

export interface BuildingEdits {
  x?: number,
  y?: number,
  rotation?: number,
  width?: number,
  height?: number
}

export const mapSlice = createSlice({
  name: "map",
  initialState, 
  reducers: {
    setMode: (state, action: PayloadAction<AddMode | null>) => {
      state.addMode = action.payload;
    },
    setHoverTarget: (state, action: PayloadAction<Target | undefined>) => {
      state.hoverTarget = action.payload; 
    },
    setSelection: (state, action: PayloadAction<Target | undefined>) => {
      state.selection = action.payload;
    },
    addRoad: (state, action: PayloadAction<{ x: number, y: number, focus?: boolean }>) => {
      const { x, y, focus } = action.payload;
      const start: INode = { x: x, y: y };
      const end: INode = { x: x, y: y };
      const len = state.map.nodes.push(start, end);
      const road: IRoad = { start: len - 2, end: len - 1 }; 
      state.map.roads.push(road);

      if (focus) {
        mapSlice.caseReducers.setHoverTarget(state, {
          type: "setHoverTarget",
          payload: {
            type: "node",
            index: len - 1
          }
        });
      }
    },
    extendRoad: (state, action: PayloadAction<{ nodeIndex: number }>) => {
      const { nodeIndex } = action.payload;
      const node = state.map.nodes[nodeIndex];
      const end: INode = { x: node.x, y: node.y };
      const len = state.map.nodes.push(end);
      const road: IRoad = { start: nodeIndex, end: len - 1 };
      state.map.roads.push(road);

      mapSlice.caseReducers.setHoverTarget(state, {
        type: "setHoverTarget",
        payload: {
          type: "node",
          index: len - 1
        }
      });
    },
    editNode: (state, action: PayloadAction<{ index: number, edits: NodeEdits }>) => {
      const { index, edits } = action.payload;
      if (index < 0 || index >= state.map.nodes.length) return;
      const node = state.map.nodes[index];
      state.map.nodes[index] = Object.assign(node, edits);
    },
    addBuilding: (state, action: PayloadAction<IBuilding>) => {
      const building = action.payload;
      state.map.buildings.push(building);
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

export const { setMode, setHoverTarget, setSelection, addRoad, addBuilding, extendRoad, editNode, editBuilding } = mapSlice.actions;
export default mapReducer;
