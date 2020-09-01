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

function main() {
    callListBlogs()
}

main()
