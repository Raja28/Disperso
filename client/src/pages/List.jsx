import { useEffect } from "react"
import { Link } from "react-router-dom"
import useFetch from "../hooks/useFetch"
import profileImage from "../assets/pp.jpg"

export default function
    List() {
    const { fetchAgent, loading, error, data } = useFetch()

    useEffect(() => {
        fetchAgent("list")
    }, [])

    return (
        <section className="container vh-100 border">
            <div className="d-flex  mt-2">
                <Link to={"/dashboard"} className="">Back</Link>
                <h2 className="text-center w-100">Lists</h2>
            </div>
            {
                loading && <div className=" h-100 d-flex justify-content-center align-items-center">
                    <span className="loader mx-auto"></span>
                </div>
            }
            {
                !loading && error && (
                    <div className=" h-100 d-flex justify-content-center align-items-center">
                        <div className="text-center">
                            <p>{error}</p>
                            <Link to={"/dashboard"} className="btn btn-sm btn-primary">Dashboard</Link>
                        </div>
                    </div>
                )
            }
            <>
                {
                    !loading && data?.length > 0 && <div className="card-group">
                        {/* <div className="row gap-3 mx-2">
                            {
                                data?.map(agent => (
                                    <div key={agent?._id} className="card my-1  " style={{ maxWidth: "11rem" }}>
                                        <img
                                            src={profileImage}
                                            className="card-img-top bg-primary"
                                            alt="user profile image"
                                        />
                                        <div className="card-body fs-6 px-1">
                                            <p className="card-text p-0 m-0 d-flex flex-column">
                                                <small className="fw-semibold">Name:</small>
                                                <small>{agent?.name}</small>
                                            </p>
                                            <p className="card-text p-0 m-0 d-flex flex-column">
                                                <small className="fw-semibold">Email:</small>
                                                <small>{agent?.email}</small>
                                            </p>
                                            <p className="card-text p-0 m-0 d-flex flex-column">
                                                <small className="fw-semibold">Contact:</small>
                                                <small>{agent?.mobile}</small>
                                            </p>
                                        </div>
                                    </div>
                                ))
                            }

                        </div> */}
                        <table className="table border text-center">
                            <thead>
                                <tr>
                                    {/* <th scope="col">#</th> */}
                                    <th scope="col ">Name</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Note</th>
                                    <th scope="col">Agent</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    data?.map(list => (

                                        list.tasks.map(task => (
                                            <tr key={task?._id} className="">
                                            <td>{task?.firstName}</td>
                                            <td>{task?.phone}</td>
                                            <td>{task.notes}</td>
                                            <td>{list?.agentId?.name}</td>
                                        </tr>
                                        ))

                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </>

        </section>
    )
}