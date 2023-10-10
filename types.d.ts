type Meta = {
	id: string
	title: string
	date: string
	tags: tring[]
}

type BlogPost = {
	meta: Meta
	content: ReactElement<any, string | JSXElementConstructor<any>>
}
