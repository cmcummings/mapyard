import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useState, useRef, useEffect } from "react";   
import { EditableText, IconButton } from "../components/generic";
import MapCanvas from "../components/MapCanvas";
import { Properties } from "../components/Properties";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { AddMode, load, setMode, setName } from "../redux/map";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";


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




export default function BuildPage() {
  const { id } = useParams();
  const { isLoading, error, data } = useQuery("buildMap", async () => {
    return axios.get("http://localhost:3000/api/maps?id=" + id, { withCredentials: true }).then(res => res.data[0]);
  });

  const mapRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const mapName = useAppSelector((state) => state.map.name);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapSize, setMapSize] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (!isLoading) {
      dispatch(load(data));
    }
    
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
  }, [data]);


  if (isLoading) {
    return <div className="text-center mt-5">Loading...</div>
  }

  return (<div className="h-screen overflow-hidden flex flex-col">
    {/* Topbar */}
    <Navbar left={<>
        <IconButton onClick={() => setSidebarOpen(s => !s)}>
          {sidebarOpen 
            ? <HiChevronLeft className="w-6 h-6" />
            : <HiChevronRight className="w-6 h-6" />}
        </IconButton>
        <p>Editor</p>
    </>} mid={<>
      <EditableText text={mapName} setText={(t) => dispatch(setName(t))} />
    </>} />
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
