import { request, gql } from 'graphql-request'


const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT


//const graphqlAPI = 'https://api-ap-south-1.graphcms.com/v2/cl0q7bmswa3sf01z2az2i69nz/master'


export const getPosts = async () => {
    const query = gql`
    query MyQuery{
        postsConnection {
            edges {
                node {
                     author{ 
                        bio
                        id
                        name
                        photo {
                            url
                        }
                    }
                    createdAt
                    slug
                    title
                    except
                    featuredImage {
                        url
                    }
                    categories {
                        name
                        slug
                    }
                }
            }
        }
    }
    `

    try {
        const result = await request(graphqlAPI, query);

        //console.log(result.contents.data[0].attributes.Name)
        //console.log('Sumanta'+result.postsConnection.edges[0].node.author.bio)
        return result.postsConnection.edges;
    }
    catch (err) {
        console.log(err)
    }

}


export const getPostsDetails = async (slug) => {
    const query = gql`
    query GetPostDetails($slug : String!) {
        post(where: {slug: $slug}) {
          title
          except
          featuredImage {
            url
          }
          author{
            name
            bio
            photo {
              url
            }
          }
          createdAt
          slug
          content {
            raw
          }
          categories {
            name
            slug
          }
        }
      }
       
    `

    try {
        const result = await request(graphqlAPI, query,{slug});

        return result.post;
    }
    catch (err) {
        console.log(err)
    }

}


export const getRecentPosts = async () => {
    const query = gql`
    query GetPostDetails{
        posts(orderBy: createdAt_ASC
            last:3
            ){
                title
                featuredImage{
                    url
                }
                createdAt
                slug
            }
    }
    `
    //request(graphqlAPI, query).then((result) =>  {return result.posts })
    try {
        const result = await request(graphqlAPI, query);

        //console.log(result.contents.data[0].attributes.Name)
        //console.log('Sumanta'+result.postsConnection.edges[0].node.author.bio)
        return result.posts;
    }
    catch (err) {
        console.log(err)
    }
}

export const getSimilarPosts = async (categories,slug) => {             
    const query = gql`
    query GetPostDetails($slug: String!,$categories:[String!]){
        posts(
            where:{slug_not:$slug, AND: {categories_some:{ slug_in:$categories}}}
            last:3
        ){
            title
            featuredImage{
                url
            }
            createdAt
            slug
        }
    }
    `

    //request(graphqlAPI, query).then((result) => { return result.posts })

    const result= await request(graphqlAPI,query,{categories,slug})
    return result.posts;

}

export const getAdjacentPosts = async (createdAt, slug) => {
  const query = gql`
    query GetAdjacentPosts($createdAt: DateTime!,$slug:String!) {
      next:posts(
        first: 1
        orderBy: createdAt_ASC
        where: {slug_not: $slug, AND: {createdAt_gte: $createdAt}}
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
      previous:posts(
        first: 1
        orderBy: createdAt_DESC
        where: {slug_not: $slug, AND: {createdAt_lte: $createdAt}}
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;

  const result = await request(graphqlAPI, query, { slug, createdAt });

  return { next: result.next[0], previous: result.previous[0] };
};

export const getCategories = async () => {
    const query = gql`
        query GetCategories {
            categories{
                name 
                slug
            }
        }
    `
    const result = await request(graphqlAPI, query);
    return result.categories;
}

export const submitComment= async (obj)=>{
    const result = await fetch('/api/comments',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
    body: JSON.stringify(obj),
    })
}



export const getComments = async (slug) => {
    const query = gql`
        query getComments($slug:String!) {
            comments(where:{post:{slug:$slug}}){
                name
                createdAt
                comment
            }
        }
    `
    const result = await request(graphqlAPI, query,{slug});
    return result.comments;
}


export const getFeaturedPosts = async () => {
    const query = gql`
      query GetCategoryPost() {
        posts(where: {featuredPost: true}) {
          author {
            name
            photo {
              url
            }
          }
          featuredImage {
            url
          }
          title
          slug
          createdAt
        }
      }   
    `;
  
    const result = await request(graphqlAPI, query);
  
    return result.posts;
  };

  export const getCategoryPost = async (slug) => {
    const query = gql`
      query GetCategoryPost($slug: String!) {
        postsConnection(where: {categories_some: {slug: $slug}}) {
          edges {
            cursor
            node {
              author {
                bio
                name
                id
                photo {
                  url
                }
              }
              createdAt
              slug
              title
              except
              featuredImage {
                url
              }
              categories {
                name
                slug
              }
            }
          }
        }
      }
    `;
  
    const result = await request(graphqlAPI, query, { slug });
  
    return result.postsConnection.edges;
  };

//return data structure

// {
//     "data": {
//       "contents": {
//         "data": [
//           {
//             "id": "2",
//             "attributes": {
//               "Name": "Sumanta"
//             }
//           },
//           {
//             "id": "3",
//             "attributes": {
//               "Name": "Sybhas"
//             }
//           },
//           {
//             "id": "4",
//             "attributes": {
//               "Name": "Ananda"  display this value::> console.log(data.contents.data[0].attributes.Name)
//             }
//           }
//         ]
//       }
//     }
//   }

