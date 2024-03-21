const mongoose = require("mongoose");
const { MDB } = require("../config");
const model = require("../model/index.js");

const seedsList = [
    {
        name: "User",
        set: require("./user.js"),
        clear: true,
    },
    {
        name: "Group", // modelname
        set: require("./group.js"),
        clear: true,
    },
]

mongoose.connect(MDB.URL).then(async (err) => {
    console.log('MDB connected')
    try {


        for( let s=0; s<seedsList.length; s++ ){
            const seed = seedsList[s]
            if (seed.clear) {
                await model[seed.name].deleteMany()
                console.log(`collection "${seed.name}" cleared`)
            }
            for (let i = 0; i < seed.set.length; i++) {
                await model[seed.name](seed.set[i]).save()
                console.log(`+${i + 1} doc in ${seed.name}`)
            }
        }
        mongoose.disconnect()

    } catch (err) {
        console.log(err)
    }
}).catch(err => {
    console.log('MDB connection failed\n', err)
})