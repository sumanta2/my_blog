/** *************************************************************
* Any file inside the folder pages/api is mapped to /api/* and  *
* will be treated as an API endpoint instead of a page.         *
*************************************************************** */

import { gql,GraphQLClient } from "graphql-request";

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT

export default async function comments(req, res) {

  const {name,email,slug,comment}=req.body

  const GraphQLClient1 = new GraphQLClient((graphqlAPI),{
    headers:{
      authorization:`Bearer ${process.env.GRAPHCMS_TOKEN}`,
    }
  })

  const query= gql`
    mutation CreateComment($name:String!, $email:String!, $comment: String!, $slug:String!){
      createComment(data:{name:$name,email:$email,comment:$comment, post:{connect:{slug:$slug}}}){id}
    }
  `
  try{
    const result= await GraphQLClient1.request(query,req.body)
    return res.status(200).send(result);
  }
  catch(error)
  {
    console.log(error)
    return res.status(500).send(error);
  }
}
