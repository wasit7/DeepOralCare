import React from 'react';

//Components
import SearchBox from '../components/SearchBox';

function Home() {
	return (
		<section className='background h-full p-4 flex items-center justify-center'>
			<article className='w-full lg:w-2/3 text-center text-blue-900 space-y-8'>
				<h1 className='text-[2rem]'>หาความเชื่อมโยงความสัมพันธ์บุคคลและนิติบุคคล</h1>
				<h2 className='text-[1.4rem]'>โปรดระบุชื่อบุคคล/องค์กรที่ต้องการค้นหา</h2>
				<SearchBox />
			</article>
		</section>
	)
}

export default Home