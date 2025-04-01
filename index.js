const polka = require('polka');
const { raw } = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util')
const pexec = promisify(exec)
const app =  polka();
var c = 0;
const PORT = process.env.PORT || 3444;

//app.use(raw({ limit: 50000 }));
app.get("/", (req,res)=> {
    console.log("recieved")
    res.end();
});
app.post("/", async (req,res)=>{

    console.log("recieved")
    let file = fs.createWriteStream("audio.wav");
    let body = '';
    req.on('data', (chunk) => {
        file.write(chunk);
       
    });
    req.on('end', async () => {
        console.log(body);
       file.close();
      // exec('afplay audio.mp3', ()=>{console.log("played")});
        await pexec('./../whisper.cpp/build/bin/whisper-cli -m ./../whisper.cpp/models/ggml-tiny.bin -l de -f ./audio.wav -otxt')
        let result = fs.readFileSync('audio.wav.txt','utf8')
        res.send(result);
       
    });


   
   

});

app.listen(PORT,function () {
    console.log('started listening on port ' + PORT);
});