import proxy from "express-http-proxy"



export const proxyWithHeaders =(serviceUrl)=>{
    return proxy(
        serviceUrl,
        {
          parseReqBody: false,
          proxyReqPathResolver: (req) => {
            // req.url is already relative to the mount point
            // e.g., for /api/resume/get-resume mounted at /api/resume, req.url = /get-resume
            return req.url
          },
          proxyReqOptDecorator:(proxyReqOpts, srcReq) =>{
            if(srcReq.user){
                proxyReqOpts.headers["x-user-id"]=srcReq.user.userId
            }
            // Preserve Content-Type (includes multipart boundary) and Content-Length
            // so file uploads are forwarded correctly through the proxy
            if (srcReq.headers['content-type']) {
                proxyReqOpts.headers['Content-Type'] = srcReq.headers['content-type']
            }
            if (srcReq.headers['content-length']) {
                proxyReqOpts.headers['Content-Length'] = srcReq.headers['content-length']
            }
            return proxyReqOpts

          } 
        }

    )
}