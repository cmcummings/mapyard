import { FormEvent, InputHTMLAttributes, ReactNode } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { BuildingEdits, editBuilding, IBuilding } from "../redux/map";
import { degToRad, parseIntSafe, radToDeg } from "../util";

function FieldInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={"bg-transparent border border-surface2 focus:outline-sky outline-offset-0 outline-none rounded-md p-1 appearance-none  " + className} {...props} />
}

function Field({ label, children }: { label: string, children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      {children}
    </div>
  );
}

type BuildingFieldProps = { id: number, building: IBuilding };

function RectangularBuildingFields({ id, building }: BuildingFieldProps) {
  if (building.type !== "rectangular") return <></>;
  
  const dispatch = useAppDispatch();  

  function edit(fun: (val: string) => BuildingEdits) {
    return (e: FormEvent<HTMLInputElement>) => {
      dispatch(editBuilding({
        index: id,
        edits: fun(e.currentTarget.value)
      }));
    }
  }
  
  if (building.type === "rectangular") {
    return <div className="flex flex-col gap-4">
      <h3 className="text-xl">Building</h3>
      <Field label="X Position">
        <FieldInput type="number" value={building.x} onChange={edit((v) => ({ x: parseIntSafe(v) }))} />
      </Field>
      <Field label="Y Position">
        <FieldInput type="number" value={building.y} onChange={edit((v) => ({ y: parseIntSafe(v) }))}/>
      </Field>
      <Field label="Rotation (degrees)">
        <FieldInput type="number" value={radToDeg(building.rotation)} onChange={edit((v) => ({ rotation: degToRad(parseIntSafe(v)) }))}/>
      </Field>
      <Field label="Width">
        <FieldInput type="number" value={building.width} onChange={edit((v) => ({ width: parseIntSafe(v) }))}/>
      </Field>
      <Field label="Height">
        <FieldInput type="number" value={building.height} onChange={edit((v) => ({ height: parseIntSafe(v) }))}/>
      </Field>
    </div>
  }

  return <></>
}

function BuildingFields({ id, building }: BuildingFieldProps) { 
  if (building.type === "rectangular") return <RectangularBuildingFields id={id} building={building} />;
  return <></>;
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
  }

  return (
    <div className="flex flex-col gap-2 justify-start pt-2">
      {fields} 
    </div>
  );
}
