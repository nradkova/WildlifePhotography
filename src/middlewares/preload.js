const { getOneById } = require("../services/postService")


function preloadOne(){
    return async (req,res,next)=>{
        try {
            const post=await getOneById(req.params.id);
            if(post){
                req.post=post;
            }
        } catch (error) {
            console.error('Database error:' + error.message);
        }
        next();
    }
}

module.exports=preloadOne;