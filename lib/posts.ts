import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
// import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import Video from '@/app/components/Video'
import CustomImage from '@/app/components/CustomImage'

type Filetree = {
	tree: [{ path: string }]
}

export const getPostByName = async (
	fileName: string
): Promise<BlogPost | undefined> => {
	// console.log('>>> getPostByName')
	const res = await fetch(
		`https://raw.githubusercontent.com/deelydian/nextjs-blogposts/main/${fileName}`,
		{
			headers: {
				'Accept': 'application/vnd.github+json',
				'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
				'X-GitHub-Api-Version': '2022-11-28',
			},
		}
	)

	if (!res.ok) return undefined

	const rawMDX = await res.text()

	if (rawMDX === '404: Not Found') return undefined

	// Optionally provide a type for your frontmatter object
	const { frontmatter, content } = await compileMDX<{
		title: string
		date: string
		tags: string[]
	}>({
		source: rawMDX,
		components: { Video, CustomImage },
		options: {
			parseFrontmatter: true,
			mdxOptions: {
				rehypePlugins: [
					// rehypeHighlight,
					rehypeSlug,
					[
						rehypeAutolinkHeadings,
						{
							behavior: 'wrap',
						},
					],
				],
			},
		},
	})

	// console.log('rawMDX:', rawMDX)

	const id = fileName.replace(/\.mdx$/, '')

	const blogPostObj: BlogPost = {
		meta: {
			id,
			title: frontmatter.title,
			date: frontmatter.date,
			tags: frontmatter.tags,
		},
		content,
	}

	return blogPostObj
}

export const getPostsMeta = async (): Promise<Meta[] | undefined> => {
	// console.log('>>> getPostsMeta')
	const res = await fetch(
		'https://api.github.com/repos/deelydian/nextjs-blogposts/git/trees/main?recursive=1',
		{
			headers: {
				'Accept': 'application/vnd.github+json',
				'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
				'X-GitHub-Api-Version': '2022-11-28',
			},
		}
	)

	if (!res.ok) return undefined

	const repoFiletree: Filetree = await res.json()

	const filesArray = repoFiletree.tree
		.map((obj) => obj.path)
		.filter((path) => path.endsWith('.mdx'))

	const posts: Meta[] = []

	for (const file of filesArray) {
		// console.log('file:', file)
		const post = await getPostByName(file)
		// console.log('post:', post)

		if (post) {
			const { meta } = post
			posts.push(meta)
		}
	}

	// console.log('posts:', posts)

	return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}
