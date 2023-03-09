import { HTMLAttributes } from "react";

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
