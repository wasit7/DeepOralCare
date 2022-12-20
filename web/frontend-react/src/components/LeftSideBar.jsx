import React, { useEffect, useRef } from 'react';

//NPM Packages
import { MagnifyingGlassIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { handleOpenLeft } from '../redux/layout/LayoutSlice';

function LeftSideBar(props) {

    let inputElement = useRef(null);

    const openLeft = useSelector((state) => state.layout.openLeft);
    const dispatch = useDispatch();

    useEffect(() => {
        inputElement.current.focus();
    }, [])

    return (
        <div className={`${openLeft ? 'w-1/3 md:w-1/5' : 'w-0'} bg-white shadow relative duration-500`}>
            <div onClick={() => dispatch(handleOpenLeft())} className='absolute z-10 top-6 -right-10 duration-500 bg-white py-6 px-2 shadow rounded cursor-pointer'>
                {openLeft ? <ChevronDoubleLeftIcon className='w-6 h-6 text-orange-100' /> : <ChevronDoubleRightIcon className='w-6 h-6 text-orange-100' />}
            </div>
            <div className='relative overflow-auto text-blue-900 max-h-full'>
                <div className='sticky top-0 order-last md:order-2 w-full bg-white px-8 pt-8'>
                    <div className='border border-orange-100 shadow-sm transition w-full py-2 rounded-full flex items-center justify-between'>
                        <div className='text-orange-100 px-2'>
                            <MagnifyingGlassIcon className='w-6 h-6' />
                        </div>
                        <input
                            ref={inputElement}
                            placeholder='ค้นหารายการ'
                            type="text"
                            className='border-none outline-none w-full mx-2'
                            value={props.inputSearch}
                            onChange={(e) => props.handleEntitySearch(e.target.value.toLowerCase())}
                        />
                    </div>
                    <h2 className='py-4 text-[1.4rem]'>รายการที่พบ</h2>
                </div>
                <div className='divide-y text-base'>
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default LeftSideBar