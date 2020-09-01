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

            var blogResponse = new blogs.ListBlogResponse()
            blogResponse.setBlog(blog)

            //write to the stream
            call.write(blogResponse)
        })
        call.end()
    })
    
}

function createBlog(call, callback) {
  console.log('Received Create blog request')

  var blog = call.request.getBlog()
  console.log('Inserting blog ...')

  knex("blogs").insert({
    author: blog.getAuthor(),
    title:blog.getTitle(),
    content: blog.getContent()
  }, 'id').then((resolve) => {
    //var id = blog.getId()
    var addedBlog = new blogs.Blog()

    //set the blog response to be returned
    addedBlog.setId(String(resolve))
    addedBlog.setAuthor(blog.getAuthor())
    addedBlog.setTitle(blog.getTitle())
    addedBlog.setContent(blog.getContent())

    var blogResponse = new blogs.CreateBlogResponse()
    blogResponse.setBlog(addedBlog)
    
    console.log('Inserted Blog with ID: ', blogResponse)
    callback(null, blogResponse)
  })
  
}

function readBlog(call, callback) {
  console.log('Received Read blog request')

  // get id
  var blogId = call.request.getBlogId()
  
  knex("blogs")
  .where({ id: parseInt(blogId)})
  .then(data => {
    console.log("Searching for a blog...")

    if (data.length){
      var blog = new blogs.Blog()

      console.log("Blog found and sending message");

      //set the blog response to be returned
      blog.setId(data[0].id + '')
      blog.setAuthor(data[0].author)
      blog.setTitle(data[0].title)
      blog.setContent(data[0].content)

      var blogResponse = new blogs.ReadBlogResponse()
      blogResponse.setBlog(blog)

      callback(null, blogResponse)

    } else {

      console.log("Blog not found")
      return callback({
        code: grpc.status.NOT_FOUND,
        message: "Blog not Found!"
      })

    }
  })

}

function updateBlog(call, callback) {
  console.log('Received Update blog request')

  var blogId = call.request.getBlog().getId()

  console.log("Searching for a blog to update")

  knex("blogs")
  .where({ id: parseInt(blogId)})
  .update({
    author: call.request.getBlog().getAuthor(),
    title: call.request.getBlog().getTitle(),
    content: call.request.getBlog().getContent(),
  })
  .returning()
  .then(data => {
    if(data) {
      var blog = new blogs.Blog()
      console.log("Blog found sending message...")

      //set the blog response
      blog.setId(blogId)
      blog.setAuthor(data.author)
      blog.setTitle(data.title)
      blog.setContent(data.content)

      var updateBlogResponse = new blogs.UpdateBlogResponse()
      updateBlogResponse.setBlog(blog)

      console.log("Updated ===", updateBlogResponse.getBlog().getId())

      callback(null, updateBlogResponse)
    }
  })


}

function main() {

    let unsafeCred = grpc.ServerCredentials.createInsecure()
  
    var server = new grpc.Server()
    server.addService(service.BlogServiceService, 
      {
        listBlog:listBlog,
        createBlog:createBlog,
        readBlog:readBlog,
        updateBlog:updateBlog
      }
    )
    server.bind("0.0.0.0:5000", unsafeCred)
    server.start()
  
    console.log('Server running on port 0.0.0.0:5000')
  }
  main()
