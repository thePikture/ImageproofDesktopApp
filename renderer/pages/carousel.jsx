import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Carousel } from "react-bootstrap";

import { BiArrowBack, BiArrowToRight } from 'react-icons/bi'
import { BsArrowLeft, BsArrowRight, BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from 'react-icons/bs'

const carousel = () => {

    const [eventId, setEventId] = useState('')
    const [projectId, setProjectId] = useState('')
    const [projectStatus, setProjectStatus] = useState('')
    const [images, setImages] = useState([])
    const [selectedImage, setSelectedImage] = useState('')
    const [index, setIndex] = useState(0)
    const [image, setImage] = useState("")
    const [eventDetails, setEventDetails] = useState([])
    let router = useRouter()
    let p = router.query
    console.log({ p })
    useEffect(() => {
        if (router.query) {
            let eventId = localStorage.getItem("eventId")
            let projectId = localStorage.getItem("projectId")
            // setEventId(router.query.eventId)
            // setProjectId(router.query.projectId)
            setEventId(eventId)
            setProjectId(projectId)
            setProjectStatus(router.query.status)
            setImages(router.query.images)
            setImage(router.query.image)
            setEventDetails(router.query.eventDetails)
            console.log(router.query.eventDetails)
            let pics = router.query.images
            if (pics) {

                let i = pics.indexOf(router.query.image)
                setIndex(i)
            }
            let img = router.query.image
            let createdDate = router.query.eventDetails
            console.log({ createdDate })
            let date = new Date('2023-01-17')
            console.log({ date })
            let cDate = new Date(createdDate)
            console.log({ cDate })
            console.log("comparision", date > cDate)
            if (date < cDate) {

                setSelectedImage(`${process.env.DOMAIN_NAME}/api/photographer/get-images/${router.query.eventId}/${img}`)
            } else {
                setSelectedImage(`${process.env.DOMAIN_NAME}/api/photographer/get-images/old/${router.query.eventId}/${img}`)

            }
            console.log(`${process.env.DOMAIN_NAME}/api/photographer/get-images/${router.query.eventId}/${img}`)
        }

    }, [])

    // let image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/${eventId}/${img}`

    const handleBack = () => {
        localStorage.setItem("eventId", eventId)

        localStorage.setItem("projectId", projectId)
        // router.push({ pathname: '/eventImages', query: { "eventId": eventId, "projectId": projectId, "status": projectStatus } })
        router.push({ pathname: '/eventImages', query: { "status": projectStatus } })
    }
    const handleClick = (icon) => {
        let createdDate = eventDetails
        console.log({ createdDate })
        let date = new Date('2023-01-17')
        console.log({ date })
        let cDate = new Date(createdDate)
        if (icon == "prev") {
            console.log({ images })
            let i = images.indexOf(image)
            console.log({ i }, i - 1, images[i - 1])
            if (i == 0) {
                console.log("prev", images[images.length])
                setImage(images[images.length - 1])
                if (date < cDate) {

                    setSelectedImage(`${process.env.DOMAIN_NAME}/api/photographer/get-images/${router.query.eventId}/${images[images.length - 1]}`)
                } else {
                    setSelectedImage(`${process.env.DOMAIN_NAME}/api/photographer/get-images/old/${router.query.eventId}/${images[images.length - 1]}`)
                }

            } else {

                setImage(images[i - 1])
                if (date < cDate) {

                    setSelectedImage(`${process.env.DOMAIN_NAME}/api/photographer/get-images/${router.query.eventId}/${images[i - 1]}`)
                } else {
                    setSelectedImage(`${process.env.DOMAIN_NAME}/api/photographer/get-images/old/${router.query.eventId}/${images[i - 1]}`)
                }
            }
            console.log({ i })
        } else if (icon == "next") {
            console.log({ images })
            let i = images.indexOf(image)
            console.log({ i }, i + 1, images[i + 1])
            if (i == images.length - 1) {
                console.log("next", images[0])
                setImage(images[0])
                if (date < cDate) {

                    setSelectedImage(`${process.env.DOMAIN_NAME}/api/photographer/get-images/${router.query.eventId}/${images[0]}`)
                } else {
                    setSelectedImage(`${process.env.DOMAIN_NAME}/api/photographer/get-images/old/${router.query.eventId}/${images[0]}`)
                }

            } else {

                setImage(images[i + 1])
                if (date < cDate) {

                    setSelectedImage(`${process.env.DOMAIN_NAME}/api/photographer/get-images/${router.query.eventId}/${images[i + 1]}`)
                } else {
                    setSelectedImage(`${process.env.DOMAIN_NAME}/api/photographer/get-images/old/${router.query.eventId}/${images[i + 1]}`)
                }
            }


        }
    }
    return (
        <div className='bg-white p-10 h-screen'>
            <button className="p-3 bg-gray-700 rounded-full shadow-xl text-white font-bold mr-10 hover:bg-gray-300 hover:text-gray-700" onClick={handleBack}><BsArrowLeft size={20} /></button>
            <div className='flex justify-center items-center bg-white h-full'>
                <div className='flex justify-center items-center gap-2'>
                    <button className="p-3 bg-gray-700 rounded-full shadow-xl text-white font-bold mr-10 absolute left-20 z-20 hover:bg-gray-300 hover:text-gray-700" onClick={() => { handleClick("prev") }}>
                        <BsArrowLeft size={30} />
                    </button>

                    <Image src={selectedImage} width={700} height={600} alt="carousel" objectFit='contain' className='rounded-xl shadow-lg' />
                    {/* <img src={selectedImage} width={700} height={600} obj/> */}
                    <button className="p-3 bg-gray-700 rounded-full shadow-xl text-white font-bold mr-10 hover:bg-gray-300 hover:text-gray-700 absolute right-20 " onClick={() => { handleClick("next") }}>
                        <BsArrowRight size={30} />
                    </button>
                </div>

            </div>
        </div>
        // <div className='bg-white p-10 h-screen'>
        //     <button className="p-3 bg-gray-700 rounded-full shadow-xl text-white font-bold mr-10 hover:bg-gray-300 hover:text-gray-700" onClick={handleBack}><BsArrowLeft size={20} /></button>
        //     <Carousel
        //         defaultActiveIndex={index}
        //         indicators={false}
        //         interval={null}
        //     >
        //         {images.map((item) => {
        //             let image = `${process.env.DOMAIN_NAME}/api/photographer/get-images/${eventId}/${item}`;
        //             let img = encodeURI(image);
        //             // console.log(encodeURI(image));
        //             // let selected = images.includes(item);
        //             return (
        //                 <Carousel.Item>
        //                     <div className="text-center h-screen w-screen flex flex-col items-center justify-center">




        //                         <img src={image} />


        //                     </div>
        //                 </Carousel.Item>
        //             );
        //         })}
        //     </Carousel>
        // </div>
    )
}

export default carousel