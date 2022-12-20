import React from 'react';

//NPM Packages
import { ChevronDoubleUpIcon, ChevronDoubleDownIcon } from '@heroicons/react/24/solid';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { handleOpenBottom } from '../redux/layout/LayoutSlice';

function BottomBox(props) {

    const openBottom = useSelector((state) => state.layout.openBottom);
    const dispatch = useDispatch();

    return (
        <div className={`${openBottom ? 'h-40' : 'h-0'} duration-500 absolute w-full bg-white bottom-0`}>
            <div onClick={() => dispatch(handleOpenBottom())} className='absolute z-10 left-6 -top-10 duration-500 bg-white py-2 px-6 shadow rounded cursor-pointer'>
                {openBottom ? <ChevronDoubleDownIcon className='w-6 h-6 text-orange-100' /> : <ChevronDoubleUpIcon className='w-6 h-6 text-orange-100' />}
            </div>
            <div className='p-6 lg:py-6 lg:px-24 text-blue-900 overflow-y-auto h-full'>
                {props.children}
            </div>
        </div>
    )
}

export default BottomBox