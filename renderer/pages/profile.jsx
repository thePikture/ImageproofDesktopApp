import React, { useState } from 'react'
import SideDashboard from '../components/SideDashboard'
import useSWR from 'swr'
import axios from 'axios'
import { CgProfile } from 'react-icons/cg'
import { FiHome, FiMail } from 'react-icons/fi'
import { BsCalendar3, BsPhone } from 'react-icons/bs'
import { HiOutlineClipboard, HiOutlineClipboardList, HiOutlineKey } from 'react-icons/hi'

const profile = () => {
    const [photographerData, setPhotographerData] = useState([])
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [studioName, setStudioName] = useState("")
    const [packageName, setPackageName] = useState("")
    const [packageStartDate, setPackageStartDate] = useState("")
    const [packageEndDate, setPackageEndDate] = useState("")

    const fetcher = async (url) => {
        let token = localStorage.getItem("token")
        try {
            const { data } = await axios.get(url + token
            );
            console.log(data);
            setPhotographerData(data.photographer)
            setName(data.photographer.name)
            setEmail(data.photographer.email)
            setMobile(data.photographer.mobile)
            setStudioName(data.photographer.studioName)
            setPackageName(data.photographer.packageName)
            setPackageStartDate(data.photographer.packageStartDate)
            setPackageEndDate(data.photographer.packageEndDate)
            // setValidity(data.photographer.subscribedValidity);
            // setPackageDetails(data.photographer.packageName);
        } catch (error) {
            console.log(error);
        }
    }

    const { data, error } = useSWR(`${process.env.DOMAIN_NAME}/api/account/`, fetcher)
    return (
        <div className="flex gap-6">
            <SideDashboard selectedPath="profile" />
            <div className='flex justify-center items-center h-screen w-screen'>
                <div className='bg-white p-20 rounded-xl flex flex-col justify-center '>
                    <h1 className='font-bold text-gray-900 mb-5 text-xl text-center'>Personal Information</h1>
                    <div className='flex items-center'>
                        <div className='border-r border-gray-200 p-5 '>
                            <div className='flex gap-4 items-center my-4'>
                                <CgProfile className="text-2xl text-gray-600" />
                                <h1 className="text-base text-gray-800 font-bold">Name :</h1>
                                <h3 className='font-semibold'>{name}</h3>
                            </div>
                            <div className='flex gap-4 items-center my-4'>
                                <FiMail className="text-2xl text-gray-600" />
                                <h1 className='font-bold'>Email :</h1>
                                <h3 className='font-semibold'>{email}</h3>
                            </div>
                            <div className='flex gap-4 items-center my-4'>
                                <BsPhone className="text-2xl text-gray-600" />
                                <h1 className='font-bold'>Phone :</h1>
                                <h3 className='font-semibold'>{mobile}</h3>
                            </div>
                            <div className='flex gap-4 items-center my-4'>
                                <FiHome className="text-2xl text-gray-600" />
                                <h1 className='font-bold'>Studio Name :</h1>
                                <h3 className='font-semibold'>{studioName}</h3>
                            </div>
                            <div>

                            </div>
                        </div>
                        <div className='p-5'>
                            <div className='flex gap-4 items-center my-4'>
                                <HiOutlineClipboardList className="text-2xl text-gray-600" />
                                <h1 className="text-base text-gray-800 font-bold">Package Name :</h1>
                                <h3 className='font-semibold'>{packageName.toUpperCase()}</h3>
                            </div>
                            <div className='flex gap-4 items-center my-4'>
                                <BsCalendar3 className="text-2xl text-gray-600" />
                                <h1 className="text-base text-gray-800 font-bold">Start Date :</h1>
                                <h3 className='font-semibold'>{packageStartDate}</h3>
                            </div>
                            <div className='flex gap-4 items-center my-4'>
                                <BsCalendar3 className="text-2xl text-gray-600" />
                                <h1 className="text-base text-gray-800 font-bold">End Date :</h1>
                                <h3 className='font-semibold'>{packageEndDate}</h3>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default profile