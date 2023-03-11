import Navbar from "../components/Navbar";


export default function UserPage() {
  return <>
    <Navbar />
    <div className="p-8 flex flex-col">
      <div className="rounded-md divide-y divide-surface2 bg-mantle border border-surface2">
        <div className="p-3">
          <p>Your maps</p> 
        </div>
        <div className="p-3">
          That one map
        </div>
      </div>
    </div>
  </>
}
