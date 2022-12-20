import React from 'react';

function Loading() {
    return (
        <div className='w-full h-full'>
            <div className="flex items-center justify-center h-full">
                <div className="w-20 h-20 border-t-4 border-b-4 border-orange-100 rounded-full animate-spin"></div>
            </div>
        </div>
    )
}

export default Loading