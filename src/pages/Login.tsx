// import { stat } from "fs"
import { AtSignIcon, EyeIcon, EyeOffIcon, LockIcon, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Toaster } from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("signup");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, signup, user } = useAppContext();
  const handleSubmit = async(e: React.FormEvent)=>{
    e.preventDefault()
    setIsSubmitting(true)
    if(state==='login'){
      await login({email, password})
    }else{
      await signup({username, email, password})
    }
    setIsSubmitting(false)
  }

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <>
      <Toaster/>
      <main className="login-page-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
            {state === "login" ? "Login" : "Sign Up"}
          </h2>
          <p className="text-sm mt-2 text-gray-500/90 dark:text-gray-400">
            {state === "login"
              ? "Welcome back! Please enter your credentials."
              : "Create a new account by filling out the form."}
          </p>

          {state !== "login" && (
            <div className="mt-4">
              <label
                htmlFor="name"
                className="font-medium text-sm text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <div className="relative mt-2">
                <AtSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 size-4.5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  className="login-input"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
          )}
          <div className="mt-4">
            <label
              htmlFor="name"
              className="font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 size-4.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="name"
              className="font-medium text-sm text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative mt-2">
              <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 size-4.5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input pr-10"
                placeholder="Enter a password"
                required
              />
              <button
                type="button"
                className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOffIcon size={16} />
                ) : (
                  <EyeIcon size={16} />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="login-button"
          >
            {isSubmitting
              ? "Loading..."
              : state === "login"
                ? "Login"
                : "Sign Up"}
          </button>

          {state === "login" ? (
            <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
              Don't have an account? <button className="ml-1 cursor-pointer text-green-600 hover:underline" onClick={()=>setState("signup")}>Sign up</button>
            </p>
          ) : (
            <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
              Already have an account? <button className="ml-1 cursor-pointer text-green-600 hover:underline" onClick={()=>setState("login")}>Login</button>
            </p>
          )}
        </form>
      </main>
    </>
  );
};

export default Login;
