import Thread from "../models/Thread.js";
import express from "express";
import getGroqCloudApiKey from '../utils/GroqCloud.js';

const router = express.Router();

router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "thredId123",
            title: "sample@data"
        });
        const response = await thread.save();
        res.send(response);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to save in DB" });
    }
});

router.get("/thread", async(req, res) => {
    try{
        const allThreads = await Thread.find({}).sort({updatedAt:-1});
        res.send(allThreads);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to fetch threads" });
    }
});

router.get("/thread/:threadId", async(req, res) => {
    let {threadId} = req.params;
    try{
        const thread = await Thread.findOne({threadId});
        if(!thread) {
            res.status(500).json({error:"Thread not found"});
            return;
        }

        res.send(thread.messages);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"failed to fetch thread"});
    }
});

router.delete("/thread/:threadId", async(req, res) => {
    let {threadId} = req.params;
    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});
        
        if(!deletedThread){
            res.status(404).json({error:"Thread not found"});
            return;
        }

        res.status(200).json({error:"Thread deleted sucessfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"failed to delete thread"});
    }
});

router.post("/chat", async(req, res) => {
    const {threadId, message} = req.body;

    if(!threadId || !message){
        res.status(400).json({error:"missing required fields"});
        return;
    }
    try{
        let thread = await Thread.findOne({threadId});

        if(!thread){
             thread = new Thread({
                threadId,
                title:message,
                messages:[{ role:"user", content:message}],
            });
        }else{
            thread.messages.push({role:"user", content:message});
        }

        const assistantReply = await getGroqCloudApiKey(message);

        if(assistantReply){
        thread.messages.push({role:"assistant", content:assistantReply});
    }
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply:assistantReply});
    }
    catch(err){ 
        console.log(err);
        res.status(500).json({error:"something went wrong"});
    }
})

export default router;