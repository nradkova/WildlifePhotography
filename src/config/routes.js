const homeController=require('../contollers/homeController');
const authController=require('../contollers/authController');
const postController=require('../contollers/postController');



const routesConfig=(app)=>{
    app.use('/',homeController);
    app.use('/auth',authController);
    app.use('/posts',postController);
    app.all('*',(req,res)=>res.render('404',{title:'Not Found'}));
}
module.exports=routesConfig;