const Course = require('../models/Course');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const { title, description } = req.body;
        const course = new Course({ title, description });
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create course' });
    }
};
