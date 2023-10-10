import { getPostsMeta } from '@/lib/posts'
import ListItem from '@/app/components/ListItem'
import Link from 'next/link'

export const revalidate = 86400

type Props = {
	params: {
		tag: string
	}
}

export const generateStaticParams = async () => {
	const posts = await getPostsMeta() //dedupped

	if (!posts) return []

	const tags = new Set(posts.map((post) => post.tags).flat())

	return Array.from(tags).map((tag) => ({ tag }))
}

export const generateMetadata = ({ params: { tag } }: Props) => {
	return {
		title: `Posts about ${tag}`,
	}
}

const TagPostList = async ({ params: { tag } }: Props) => {
	const posts = await getPostsMeta() //dedupped

	if (!posts)
		return (
			<p className='mt-10 text-center'>
				Sorry, no posts contain that tag.
			</p>
		)

	const tagPosts = posts.filter((post) => post.tags.includes(tag))

	if (!tagPosts.length) {
		return (
			<div className='text-center'>
				<p className='mt-10'>Sorry, no posts for that keyword.</p>
				<Link href='/'>← Back to Home</Link>
			</div>
		)
	}

	return (
		<>
			<h2 className='text-3xl mt-4 mb-0'>Resulst for: #{tag}</h2>
			<section className='mt-6 mx-auto max-w-2xl'>
				<ul className='w-full list-none p-0'>
					{tagPosts.map((post) => (
						<ListItem
							key={post.id}
							post={post}
						/>
					))}
				</ul>
			</section>
		</>
	)
}

export default TagPostList
