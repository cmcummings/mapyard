import { HiOutlineSave } from "react-icons/hi";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useState, useRef, useEffect } from "react";   
import { EditableText, IconButton } from "../components/generic";
import MapCanvas from "../components/MapCanvas";
import { Properties } from "../components/Properties";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { AddMode, load, reset, setMode, setName } from "../redux/map";
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
 
  const [loading, setLoading] = useState(false);

  function fetchMapData() {
    setLoading(true);
    dispatch(reset());
    axios.get("/api/maps?id=" + id, { withCredentials: true }).then(res => {
      dispatch(load(res.data[0]));
      setLoading(false);
    }).catch(console.error);
  }

  useEffect(fetchMapData, [id]);

  const mapRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const mapName = useAppSelector((state) => state.map.name);
  const map = useAppSelector((state) => state.map.map);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapSize, setMapSize] = useState<[number, number]>([0, 0]);

  const [saving, setSaving] = useState(false);
  function save() {
    setSaving(true);
    axios.post("/api/maps", {
      id: id,
      updates: {
        name: mapName,
        objects: map
      }
    }, { withCredentials: true }).then(() => {
      console.log("Successfully saved");
      setSaving(false);
    });
  }

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

  useEffect(() => {
    
    function alertUser(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", alertUser)

    return () => {
      window.removeEventListener("beforeunload", alertUser);
    }
  }, []);

  if (loading) {
    return <div className="flex justify-center mt-3">
      <p>Loading...</p>
    </div>
  }

  return (<> 
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Topbar */}
      <Navbar left={<>
          <IconButton onClick={() => setSidebarOpen(s => !s)} className="flex flex-row gap-2">
            {sidebarOpen 
              ? <HiChevronLeft className="w-6 h-6" />
              : <HiChevronRight className="w-6 h-6" />}
            <p>Edit</p>
          </IconButton>
          <IconButton onClick={save} className="flex flex-row gap-2">
            <HiOutlineSave className="w-6 h-6" />
            <p>{saving ? "Saving..." : "Save"}</p>
          </IconButton>
      </>} mid={<>
        <EditableText text={mapName} setText={(t) => { dispatch(setName(t)) }} />
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
    </div>
  </>);
}
