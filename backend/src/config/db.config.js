
import mongoose from 'mongoose'


const connector = async () => {
    try {
        
        const instance  = await mongoose.connect(
            `${process.env.MONGO_URI}`
        )

        console.log(`host : ${instance.connection.host}`);
        


    } catch (error) {
        console.log(error || error.message);
        
        process.exit(1)
    }
}

export default connector