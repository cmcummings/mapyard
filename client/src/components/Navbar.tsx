import { ReactNode, useState } from "react";
import { IconButton } from "./generic";
import { HiChevronDown } from "react-icons/hi2";
import { Link } from "react-router-dom";

function UserDropdown() {
  const [open, setOpen] = useState(false);

  return (<div className="relative">
    <IconButton onClick={() => setOpen(s => !s)}>
      <HiChevronDown className="w-6 h-6" />
    </IconButton>
    {open 
    ?
    <div className="z-10 absolute right-0 bg-mantle rounded-md border border-surface2 p-3 flex flex-col gap-3 text-right">
      <Link to="/user" className="hover:underline whitespace-nowrap">View your maps</Link>
      <a className="hover:underline hover:cursor-pointer">Logout</a>      
    </div> 
    : <></>}
  </div>);
}

export default function Navbar({ left, mid }: { left?: ReactNode, mid?: ReactNode }) 
{
  return (
    <div className="p-2 bg-mantle border-b border-b-surface2 flex flex-row">
      <div className="grow flex items-center flex-row gap-2">
        {left}
      </div>
      <div className="grow flex justify-center items-center">
        {mid}
      </div>
      <div className="grow justify-end flex flex-row gap-2 items-center">
        <h2>Username</h2>
        <UserDropdown />
      </div>
    </div>
  );
}
