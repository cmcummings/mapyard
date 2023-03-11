import { ChangeEvent, FormEvent, HTMLAttributes } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { BuildingEdits, editBuilding, editRoad, INode, IBuilding, IRoad, RoadDirection, RoadEdits } from "../redux/map";
import { degToRad, parseIntSafe, radToDeg } from "../util";
import { InputHTMLAttributes, ReactNode } from "react";

function FieldInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={"bg-transparent border border-surface2 focus:outline-sky outline-offset-0 outline-none rounded-md p-1 appearance-none  " + className} {...props} />
}

function FieldSelect({ className, ...props }: InputHTMLAttributes<HTMLSelectElement>) {
  return <select className={"bg-transparent border border-surface2 p-1 " + className} {...props} />
}

function Field({ label, children }: { label: string, children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      {children}
    </div>
  );
}

function FieldsContainer(props: HTMLAttributes<HTMLDivElement>) {
  return <div className="flex flex-col gap-4" {...props} />
}

function FieldsHeading({ text }: { text: string }) {
  return <h3 className="text-xl">{text}</h3>;
}

type BuildingFieldsProps = { id: number, building: IBuilding };

function BuildingFields({ id, building }: BuildingFieldsProps) { 
  const dispatch = useAppDispatch();  

  function edit(fun: (val: string) => BuildingEdits) {
    return (e: FormEvent<HTMLInputElement>) => {
      dispatch(editBuilding({
        index: id,
        edits: fun(e.currentTarget.value)
      }));
    }
  }
 
  let shapeFields;

  switch (building.type) {
    case "rectangular":
      shapeFields = <>
        <Field label="Rotation (degrees)">
          <FieldInput type="number" value={radToDeg(building.rotation).toString()} onChange={edit((v) => ({ rotation: degToRad(parseIntSafe(v)) }))}/>
        </Field>
        <Field label="Width">
          <FieldInput type="number" value={building.width.toString()} onChange={edit((v) => ({ width: parseIntSafe(v) }))}/>
        </Field>
        <Field label="Height">
          <FieldInput type="number" value={building.height.toString()} onChange={edit((v) => ({ height: parseIntSafe(v) }))}/>
        </Field>
      </>;
      break;
    case "circular":
      shapeFields = <>
        <Field label="Radius">
          <FieldInput type="number" value={building.radius.toString()} onChange={edit((v) => ({ radius: parseIntSafe(v) }))}/>
        </Field>
      </>;
  }

  return <FieldsContainer>
    <FieldsHeading text="Building" />
    <Field label="X Position">
      <FieldInput type="number" value={building.x.toString()} onChange={edit((v) => ({ x: parseIntSafe(v) }))} />
    </Field>
    <Field label="Y Position">
      <FieldInput type="number" value={building.y.toString()} onChange={edit((v) => ({ y: parseIntSafe(v) }))}/>
    </Field>
    {shapeFields}
  </FieldsContainer>
}

function RoadFields({ id, road }: { id: number, road: IRoad }) {
  const dispatch = useAppDispatch();

  function edit(fun: (val: string) => RoadEdits) {
    return (e: FormEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
      dispatch(editRoad({
        index: id,
        edits: fun(e.currentTarget.value)
      }));
    }
  }
  
  return (
    <FieldsContainer>
      <FieldsHeading text="Road" />
      <Field label="Direction">
        <FieldSelect value={road.direction} onChange={edit((v) => ({ direction: v as RoadDirection }))}>
          <option value="forward">Forward</option>
          <option value="backward">Backward</option>
          <option value="none">None</option>
        </FieldSelect>
      </Field>
      <Field label="Label">
        <FieldInput type="text" value={road.label} onChange={edit((v) => ({ label: v }))} />
      </Field>
    </FieldsContainer>
  );
}

function NodeFields({ id, node }: { id: number, node: INode }) {
  const dispatch = useAppDispatch();

  function edit(fun: (val: string) => BuildingEdits) {
    return (e: FormEvent<HTMLInputElement>) => {
      dispatch(editBuilding({
        index: id,
        edits: fun(e.currentTarget.value)
      }));
    }
  }

  return (
    <FieldsContainer>
      <FieldsHeading text="Node" />
      <Field label="Position X">
        <FieldInput type="number" value={node.x.toString()} onChange={edit((v) => ({ x: parseIntSafe(v) }))} />
      </Field>
      <Field label="Position Y">
        <FieldInput type="number" value={node.y.toString()} onChange={edit((v) => ({ y: parseIntSafe(v) }))} />
      </Field>
    </FieldsContainer>
  );
}

export function Properties() {
  const mapState = useAppSelector((state) => state.map.map);
  const selection = useAppSelector((state) => state.map.selection);

  if (!selection) return <></>;

  let fields;
  switch (selection.type) {
    case "building":
      fields = <BuildingFields id={selection.index} building={mapState.buildings[selection.index]} />;
      break; 
    case "road":
      fields = <RoadFields id={selection.index} road={mapState.roads[selection.index]} />;
      break;
    case "node":
      fields = <NodeFields id={selection.index} node={mapState.nodes[selection.index]} />;
      break;
  }

  return (
    <div className="flex flex-col gap-2 justify-start pt-2">
      {fields} 
    </div>
  );
}


