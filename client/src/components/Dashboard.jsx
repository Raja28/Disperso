import react_image from "../assets/react.svg"
import { MdGroupAdd } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import { FiEyeOff } from "react-icons/fi";
import { IoIosList } from "react-icons/io";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addNewAgent, clearSlice, uploadList } from "../features/user";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const allowedExtensions = ['csv', 'xlsx', 'xls'];
const requiredHeaders = ['FirstName', 'Phone', 'Notes'];

export const Dashboard = () => {
    const [agentData, setAgentData] = useState({ name: "", email: "", password: "", contact_no: "", country_code: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [fileData, setFileData] = useState([]);
    const [data, setData] = useState([]);

    const { user } = useSelector(state => state.user)

    const modalCloseBtn = useRef()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const fr = new FileReader()
    const selectInputField = useRef()

    function changeHandler(e, value, name) {

        if (name === "contact_no") {

            const splitValue = e?.split(value.dialCode)
            setAgentData(prev => ({
                ...prev,
                ["contact_no"]: "+" + value?.dialCode + splitValue?.[1] || ""
            }))
        } else {
            const { name, value } = e.target
            setAgentData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    async function addAgentHandler(e) {
        e.preventDefault()
        const { name, email, password, contact_no, } = agentData
        if (!name || !email || !password || !contact_no) {
            toast.error("All fields required")
            return
        }

        try {
            const resp = await dispatch(addNewAgent(agentData)).unwrap()

            if (resp.success) {
                toast.success("Agent added successfully")
                modalCloseBtn.current.click()
                setAgentData({ name: "", email: "", password: "", contact_no: "", country_code: "" })
            }
        } catch (error) {
            toast.error(error)
        }

    }

    async function uploadDataHandler() {
      
        if (data.length == 0) {
            toast.error("Choose .csv, .xlsx or xls file")
            return
        }
        try {

            const resp = await dispatch(uploadList({ data })).unwrap()
      
            toast.success(resp?.message)
            setData([])

            if (selectInputField.current) {
                selectInputField.current.value = '';
            }

        } catch (error) {
            toast.error(error)
        }

    }

    const validateHeaders = (headers) => {
        return requiredHeaders.every((h) => headers.includes(h));
    };

    const handleFileUpload = (e) => {
        setData([]);

        const file = e.target.files[0];
        if (!file) return;

        const extension = file.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            // setError('Invalid file type. Please upload a CSV, XLSX, or XLS file.');
            toast.error('Invalid file type. Please upload a CSV, XLSX, or XLS file.');
            return;
        }

        const reader = new FileReader();

        if (extension === 'csv') {
            reader.onload = (e) => {
                const text = e.target.result;
                const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

                if (!validateHeaders(parsed.meta.fields)) {
                    // setError('CSV file must contain headers: FirstName, Phone, Notes');
                    toast.error('CSV file must contain headers: FirstName, Phone, Notes')
                    return;
                }

                const validData = parsed.data.filter((row) =>
                    row.FirstName && row.Phone && row.Notes
                );

                setData(validData);
            };
            reader.readAsText(file);
        } else {
            reader.onload = (e) => {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json(sheet);

                const headers = Object.keys(json[0] || {});
                if (!validateHeaders(headers)) {
                    // setError('Excel file must contain headers: FirstName, Phone, Notes');
                    toast.error('Excel file must contain headers: FirstName, Phone, Notes')
                    return;
                }

                const validData = json.filter((row) =>
                    row.FirstName && row.Phone && row.Notes
                );

                setData(validData);
            };
            reader.readAsBinaryString(file);
        }
    };

    function logouthandler() {
        sessionStorage.clear()
        dispatch(clearSlice())
        navigate("/")
    }

    return (
        <section className="container py-3 mt-3">

            <div className="row gy-3 d-flex   justify-content-center gap-3 border mx-2">

                {/* left */}
                <div className="border col col-mg-4  shadow py-2 px-2 rounded-5 d-flex flex-column align-items-center justify-content-center"
                    style={{ maxWidth: "20rem" }}
                >
                    <div className="w-25 rounded rounded-circle" style={{}}>
                        <img src={user?.profileImage} alt="user image" className="w-100 h-100 rounded rounded-circle" />
                    </div>
                    <div className="my-4">
                        <div className="d-flex gap-2">
                            <p>
                                <strong>Email:</strong>
                            </p>
                            <p>rajadDavid@gmail.com</p>
                        </div>
                        <div className="">
                            <p
                                onClick={logouthandler}
                                className="btn btn-sm btn-danger w-100">
                                Logout

                            </p>
                        </div>
                    </div>
                </div>

                {/* right */}
                <div className="col-sm-12 col-md-12 col-lg-8  border rounded-5 shadow  p-4" style={{ maxWidth: "" }}>

                    <div className="">
                        <label htmlFor="" className="form-label text-sm">
                            <small>Upload file:</small>
                        </label>
                        <div className="d-flex gap-3 align-items-center justify-content-center ">
                            <input
                                type="file"
                                ref={selectInputField}
                                accept=".csv,.xlsx,.xls"
                                className="form-control"
                                onChange={handleFileUpload}
                            />
                            <div
                                onClick={uploadDataHandler}
                                className="btn btn-sm btn-primary">
                                Upload
                            </div>
                        </div>
                    </div>

                    <div className=" my-2 p-2 gap-3 w-100 d-flex justify-content-center ">
                        <div
                            data-bs-toggle="modal" data-bs-target="#addAgentModal" data-bs-whatever="@mdo"
                            className="rounded-4 border border-warning p-3 text-center text-secondary" style={{ maxWidth: "8rem", cursor: "pointer" }}>
                            <p className="">Add Agent</p>
                            <div className="w-25 mx-auto">
                                <MdGroupAdd className="w-100 h-100" />
                            </div>
                        </div>
                        <Link to={"/dashboard/list"}
                            className="rounded-4 border border-warning p-3 text-center text-secondary text-decoration-none"
                            style={{ maxWidth: "8rem", cursor: "pointer" }}>
                            <p className="">View List</p>
                            <div className="w-25 mx-auto">
                                <IoIosList className="w-100 h-100" />
                            </div>
                        </Link>

                    </div>

                </div>
            </div>

            {/* add-agent modal */}
            <div className="modal fade" id="addAgentModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Agent</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-2">
                                    <label htmlFor="name" className="col-form-label">Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={agentData.name}
                                        onChange={(e) => changeHandler(e)}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="Contact" className="col-form-label">Contact:</label>
                                    <PhoneInput
                                        country={"in"}
                                        value={`${agentData.country_code}${agentData.contact_no}`}
                                        onChange={(e, phone) => changeHandler(e, phone, "contact_no")}
                                        inputStyle={{
                                            width: "100%"
                                        }}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="email" className="col-form-label">Email:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={agentData.email}
                                        onChange={(e) => changeHandler(e)}
                                    />
                                </div>
                                <div className="mb-2 ">
                                    <label htmlFor="password" className="col-form-label">Password:</label>
                                    <div className="border position-relative">
                                        <div
                                            onClick={() => setShowPassword(prev => !prev)}
                                            className="position-absolute  z-3 end-0 top-50 text-secondary"
                                            style={{ transform: "translate(-1.5rem, -50%) scale(-1)", cursor: "pointer" }}>
                                            {showPassword ? <GoEyeClosed /> : <GoEye />}
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={agentData.password}
                                            onChange={(e) => changeHandler(e)}
                                        />
                                    </div>
                                </div>


                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                className="btn btn-sm btn-secondary"
                                data-bs-dismiss="modal"
                                ref={modalCloseBtn}
                            >
                                Cancel

                            </button>
                            <button type="button" className="btn btn-sm btn-success" onClick={addAgentHandler}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}