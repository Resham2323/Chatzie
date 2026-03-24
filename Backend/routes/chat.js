import Thread from "../models/Thread.js";
import express from "express";
import getGroqCloudApiKey from '../utils/GroqCloud.js';
import { authUser } from "../middleware/authUser.js";

const router = express.Router();


router.get("/thread", authUser, async (req, res) => {
    try {
        const allThreads = await Thread.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.json({ threads: allThreads });
    } catch (err) {
        console.log(err); res.status(500).json({ error: "failed to fetch threads" });
    }
});

router.get("/thread/:threadId", authUser, async (req, res) => {
    let { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ userId: req.user._id, threadId });
        if (!thread) {
            res.status(500).json({ error: "Thread not found" });
            return;
        }

        res.send(thread.messages);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to fetch thread" });
    }
});

router.delete("/thread/:threadId", authUser, async (req, res) => {
    let { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({
            userId: req.user._id,
            threadId
        });

        if (!deletedThread) {
            res.status(404).json({ error: "Thread not found" });
            return;
        }

        res.status(200).json({ error: "Thread deleted sucessfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to delete thread" });
    }
});

router.post("/chat", authUser, async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        res.status(400).json({ error: "missing required fields" });
        return;
    }
    try {
        let thread = await Thread.findOne({ userId: req.user._id, threadId });

        if (!thread) {
            thread = new Thread({
                userId: req.user._id,
                threadId,
                title: message,
                messages: [{ role: "user", content: message }],
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getGroqCloudApiKey(message);

        if (assistantReply) {
            thread.messages.push({ role: "assistant", content: assistantReply });
        }
        thread.updatedAt = new Date();

        await thread.save();
        res.json({ reply: assistantReply });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "something went wrong" });
    }
})

export default router;