import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";



export default function UserPage() {
  return <>
    <Navbar mid="Your Maps" />
    <div className="p-8 lg:mx-52 xl:mx-72 2xl:mx-96 flex flex-col">
      <div className="rounded-md divide-y divide-surface2 bg-mantle border border-surface2"> 
        <div className="p-3">
          <Link to="/build/" className="text-lg text-blue hover:underline">Example map</Link>
          <p className="text-subtext0">Last edited on Thursday, March 16, 2023 at 11:00 AM</p>
        </div>
      </div>
    </div>
  </>
}
