import { FormEvent, HTMLAttributes, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";

export function EditableText({ text, setText }: { text: string, setText: (t: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [inputText, setInputText] = useState(text);

  const inputRef = useRef(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inputText === "") {
      setInputText(text);
    } else {
      setText(inputText);
    }
    setEditing(false);
  }

  return (
    <div className="group">
      <form className={editing ? "inline" : "hidden"} onSubmit={onSubmit}>
        <input ref={inputRef} className="bg-surface0/50 focus:outline-none text-center" value={inputText} onChange={(e) => setInputText(e.currentTarget.value)} />
      </form>
      {editing ? <></> :
      <div className="flex flex-row gap-2 relative hover:cursor-pointer"
          onClick={() => { setEditing(true); }} >
        <h2>{text}</h2>
        <button className="hidden group-hover:inline absolute left-full"><MdEdit className="w-6 h-6" /></button>
      </div>}
    </div>
  );
}


type ButtonProps = HTMLAttributes<HTMLButtonElement>;

function IconButton({ className, ...props }: ButtonProps) { 
  return <button className={"hover:bg-overlay0/20 p-1 rounded-md " + className} {...props} />;
}

export type SelectableButtonProps = { selected?: boolean } & ButtonProps;

function SelectableButton({ selected, className, ...props }: SelectableButtonProps) {
  return <Button className={selected ? "border-sky bg-sky/5 text-sky hover:bg-sky/15 hover:border-sky" : ""} {...props} />
}

function Button({ className, ...props }: ButtonProps) {
  return <button className={"px-4 py-2 rounded-md border border-surface2 hover:border-text hover:bg-surface2/20 flex flex-row flex-nowrap items-center gap-3 " + className} {...props}/>;
}

export { IconButton, Button, SelectableButton }
