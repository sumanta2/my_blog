import Head from 'next/head'
import { PostCard,Categories,PostWidget } from '../components/index'
import { ApolloClient, InMemoryCache, gql} from "@apollo/client";
import {FeaturedPost} from '../section'
import {getPosts} from '../services/'

 export default function Home({posts}) {

  // const posts = [
  //   { title: 'React Testing', except: 'Learn React with Tailwind' },
  //   { title: 'React with Tailwind', except: 'learn React with Tailwind' },
  // ]
  //console.log(props.posts.postsConnection.edges[0].node.author.bio)  //we need to provide proper object structure to access data


  //console.log(posts)
  

  return (
    <div className="container mx-auto px-10 mb-8">
      <Head>
        <title>Cms Blog</title>
        <meta name="Blog for Student" content="Web Technology" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FeaturedPost/>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
        <div className='lg:col-span-8 col-span-1'>
          {
            posts.map((post, index) => {

              return (
                <PostCard post={post.node} key={post.title} />
              )
            })
          }
        </div>
        <div className='lg:col-span-4 col-span-1'>
          <div className='lg:sticky relative top-8'>
            <PostWidget/>
            <Categories/>
          </div>
        </div>
      </div>

    </div>
  )
}

export async function getStaticProps(){

  // const client= new ApolloClient({
  //   uri:'https://api-ap-south-1.graphcms.com/v2/cl0q7bmswa3sf01z2az2i69nz/master',
  //   cache:new InMemoryCache
  // })

  const posts= await getPosts() || []

  //console.log('2'+posts1.postsConnection.edges[0].node.author.bio)
  
  return{
    props:{
      posts
    }
  }
}
