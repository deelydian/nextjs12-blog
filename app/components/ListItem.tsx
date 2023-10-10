import React from 'react'
import Link from 'next/link'
import getFormattedDate from '@/lib/getFormattedDate'

type Props = {
	post: Meta
}

const ListItem = ({ post }: Props) => {
	const { id, title, date } = post
	const formattedDate = getFormattedDate(date)

	return (
		<li className='mt-4 text-2xl dark:text-white/70'>
			<Link
				className='underline hover:text-black/70 dark:hover:text-white/90'
				href={`/posts/${id}`}
			>
				{title}
			</Link>
			<br />
			<p className='text-sm mt-1'>{formattedDate}</p>
		</li>
	)
}

export default ListItem
