import { useCallback, useState } from "react"
import { useDispatch } from "react-redux"

import axios from "axios"



export default function useFetch() {
    const [data, setdata] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)


    const fetchAgent = useCallback(async (params) => {
        setLoading(true)
        setError(null)
        setdata(null)
        try {
            const token = sessionStorage.getItem("token");
            const resp = await axios.get(import.meta.env.VITE_BASE_URL + `/admin/${params}`, {
                headers:{
                    "Authorization": `Bearer ${token}`
                }
            })

            if (resp?.data?.success) {
                setdata(resp?.data?.lists)
            }
        } catch (error) {
            console.log(error);

            setError(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    })

    return { fetchAgent, loading, error, data }
}