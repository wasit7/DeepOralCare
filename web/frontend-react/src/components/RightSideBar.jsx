import React from 'react';

//NPM Packages
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { handleOpenRight } from '../redux/layout/LayoutSlice';

function RightSideBar(props) {

    const openRight = useSelector((state) => state.layout.openRight);
    const dispatch = useDispatch();

    return (
        <div className={`${openRight ? 'w-1/3 md:w-1/5 right-auto' : 'w-0 right-0'} bg-white shadow relative duration-500`}>
            <div onClick={() => dispatch(handleOpenRight())} className='absolute z-10 top-6 -left-10 duration-500 bg-white py-6 px-2 shadow rounded cursor-pointer'>
                {openRight ? <ChevronDoubleRightIcon className='w-6 h-6 text-orange-100' /> : <ChevronDoubleLeftIcon className='w-6 h-6 text-orange-100' />}
            </div>
            <div className='relative overflow-auto text-blue-900 max-h-full'>
                <div className='divide-y'>
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default RightSideBar;