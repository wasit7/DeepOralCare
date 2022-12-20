import React from 'react';

//NPM Packages
import { XMarkIcon } from '@heroicons/react/24/solid';
import { showCertainAmountOfCharacters } from '../helper/helper';

function Badge({item, handleUnSelect, exactCharCouts = false}) {
    return (
        <div className='bg-blue-900 min-w-fit text-white px-2 py-1 m-1 rounded-full flex items-center justify-between space-x-2'>
            <p>{exactCharCouts ? showCertainAmountOfCharacters(item.displayName) : item.displayName}</p>
            <div className='bg-orange-100 rounded-full cursor-pointer' onClick={() => handleUnSelect(item)}>
                <XMarkIcon className='w-4 h-4' />
            </div>
        </div>
    )
}

export default Badge;