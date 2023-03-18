import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface INode {
  x: number,
  y: number
}

export type RoadDirection = "forward" | "backward" | "none";

export interface IRoad {
  start: number,
  end: number,
  direction: RoadDirection,
  label?: string
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

export type AddMode = "road" | "rectangular-building" | "circular-building";

interface MapState {
  map: IMap,
  name: string,
  hoverTarget?: Target,
  selection?: Target,
  addMode?: AddMode | null
}

const initialState: MapState = {
  name: "Untitled",
  map: {
    nodes: [],
    roads: [],
    buildings: []
  }
}

export interface NodeEdits {
  x?: number,
  y?: number
}

export interface RoadEdits {
  direction?: RoadDirection,
  label?: string
}

export interface BuildingEdits {
  x?: number,
  y?: number,
  rotation?: number,
  width?: number,
  height?: number,
  radius?: number
}

interface LoadMap {
  name: string,
  objects: IMap
}

export const mapSlice = createSlice({
  name: "map",
  initialState, 
  reducers: {
    load: (state, action: PayloadAction<LoadMap>) => {
      const p = action.payload;
      state.name = p.name;
      state.map = p.objects;
      state.addMode = undefined;
      state.selection = undefined
      state.hoverTarget = undefined;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setMode: (state, action: PayloadAction<AddMode | null>) => {
      state.addMode = action.payload;
    },
    setHoverTarget: (state, action: PayloadAction<Target | undefined>) => {
      state.hoverTarget = action.payload; 
    },
    setSelection: (state, action: PayloadAction<Target | undefined>) => {
      state.selection = action.payload;
    },
    editRoad: (state, action: PayloadAction<{ index: number, edits: RoadEdits }>) => {
      const { index, edits } = action.payload;
      const road = state.map.roads[index];
      state.map.roads[index] = Object.assign(road, edits); 
    },
    addRoad: (state, action: PayloadAction<{ x: number, y: number, focus?: boolean }>) => {
      const { x, y, focus } = action.payload;
      const start: INode = { x: x, y: y };
      const end: INode = { x: x, y: y };
      const len = state.map.nodes.push(start, end);
      const road: IRoad = { start: len - 2, end: len - 1, direction: "none" }; 
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
      const road: IRoad = { start: nodeIndex, end: len - 1, direction: "none" };
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
    },
    deleteNode: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      console.log("Deleting node", index);
      const lastIdx = state.map.nodes.length - 1;
      // Remove roads connecting to deleting node
      state.map.roads = state.map.roads.filter(road => road.end !== index && road.start !== index); 
      // Replace deleting node with last node
      state.map.nodes[index] = state.map.nodes[lastIdx];
      // Update roads connecting to last node with new position
      for (let road of state.map.roads) {
        if (road.end === lastIdx) {
          road.end = index;
        } else if(road.start === lastIdx) {
          road.start = index; 
        }
      }
      // Remove last node
      state.map.nodes.pop();
      // Delete nodes without any roads
      for (let i = 0; i < state.map.nodes.length; i++) {
        if (state.map.roads.find(road => road.start === i || road.end === i)) {
          continue;
        }

        mapSlice.caseReducers.deleteNode(state, {
          type: "deleteNode",
          payload: {
            index: i
          }
        });
      }
      // Unselect
      state.selection = undefined;
    },
    deleteRoad: (state, action: PayloadAction<{ index: number }>) => {
      function check(i: number) { 
        if (i >= state.map.nodes.length) {
          return;
        }
        if (state.map.roads.find(road => road.start === i || road.end === i)) {
          return;
        }

        mapSlice.caseReducers.deleteNode(state, {
          type: "deleteNode",
          payload: {
            index: i
          }
        });
      }
      const { index } = action.payload;
      console.log("Deleting road", index);
      const road = state.map.roads[index];
      const start = road.start;
      const end = road.end;
      state.map.roads[index] = state.map.roads[state.map.roads.length-1];
      state.map.roads.pop();
      check(start);
      check(end);
      state.selection = undefined;
    },
    deleteBuilding: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      console.log("Deleting building", index);
      state.map.buildings[index] = state.map.buildings[state.map.buildings.length-1];
      state.map.buildings.pop();
      state.selection = undefined;
    }
  }
});

const mapReducer = mapSlice.reducer;

export const { deleteNode, deleteBuilding, deleteRoad, setName, setMode, load, setHoverTarget, setSelection, editRoad, addRoad, addBuilding, extendRoad, editNode, editBuilding } = mapSlice.actions;
export default mapReducer;
