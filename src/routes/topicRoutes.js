const { Router } = require("express");
const { TopicModel } = require("../models/topic");
const UserModel = require("../models/user");
const PrefrenceModel = require("../models/prefrence");
const GroupModel = require("../models/group");
const authHandler = require("../middleware/authHandler");

const topicRouter = Router();

topicRouter.post("/add-topic", authHandler, async (req, res) => {
  try {
    const { user } = req;
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
      createdBy: user.emailId,
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

topicRouter.get("/get-existing-topic", async (req, res) => {
  try {
    const topics = await TopicModel.find({ isCustom: false });
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

topicRouter.get("/get-proposed-topic", authHandler, async (req, res) => {
  try {
    const { user } = req;
    const topics = await TopicModel.find({
      isCustom: true,
      createdBy: user.emailId,
    });
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

topicRouter.get("/get-allocated-topic", authHandler, async (req, res) => {
  try {
    const { user } = req;
    const foundUser = await UserModel.findById(user._id);
    res.status(200).json({
      success: true,
      topics: [foundUser.assignedTopic],
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not fetch the topic",
    });
  }
});

topicRouter.get("/get-supervisor-topic", authHandler, async (req, res) => {
  try {
    const { user } = req;
    const topics = await TopicModel.find({
      isCustom: true,
      supervisor: user.name,
    });
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

topicRouter.get("/get-all-proposed-topic", authHandler, async (req, res) => {
  try {
    const topics = await TopicModel.find({
      isCustom: true,
    });
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

topicRouter.get("/get-all-groups", authHandler, async (req, res) => {
  try {
    const groups = await GroupModel.find({});
    res.status(200).json({
      success: true,
      groups,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not fetch the topic",
    });
  }
});

topicRouter.get("/get-supervisor-groups", authHandler, async (req, res) => {
  try {
    const { user } = req;
    console.log(user.name);
    const groups = await GroupModel.find({
      supervisor: user.name,
    });
    res.status(200).json({
      success: true,
      groups,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not fetch the topic",
    });
  }
});

topicRouter.put("/approve-topic", authHandler, async (req, res) => {
  try {
    const { id } = req.body;
    const topic = await TopicModel.findById(id);
    await topic.updateOne({ isApproved: true });
    await UserModel.findOneAndUpdate(
      { emailId: topic.createdBy },
      {
        assignedTopic: topic,
      }
    );
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

topicRouter.get("/assign-topic", authHandler, async (req, res) => {
  try {
    const maxGroupLength = 4;
    const prefrences = await PrefrenceModel.find({ assigned: false });
    const unassignedStudents = await UserModel.find({
      role: "Student",
      assignedTopic: null,
    });

    const topicGroup = new Map();
    const topicGroupSize = new Map();

    for (const student of unassignedStudents) {
      let assigned = false;
      let assignedTopic = {};
      const prefrence = prefrences.find((x) => x.emailId === student.emailId);
      console.log(prefrence);
      if (prefrence) {
        let topic1 = prefrence.prefrence1.topic;
        if (topicGroup.has()) {
          if (topicGroupSize.get(topic1) < maxGroupLength) {
            const group = topicGroup.get(topic1);
            group.students.push(student.emailId);
            assigned = true;
            assignedTopic = prefrence.prefrence1;
            topicGroupSize.set(topic1, topicGroupSize.get(topic1) + 1);
          }
        } else {
          const newGroup = new GroupModel({
            topic: topic1,
            supervisor: prefrence.prefrence1.supervisor,
            students: [student.emailId],
          });
          topicGroup.set(topic1, newGroup);
          topicGroupSize.set(topic1, 1);
          assigned = true;
          assignedTopic = prefrence.prefrence1;
        }
        if (!assigned) {
          let topic2 = prefrence.prefrence2.topic;
          if (topicGroup.has()) {
            if (topicGroupSize.get(topic2) < maxGroupLength) {
              const group = topicGroup.get(topic2);
              group.students.push(student.emailId);
              assigned = true;
              assignedTopic = prefrence.prefrence2;
              topicGroupSize.set(topic2, topicGroupSize.get(topic2) + 1);
            }
          } else {
            const newGroup = new GroupModel({
              topic: topic2,
              supervisor: prefrence.prefrence2.supervisor,
              students: [student.emailId],
            });
            topicGroup.set(topic2, newGroup);
            topicGroupSize.set(topic2, 1);
            assigned = true;
            assignedTopic = prefrence.prefrence2;
          }
        }
        if (!assigned) {
          let topic3 = prefrence.prefrence3.topic;
          if (topicGroup.has()) {
            if (topicGroupSize.get(topic3) < maxGroupLength) {
              const group = topicGroup.get(topic3);
              group.students.push(student.emailId);
              assigned = true;
              assignedTopic = prefrence.prefrence3;
              topicGroupSize.set(topic3, topicGroupSize.get(topic3) + 1);
            }
          } else {
            const newGroup = new GroupModel({
              topic: topic3,
              supervisor: prefrence.prefrence3.supervisor,
              students: [student.emailId],
            });
            topicGroup.set(topic3, newGroup);
            topicGroupSize.set(topic3, 1);
            assigned = true;
            assignedTopic = prefrence.prefrence3;
          }
        }
        if (!assigned) {
          for (const [key, value] of topicGroupSize.entries()) {
            if (value < maxGroupLength) {
              const group = topicGroup.get(key);
              group.students.push(student.emailId);
              assigned = true;
              assignedTopic = await TopicModel.findOne({ topic: key });
              topicGroupSize.set(key, value + 1);
            }
          }
        }
      } else {
        for (const [key, value] of topicGroupSize.entries()) {
          if (value < maxGroupLength) {
            const group = topicGroup.get(key);
            group.students.push(student.emailId);
            assigned = true;
            assignedTopic = await TopicModel.findOne({ topic: key });
            topicGroupSize.set(key, value + 1);
          }
        }
      }
      await UserModel.findByIdAndUpdate(student._id, {
        assignedTopic,
      });
    }

    const groupModelList = [];
    for (const [key, value] of topicGroup.entries()) {
      groupModelList.push(value);
    }

    const result = await GroupModel.insertMany(groupModelList);
    console.log(result);

    res.status(200).json({
      success: true,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "could not assign the topics to students",
    });
    console.log(e);
  }
});

module.exports = topicRouter;
