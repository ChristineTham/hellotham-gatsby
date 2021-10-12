import * as React from 'react'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { getImage, ImageDataLike } from 'gatsby-plugin-image'
import { Link } from 'gatsby'

import Layout from '@/components/layout'
import Seo from '@/components/seo'
import PostHero from '@/components/PostHero'
import ArticleJsonLD from '@/components/json-ld'

const components = { Link }

type ResizeType = {
  childImageSharp: {
    resize: {
      src: string
      width: number
      height: number
      aspectRatio: number
      originalName: string
    }
  }
}

interface BlogPostProps {
  data: {
    mdx: {
      frontmatter: {
        title: string
        description: string
        author: string
        date: string
        image: ImageDataLike | ResizeType
        tags: string[]
      }
      slug: string
      body: string
      fields: {
        source: string
      }
    }
  }
}

const BlogPost = ({ data }: BlogPostProps) => {
  const frontmatter = data.mdx.frontmatter
  const image = getImage(frontmatter.image as ImageDataLike)

  return (
    <Layout>
      <Seo
        title={frontmatter.title}
        description={frontmatter.description}
        image={(frontmatter.image as ResizeType).childImageSharp.resize}
        keywords={frontmatter.tags}
        pathname={'/posts/' + data.mdx.slug}
      />
      <ArticleJsonLD
        title={frontmatter.title}
        description={frontmatter.description}
        type={data.mdx.fields.source}
        date={frontmatter.date}
        lastUpdated={frontmatter.date}
        image={(frontmatter.image as ResizeType).childImageSharp.resize.src}
        keywords={frontmatter.tags}
        pathname={data.mdx.slug}
      />
      <main className="mt-10">
        <article className="post">
          <header>
            <PostHero
              title={frontmatter.title}
              description={frontmatter.description}
              author={frontmatter.author}
              date={frontmatter.date}
              image={image}
              tags={frontmatter.tags}
            />
          </header>
          <section className="px-4 lg:px-0 mt-12 mb-24 max-w-screen-lg mx-auto prose prose-purple lg:prose-xl">
            <MDXRenderer localImages={frontmatter.image} components={components}>
              {data.mdx.body}
            </MDXRenderer>
          </section>
        </article>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        description
        author
        date(formatString: "YYYY-MM-DD")
        image {
          childImageSharp {
            gatsbyImageData(width: 2048)
            resize(width: 1200) {
              src
              width
              height
              aspectRatio
              originalName
            }
          }
        }
        tags
      }
      slug
      body
      fields {
        source
      }
    }
  }
`

export default BlogPost
