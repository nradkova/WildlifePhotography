const {Schema,model}=require('mongoose');

const schema=new Schema({
    title:{
        type:String,
        required:true
    },
    keyword:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    description :{
        type:String,
        required:true
    },
    owner :{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    votes :[{
        type:Schema.Types.ObjectId,
        ref:'User',
        default:[]
    }],
    rating:{
        type:Number,
        default:0
    }
},{timestamps:true});

module.exports=model('Post',schema);