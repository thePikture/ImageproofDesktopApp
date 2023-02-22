import React from 'react'

const ModalComp = ({ title, alertText, selectFolder, handleCheck, handleSelectPath, diskInfo }) => {
    // console.log(title, alertText, selectFolder, handleCheck, handleSelectPath)
    return (
        <>
            {title !== "Disk" && <div className="bg-white py-20 px-32 rounded-xl flex flex-col justify-center items-center">
                <h1 className="text-gray-900 font-bold text-xl py-4 ">{title}</h1>
                <p className="text-gray-700 text-md py-4">{alertText}</p>
                <button className="py-5 px-10 bg-gray-800 rounded-xl text-white font-bold hover:bg-gray-400" onClick={handleCheck}>Ok</button>
            </div>}
            {title == "Disk" && <div className="flex flex-col justify-center items-center gap-3 my-3 bg-gray-200 p-5 rounded-xl">
                <h2 className="text-xl font-bold text-gray-800">Select Disk</h2>
                <div className='flex flex-wrap gap-5'>
                    {diskInfo.map((disk) => {
                        console.log(disk);

                        return (
                            <>
                                <div className="flex flex-col justify-center items-center p-5 rounded-xl shadow-2xl bg-white hover:bg-gray-50 cursor-pointer text-gray-800 font-semibold gap-3" key={disk.mounted} onClick={() => handleSelectPath(disk.mounted)}>
                                    <h1>{disk.mounted}</h1>

                                    <h1>
                                        {disk.capacity}
                                    </h1>
                                    <h2>
                                        Available: {Math.floor(disk.available / 1073741824)}{" "}
                                        GB
                                    </h2>
                                </div>

                            </>
                        );
                    })}
                </div>

            </div>}

        </>
    )
}

export default ModalComp