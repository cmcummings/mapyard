import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { IMap, INode, IBuilding, IRoad, Target, editNode, setHoverTarget, editBuilding, setSelection, addRoad, extendRoad, addBuilding, RoadDirection } from "../redux/map";

interface Drawable {
  // Draws a plain version of the object
  draw(ctx: CanvasRenderingContext2D): void; 
}

interface Hoverable {
  // Checks if (mouseX, mouseY) is within the object's bounds and returns a Target if so
  getTarget(mouseX: number, mouseY: number, ctx: CanvasRenderingContext2D): Target | undefined;
  
  // Draws the object with hovered effects
  drawHovered(ctx: CanvasRenderingContext2D): void;
}


class Node implements Hoverable {
  static COLOR = "#ccd0da";
  static HOVER_COLOR = "#04a5e533"; 

  id: number 
  node: INode

  constructor(id: number, node: INode) {
    this.node = node;
    this.id = id;
  }

  private distanceTo(x: number, y: number): number {
    return Math.sqrt(Math.pow(x - this.node.x, 2) + Math.pow(y - this.node.y, 2));
  }

  getTarget(mouseX: number, mouseY: number, ctx: CanvasRenderingContext2D): Target | undefined {
    if (this.distanceTo(mouseX, mouseY) < 5) {
      return {
        type: "node",
        index: this.id
      }
    }
  }

  drawHovered(ctx: CanvasRenderingContext2D): void { 
    ctx.fillStyle = Node.HOVER_COLOR;
    ctx.beginPath();
    ctx.arc(this.node.x, this.node.y, 5, 0, 2*Math.PI);
    ctx.fill();
  }
}

class Road implements Drawable, Hoverable {
  static COLOR = "#ccd0da";
  static ARROW_COLOR = "#acb0be";
  static LABEL_COLOR = "#acb0be";
  static HOVER_COLOR = "#04a5e533";
  static HOVER_ARROW_COLOR = "#04a5e522";
  static HOVER_LABEL_COLOR = "#04a5e522";

  id: number
  start: INode
  end: INode
  road: IRoad
  path: Path2D

  constructor(id: number, start: INode, end: INode, road: IRoad) {
    this.start = start;
    this.end = end;
    this.id = id;
    this.road = road;
    
    this.path = new Path2D();
    this.path.moveTo(start.x, start.y);
    this.path.lineTo(end.x, end.y);
  }

  private drawPath(ctx: CanvasRenderingContext2D, pathColor: string, arrowColor: string, labelColor: string) {
    ctx.beginPath();
    ctx.strokeStyle = pathColor;
    ctx.fillStyle = pathColor;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.stroke(this.path);
    
    // Draw arrow 
    const midX = (this.start.x + this.end.x)/2;
    const midY = (this.start.y + this.end.y)/2;
    const angle = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);

    ctx.resetTransform();
    ctx.translate(midX, midY);
    ctx.rotate(angle);
    ctx.translate(-midX, -midY);

    if (this.road.direction != "none") {  
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = arrowColor;

      if (this.road.direction === "forward") {
        ctx.moveTo(midX - 15, midY);
        ctx.lineTo(midX + 13, midY);
        ctx.moveTo(midX + 15, midY);
        ctx.lineTo(midX + 5, midY + 4);
        ctx.moveTo(midX + 15, midY);
        ctx.lineTo(midX + 5, midY - 4); 
      } else {
        ctx.moveTo(midX + 15, midY);
        ctx.lineTo(midX - 13, midY);
        ctx.moveTo(midX - 15, midY);
        ctx.lineTo(midX - 5, midY + 4);
        ctx.moveTo(midX - 15, midY);
        ctx.lineTo(midX - 5, midY - 4); 
      }

      ctx.stroke();
    }
 
    // Draw label
    if (this.road.label) {
      if (angle < -Math.PI/2 || angle > Math.PI/2) {
        ctx.resetTransform();
        ctx.translate(midX, midY);
        ctx.rotate(angle + Math.PI);
        ctx.translate(-midX, -midY);
      }
      ctx.fillStyle = labelColor;
      ctx.font = "14px sans";
      ctx.moveTo(midX, midY);
      ctx.textAlign = "center";
      ctx.fillText(this.road.label, midX, midY - 8);
    }

    ctx.resetTransform();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.drawPath(ctx, Road.COLOR, Road.ARROW_COLOR, Road.LABEL_COLOR);
  } 

  getTarget(mouseX: number, mouseY: number, ctx: CanvasRenderingContext2D): Target | undefined {
    if (ctx.isPointInStroke(this.path, mouseX, mouseY)) {
      return {
        type: "road",
        index: this.id
      }
    }
  }

  drawHovered(ctx: CanvasRenderingContext2D): void { 
    this.drawPath(ctx, Road.HOVER_COLOR, Road.HOVER_ARROW_COLOR, Road.HOVER_LABEL_COLOR);
  }
}

class Building implements Drawable, Hoverable {
  static STROKE_COLOR = "#bcc0cc";
  static FILL_COLOR = "#ccd0da";
  static HOVER_STROKE_COLOR = "#04a5e522";
  static HOVER_FILL_COLOR = "#04a5e533";

  id: number
  building: IBuilding
  path: Path2D

  constructor(id: number, building: IBuilding) {
    this.id = id;
    this.building = building;

    this.path = new Path2D();
    if (this.building.type === "rectangular") {
      this.path.rect(this.building.x - this.building.width/2, this.building.y - this.building.height/2, this.building.width, this.building.height);
    } else if (this.building.type === "circular") {
      this.path.arc(this.building.x, this.building.y, this.building.radius, 0, 2*Math.PI);
    }
  }

  private transform(ctx: CanvasRenderingContext2D) {
    if (this.building.type === "rectangular") {
      ctx.translate(this.building.x, this.building.y);
      ctx.rotate(this.building.rotation);
      ctx.translate(-this.building.x, -this.building.y); 
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Building.FILL_COLOR;
    ctx.strokeStyle = Building.STROKE_COLOR;
    ctx.lineWidth = 2;
    ctx.beginPath();
    this.transform(ctx);
    ctx.fill(this.path);
    ctx.stroke(this.path);
    ctx.resetTransform();
  }

  getTarget(mouseX: number, mouseY: number, ctx: CanvasRenderingContext2D): Target | undefined {
    this.transform(ctx);
    if (ctx.isPointInPath(this.path, mouseX, mouseY)) {
      ctx.resetTransform();
      return {
        type: "building",
        index: this.id
      }
    }
    ctx.resetTransform();
  }

  drawHovered(ctx: CanvasRenderingContext2D): void {  
    ctx.fillStyle = Building.HOVER_FILL_COLOR;
    ctx.strokeStyle = Building.HOVER_STROKE_COLOR;
    ctx.lineWidth = 2;
    ctx.beginPath();
    this.transform(ctx);
    ctx.fill(this.path);
    ctx.stroke(this.path);
    ctx.resetTransform();
  }
}

class Map {
  nodes: Node[]
  roads: Road[]
  buildings: Building[]

  constructor(map: IMap) {
    this.nodes = [];
    for (let i = 0; i < map.nodes.length; i++) {
      this.nodes.push(new Node(i, map.nodes[i]));
    }

    this.roads = [];
    for (let i = 0; i < map.roads.length; i++) {
      const road = map.roads[i];
      const start = map.nodes[road.start];
      const end = map.nodes[road.end];
      this.roads.push(new Road(i, start, end, road));
    }
    
    this.buildings = [];
    for (let i = 0; i < map.buildings.length; i++) {
      this.buildings.push(new Building(i, map.buildings[i]));
    }
  }

  getTarget(mouseX: number, mouseY: number, ctx: CanvasRenderingContext2D): Target | undefined {
    for (let node of this.nodes) {
      const res = node.getTarget(mouseX, mouseY, ctx);
      if (res) return res;
    }

    for (let road of this.roads) {
      const res = road.getTarget(mouseX, mouseY, ctx);
      if (res) return res;
    }

    for (let building of this.buildings) {
      const res = building.getTarget(mouseX, mouseY, ctx);
      if (res) return res;
    }
  }

  draw(ctx: CanvasRenderingContext2D, target?: Target): void {
    for (let road of this.roads) {
      road.draw(ctx);
    }

    for (let building of this.buildings) {
      building.draw(ctx);
    }

    if (target) {
      switch (target.type) {
        case "road":
          this.roads[target.index].drawHovered(ctx);
          break;
        case "node":
          this.nodes[target.index].drawHovered(ctx);
          break;
        case "building":
          this.buildings[target.index].drawHovered(ctx);
          break;
      }
    }
  }
}

type CursorStyle = "cursor-pointer" | "cursor-default";
type CursorPosition = { x: number, y: number };

export default function MapCanvas({ width, height }: { width: number, height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const _map = useAppSelector((state) => state.map.map);
  const map = new Map(_map);
  const hoverTarget = useAppSelector((state) => state.map.hoverTarget);
  const addMode = useAppSelector((state) => state.map.addMode);
  const dispatch = useAppDispatch();

  const [cursorStyle, setCursorStyle] = useState<CursorStyle>("cursor-default");
  const [holding, setHolding] = useState(false);

  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    map.draw(ctx, hoverTarget); 

    function mouseMoveHandler(e: MouseEvent) {
      const x = e.offsetX;
      const y = e.offsetY;

      setCursorPos({ x: x, y: y });

      if (holding) {
        if (!hoverTarget) return;
        if (hoverTarget.type === "node") {
          dispatch(editNode({
            index: hoverTarget.index,
            edits: {
              x: x,
              y: y
            }
          }));
        } else if (hoverTarget.type === "building") {
          dispatch(editBuilding({
            index: hoverTarget.index,
            edits: {
              x: x,
              y: y
            }
          }));
        }
      } else {
        if (!ctx) return;
        const newTarget = map.getTarget(e.offsetX, e.offsetY, ctx);
        if (newTarget) { 
          dispatch(setHoverTarget(newTarget)); 
          setCursorStyle("cursor-pointer");
        } else {
          dispatch(setHoverTarget());
          setCursorStyle("cursor-default");
        }
      }
    }

    function mouseDownHandler(e: MouseEvent) {
      const x = e.offsetX;
      const y = e.offsetY;

      setHolding(true);
      
      if (hoverTarget) {
        dispatch(setSelection(hoverTarget));
      } else {
        dispatch(setSelection());
      }

      if (addMode === "road") {
        if (hoverTarget?.type === "node") {
          dispatch(extendRoad({ nodeIndex: hoverTarget.index }));  
        } else {
          dispatch(addRoad({x: x, y: y, focus: true}));
        }
        return;
      } else if (addMode === "rectangular-building") {
        dispatch(addBuilding({
          type: "rectangular",
          x: x,
          y: y,
          width: 50,
          height: 50,
          rotation: 0,
        }));
      } else if (addMode === "circular-building") {
        dispatch(addBuilding({
          type: "circular",
          x: x,
          y: y,
          radius: 25
        }));
      }
    }

    function mouseUpHandler(e: MouseEvent) {
      setHolding(false); 
    }

    canvas.addEventListener("mousemove", mouseMoveHandler);
    canvas.addEventListener("mousedown", mouseDownHandler);
    canvas.addEventListener("mouseup", mouseUpHandler);

    return () => {
      canvas.removeEventListener("mousemove", mouseMoveHandler);
      canvas.removeEventListener("mousedown", mouseDownHandler);
      canvas.removeEventListener("mouseup", mouseUpHandler);
    }
  }, [map, hoverTarget, holding, width, height]);

  return (<>
      <div className="absolute top-2 left-2 flex flex-col gap-2">
        <div className="p-2 rounded-lg bg-crust border border-overlay0">
          <p>{cursorPos.x}, {cursorPos.y}</p>
        </div>
      </div>
      <canvas className={cursorStyle} ref={canvasRef} width={width} height={height} />
  </>);
}
