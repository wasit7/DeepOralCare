import React from 'react';
import Header from './Header';

function PublicLayout(props) {
    return (
        <div className='h-screen flex flex-col'>
            <Header />
            <main className='w-full h-full'>
                {props.children}
            </main>
        </div>
    )
}

export default PublicLayout