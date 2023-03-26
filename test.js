const AWS = require("aws-sdk");
const s3 = new AWS.S3()


async function f1() {
    // store something
    await s3.putObject({
        Body: JSON.stringify({key:"value"}),
        Bucket: "cyclic-erin-seagull-gown-us-east-2",
        Key: "some_files/my_file.json",
    }).promise()

// get it back
    let my_file = await s3.getObject({
        Bucket: "cyclic-erin-seagull-gown-us-east-2",
        Key: "some_files/my_file.json",
    }).promise()

    console.log(JSON.parse(my_file.Body.toString()))
}

f1()