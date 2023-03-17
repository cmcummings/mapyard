import { useForm } from "react-hook-form"
import { login } from "../auth";


interface LoginFormData {
  username: string,
  password: string
}

function LoginForm() {
  const { register, handleSubmit } = useForm<LoginFormData>();

  const onSubmit = handleSubmit(data => {
    console.log(data);
    login(data.username, data.password).then(() => {
      window.location.href = "/user"
    }).catch(err => {
      console.error(err);
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <input {...register("username", { required: true })} />
      <input {...register("password", { required: true })} />
      <button type="submit">Submit</button>
    </form>
  )
}


export default function LoginPage() {
  return <>
    <div className="p-8 lg:mx-52 xl:mx-72 2xl:mx-96 flex flex-col">
      <div className="rounded-md divide-y divide-surface2 bg-mantle border border-surface2"> 
        <LoginForm />     
      </div>
    </div>
  </>
}
