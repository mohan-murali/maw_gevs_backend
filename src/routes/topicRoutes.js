const { Router } = require("express");
const TopicModel = require("../models/topic");

const topicRouter = Router();

topicRouter.post("/add-topic", async (req, res) => {
  try {
    const { topic, supervisor, details, isCustom } = req.body;
    if (!topic || !supervisor || !details) {
      res.status(400).json({
        success: false,
        message: "topic, supervisor, details",
      });
    }

    const newTopic = new TopicModel({
      topic,
      supervisor,
      details,
      isCustom,
      isApproved: false,
    });

    await newTopic.save();

    res.status(200).json({
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: `could not create the topic`,
    });
  }
});

topicRouter.put("/update-topic", async (req, res) => {
  try {
    const { id, topic, supervisor, details } = req.body;
    await TopicModel.findByIdAndUpdate(id, {
      topic,
      details,
      supervisor,
    });
    res.status(200).json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not update the topic",
    });
  }
});

topicRouter.delete("/delete-topic/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const response = await TopicModel.findByIdAndDelete(id);
    console.log(response);
    res.status(200).json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not delete the topic",
    });
  }
});

topicRouter.get("/get-topic", async (req, res) => {
  try {
    const topics = await TopicModel.find({});
    res.status(200).json({
      success: true,
      topics,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not fetch the topic",
    });
  }
});

module.exports = topicRouter;