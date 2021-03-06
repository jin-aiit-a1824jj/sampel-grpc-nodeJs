const blogs = require('../server/protos/blog_pb')
const service = require('../server/protos/blog_grpc_pb')

const grpc = require('grpc')

const client = new service.BlogServiceClient("127.0.0.1:5000", grpc.credentials.createInsecure())

function callListBlogs() {
    
    var emptyBlogRequest = new blogs.ListBlogRequest()
    var call = client.listBlog(emptyBlogRequest, () => {})

    call.on('data', response => {
        console.log('Client Streaming Response ', response.getBlog().toString())
    })

    call.on('error', error => {
        console.error(error)
    })

    call.on('end', () => {
        console.log('end')
    })

}

function callCreateBlog() {
    var blog = new blogs.Blog()
    blog.setAuthor("Johna")
    blog.setTitle("First blog post")
    blog.setContent("This is great....")
    
    var blogRequest = new blogs.CreateBlogRequest()
    blogRequest.setBlog(blog)

    client.createBlog(blogRequest, (error, response) => {
        if(!error){
            console.log('Received create blog response,', response.toString())
        }else {
            console.error(error)
        }
    })
}

function callReadBlog() {
    var readBlogRequest = new blogs.ReadBlogRequest()
    //readBlogRequest.setBlogId('1')

    readBlogRequest.setBlogId('100')

    client.readBlog(readBlogRequest, (error, response) => {
        if(!error) {
            console.log("Found a blog ", response.toString())
        }else {
            if(error.code === grpc.status.NOT_FOUND){
                console.log("Not found")
            }else {
                //do someting else
                console.error(error)
            }
        }
    })
}

function callUpdateBlog() {

    var updateBlogRequest = new blogs.UpdateBlogRequest()
    
    var newBlog = new blogs.Blog()
    newBlog.setId("2")
    newBlog.setAuthor("Gary")
    newBlog.setTitle("Hello World")
    newBlog.setContent("This is great, again!")

    updateBlogRequest.setBlog(newBlog)

    console.log("Blog...", newBlog.toString())

    client.updateBlog(updateBlogRequest, (error, response) => {
        if(!error) {
            console.log("Found a blog ", response.toString())
        }else {
            if(error.code === grpc.status.NOT_FOUND){
                console.log("Not found")
            }else {
                //do someting else
                console.error(error)
            }
        }
    })
}

function callDeleteBlog() {

    var deleteBlogRequest = new blogs.DeleteBlogRequest()
    var blogId = "6"

    deleteBlogRequest.setBlogId(blogId)

    client.deleteBlog(deleteBlogRequest, (error, response) => {
        if(!error) {
            console.log("Deleted blog with id: ", response.toString())
        }else {
            if(error.code === grpc.status.NOT_FOUND){
                console.log("Not found")
            }else {
                //do someting else
                console.error(error)
            }
        }
    })

}

function main() {
    //callListBlogs()
    //callCreateBlog()
    //callReadBlog()
    //callUpdateBlog()
    callDeleteBlog()
}

main()
