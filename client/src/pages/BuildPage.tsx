import { HiChevronDown, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useState, useRef, useEffect } from "react";   
import { EditableText, IconButton } from "../components/generic";
import MapCanvas from "../components/MapCanvas";
import { Properties } from "../components/Properties";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { AddMode, setMode, setName } from "../redux/map";
import { Link } from "react-router-dom";


function AddTools() {
  const addMode = useAppSelector((state) => state.map.addMode);
  const dispatch = useAppDispatch();
  
  function Option({ label, name }: { label: string, name: AddMode }) { 
    return (
      <button 
        className={"hover:bg-surface2/25 px-4 py-2 " + (addMode === name ? "bg-surface2/40" : "")} 
        onClick={() => dispatch(setMode(addMode === name ? null : name))}>
        {label}
      </button>
    );
  }

  return (
    <div className="border border-surface2 overflow-hidden rounded-lg flex flex-col divide-y divide-surface2">
      <Option label="Road" name="road" />
      <Option label="Rectangular Building" name="rectangular-building" />
      <Option label="Circular Building" name="circular-building" />
    </div>
  );
}


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


export default function BuildPage() {
  const mapRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const mapName = useAppSelector((state) => state.map.name);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapSize, setMapSize] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const map = mapRef.current
    if (!map) return;

    function canvasResizeHandler() {
      if (!mapRef.current) return;
      const rect = mapRef.current.getBoundingClientRect();
      setMapSize([rect.width, rect.height]); 
    }

    canvasResizeHandler();

    const obs = new ResizeObserver(canvasResizeHandler);
    obs.observe(map);
    
    return () => {
      obs.disconnect();
    }
  }, []);

  return (<div className="h-screen overflow-hidden flex flex-col">
    {/* Topbar */}
    <div className="p-2 bg-mantle border-b border-b-surface2 flex flex-row">
      <div className="grow flex items-center flex-row gap-2">
        <IconButton onClick={() => setSidebarOpen(s => !s)}>
          {sidebarOpen 
            ? <HiChevronLeft className="w-6 h-6" />
            : <HiChevronRight className="w-6 h-6" />}
        </IconButton>
        <p>Editor</p>
      </div>
      <div className="grow flex justify-center items-center">
        <EditableText text={mapName} setText={(t) => dispatch(setName(t))} />
      </div>
      <div className="grow justify-end flex flex-row gap-2 items-center">
        <h2>Username</h2>
        <UserDropdown />
      </div>
    </div>
    <div className="flex flex-row grow"> 
      {/* Sidebar */}
      {sidebarOpen ?
        <div className="w-72 bg-crust p-3 border-r border-r-surface2 divide-y divide-surface2 flex flex-col gap-4">
          <div className="flex flex-col gap-2 justify-start">
            <h3 className="text-xl">Add</h3>
            <AddTools />
          </div>
          <Properties />
        </div> 
        : <></>}
      {/* Map Canvas */}
      <div className="relative grow overflow-hidden" ref={mapRef}>
        <MapCanvas width={mapSize[0]} height={mapSize[1]} />         
      </div>
    </div>
  </div>);
}
