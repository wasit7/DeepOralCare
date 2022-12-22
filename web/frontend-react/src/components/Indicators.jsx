import React from 'react';

//Redux
import { useSelector } from 'react-redux';

function Indicators() {

    const openBottom = useSelector((state) => state.layout.openBottom);

    return (
        <div className={`${openBottom ? 'bottom-48' : 'bottom-8'} duration-500 w-fit right-8 absolute text-base space-y-4`}>
            <div className='flex items-center space-x-4'>
                <div className='w-6 h-6 rounded-full bg-[#5879A3]'></div>
                <p>Person</p>
            </div>
            <div className='flex items-center space-x-4'>
                <div className='w-6 h-6 rounded-full bg-[#E49244]'></div>
                <p>Organization</p>
            </div>
            <div className='flex items-center space-x-4'>
                <div className='w-6 h-6 rounded-full bg-[#A77C9F]'></div>
                <p>Evidence</p>
            </div>
            <div className='flex items-center space-x-4'>
                <div className='w-6 h-6 rounded-full bg-[#6A9E58]'></div>
                <p>Transaction</p>
            </div>
        </div>
    )
}

export default Indicators