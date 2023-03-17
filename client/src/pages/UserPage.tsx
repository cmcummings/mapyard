import axios from "axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";



export default function UserPage() {
  const { isLoading, error, data } = useQuery("userMaps", async () => {
    return axios.get("http://localhost:3000/api/maps", { withCredentials: true }).then(res => res.data);
  });

  return <>
    <Navbar mid="Your Maps" />
    <div className="p-8 lg:mx-52 xl:mx-72 2xl:mx-96 flex flex-col">
      { 
        isLoading
      ? <>Retrieving your maps...</>
      : <div className="rounded-md divide-y divide-surface2 bg-mantle border border-surface2"> 
          {data.map((map: { _id: string, name: string }) =>  
            <div className="p-3" key={map._id}>
              <Link to={"/build/" + map._id} className="text-lg text-blue hover:underline">{map.name}</Link>
            </div>
          )}
        </div>
      }
    </div>
  </>
}
