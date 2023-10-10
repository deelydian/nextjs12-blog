import Image from 'next/image'
import React from 'react'

const MyProfilePic = () => {
	return (
		<section className='w-full mx-auto'>
			<Image
				className='border-4 border-black dark:border-slate-500 shadow-2xl shadow-black rounded-full mx-auto mt-8'
				src='/images/ma-ny.jpg'
				width={200}
				height={200}
				alt='Mike Reilley'
				priority={true}
			/>
		</section>
	)
}

export default MyProfilePic
