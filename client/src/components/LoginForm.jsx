import { useState } from "react"
import disperso_logo_new from "../assets/disperso_logo_new.png"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../features/user"
const _status = "loading"
export const LoginForm = () => {

    const [loginData, setLoginData] = useState({
        email: "", password: ""
    })
    const { status } = useSelector(state => state.user)
    function changeHandler(e) {
        const { name, value } = e.target

        setLoginData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function loginHandler(e) {
        e.preventDefault()

        if (!loginData.email || !loginData.password) {
            toast.error("Email & password required")
            return
        }

        try {
            const resp = await dispatch(loginUser(loginData)).unwrap()
            if (resp?.success) {
                navigate('/dashboard');
            }
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <section className="vh-100 d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
            <div className="p-3 mx-2 shadow-lg rounded-5 border border-warning d-flex flex-column gap-3 justify-content-center align-items-center" style={{ width: "30rem", }}>

                <div className="mx-auto">
                    <div className=" mx-auto" style={{ maxWidth: "14rem" }}>
                        <img src={disperso_logo_new} alt="disperso logo" className="w-100 h-100" />

                    </div>
                    <div className="text-center p-1 fw-semibold" style={{ fontSize: "0.9rem" }}>
                        <p className="m-0">Start managing your lists smarter </p>
                        <p className="m-0">and get organized.</p>
                    </div>
                </div>
                <div>
                    <h4 className="m-0">Login</h4>
                </div>
                <form onSubmit={loginHandler} className=" w-100 py-1 px-2 " >
                    <div className="form-floating mb-3">
                        <input type="email"
                            className="form-control"
                            id="floatingInput"
                            placeholder="name@example.com"
                            disabled={status === _status ? true : false}
                            name="email"
                            value={loginData.email}
                            onChange={(e) => changeHandler(e)}
                        />
                        <label htmlFor="floatingInput">Email address</label>
                    </div>
                    <div className="form-floating position-relative">
                        <input
                            type={"password"}
                            className="form-control position-relative"
                            id="floatingPassword" placeholder="Password"
                            disabled={status === _status ? true : false}
                            name="password"
                            value={loginData.password}
                            onChange={(e) => changeHandler(e)}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="mt-4 d-flex justify-content-center align-items-center">
                        <button className="btn btn-warning m-0 w-75"
                            disabled={status === _status ? true : false}
                            type="submit"
                        // onClick={loginHandler}
                        >
                            {status === _status ? "Please wait..." : "Login"}

                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}