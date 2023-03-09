import { HiChevronDown, HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useState, useRef, useEffect } from "react";   
import { IconButton } from "../components/generic";
import MapCanvas from "../components/MapCanvas";
import { Properties } from "../components/Properties";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { AddMode, setMode } from "../redux/map";


function AddTools() {
  const addMode = useAppSelector((state) => state.map.addMode);
  const dispatch = useAppDispatch();
  
  function Option({ label, name }: { label: string, name: AddMode }) { 
    return (
      <button 
        className={addMode === name ? "bg-surface2/40" : ""} 
        onClick={() => dispatch(setMode(addMode === name ? null : name))}>
        {label}
      </button>
    );
  }

  return (
    <div className="border border-surface2 overflow-hidden rounded-lg flex flex-col divide-y divide-surface2">
      <Option label="Road" name="road" />
      <Option label="Rectangular Building" name="rectangular-building" />
    </div>
  );
}

export default function BuildPage() {
  const mapRef = useRef<HTMLDivElement>(null);

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

  return (<div className="h-screen flex flex-col">
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
        <h2>Map Name</h2>
      </div>
      <div className="grow justify-end flex flex-row gap-2 items-center">
        <h2>Username</h2>
        <IconButton>
          <HiChevronDown className="w-6 h-6" />
        </IconButton>
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
      <div className="grow overflow-hidden" ref={mapRef}>
        <MapCanvas width={mapSize[0]} height={mapSize[1]} />         
      </div>
    </div>
  </div>);
}
