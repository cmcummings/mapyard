import { FormEvent, useRef } from "react";
import  { useAppSelector, useAppDispatch } from "../redux/hooks";
import { editBuilding, IBuilding } from "../redux/map";

function Field({ label, name }: { label: string, name: string }) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input name={name} />
    </div>
  );
}

function BuildingFields({ id, building }: { id: number, building: IBuilding }) { 
  const dispatch = useAppDispatch(); 

  function edit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch
  }

  if (building.type === "rectangular") {
    return <form onSubmit={edit}>
      <Field label="Rotation" name="rotation" />
    </form>
  }

  return <></>
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
      <h3 className="text-xl">Selection</h3>
      {fields} 
    </div>
  );
}
