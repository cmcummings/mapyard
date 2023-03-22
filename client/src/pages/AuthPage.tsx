import { useState } from "react";
import { useForm } from "react-hook-form"
import { register as registerAccount, login } from "../auth";

interface RegisterFormData {
  username: string,
  password: string,
}

function RegisterForm() {
  const { register, handleSubmit } = useForm<RegisterFormData>();

  const [error, setError] = useState<string | null>(null);

  const onSubmit = handleSubmit(data => {
    registerAccount(data.username, data.password).then(() => {
      window.location.href = "/"
    }).catch(err => {
        if (err.response) {
          if (err.response.data.message) {
            setError(err.response.data.message);
          } else {
            setError("An unknown error occurred.");
          }
        }
      });
  });

  return (
    <form onSubmit={onSubmit} className="flex items-start flex-col gap-2 p-5 justify-center">
      <h1 className="text-bold text-xl self-center">Register</h1>
      <label>Username</label>
      <input className="p-2 bg-crust" {...register("username", { required: true })} />
      <label>Password</label>
      <input className="p-2 bg-crust" type="password" {...register("password", { required: true })} />
      <button type="submit" className="bg-teal hover:bg-teal/80 text-base p-2 rounded-md">Register</button>
      {
        error
        ? <p className="text-red">{error}</p>
        : <></>
      }
    </form>
  )
}


interface LoginFormData {
  username: string,
  password: string
}

function LoginForm() {
  const { register, handleSubmit } = useForm<LoginFormData>();

  const [error, setError] = useState<string | null>(null);

  const onSubmit = handleSubmit(data => {
    login(data.username, data.password).then(() => {
      window.location.href = "/"
    }).catch(err => {
        if (err.response) {
          if (err.response.data.message) {
            setError(err.response.data.message);
          } else {
            setError("An unknown error occurred.");
          }
        }
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex items-start flex-col gap-2 p-5 justify-center">
      <h1 className="text-bold text-xl self-center">Login</h1>
      <label>Username</label>
      <input className="p-2 bg-crust" {...register("username", { required: true, value: "connor" })} />
      <label>Password</label>
      <input className="p-2 bg-crust" type="password" {...register("password", { required: true, value: "password" })} />
      <button type="submit" className="bg-teal hover:bg-teal/80 text-base p-2 rounded-md">Log in</button>
      <p className="w-56">The login form has been automatically filled with a test user you are free to use. (connor/password)</p>
      {
        error
        ? <p className="text-red">{error}</p>
        : <></>
      }
    </form>
  )
}

export default function AuthPage() {
  const [mode, setMode] = useState(false);

  return (
    <div className="p-8 lg:mx-52 xl:mx-72 2xl:mx-96 flex flex-col items-center gap-4">
      <div className="text-center">
        <h1 className="text-3xl">Mapyard</h1>
        <p>Create your own maps on the web.</p>
      </div>
      <div className="rounded-md divide-y divide-surface2 bg-mantle border border-surface2"> 
        <div className="flex flex-row">
          <button className="basis-1/2 p-2 hover:bg-crust/80 rounded-tl-md" onClick={() => setMode(false)}>Login</button>
          <button className="basis-1/2 p-2 hover:bg-crust/80 rounded-tr-md" onClick={() => setMode(true)}>Register</button>
        </div>
        {
          mode 
          ? <RegisterForm />
          : <LoginForm />
        }
      </div>
    </div>
  );
}
