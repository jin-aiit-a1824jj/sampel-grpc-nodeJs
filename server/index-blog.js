const blogs = require('../server/protos/blog_pb')
const service = require('../server/protos/blog_grpc_pb')

const grpc = require('grpc')

//Knex requires
const environment = process.env.ENVIRONMENT || "development"
const config = require('./knexfile')[environment]
const knex = require('knex')(config)

/*
 Blog CRUD
*/

function listBlog(call, callback) {
    console.log('Received list blog request')

    knex("blogs").then(data => {
        data.forEach(element => {
            var blog = new blogs.Blog()
            blog.setId(element.id)
            blog.setAuthor(element.author)
            blog.setTitle(element.title)
            blog.setContent(element.content)

            var blogResponse = new blogs.ListBlogResoponse()
            blogResponse.setBlog(blog)

            //write to the stream
            call.write(blogResponse)
        })
    })
    call.end()
}

function main() {

    let unsafeCred = grpc.ServerCredentials.createInsecure()
  
    var server = new grpc.Server()
    server.addService(service.BlogServiceService, 
      {
        listBlog:listBlog
      }
    )
    server.bind("0.0.0.0:5000", unsafeCred)
    server.start()
  
    console.log('Server running on port 0.0.0.0:5000')
  }
  main()
