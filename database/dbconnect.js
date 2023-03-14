const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://abhaypratapsinghkardam555666:abhay@cluster0.ajetoe9.mongodb.net/authdb?retryWrites=true&w=majority').then(()=>{
    console.log('database connected');
}).catch((err)=>{
    console.log(err);
});