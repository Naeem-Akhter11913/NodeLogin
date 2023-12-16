const StudentTeacher = require('../schema/studentTeacher')
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../email/sendEmail');
const jwt = require('jsonwebtoken');
const StTecher = require('../schema/studentTeacher');
// const StTecher = require('../schema/studentTeacher');

const teacherRegistration = async (req, res) => {
    const { name, email, password, role } = req.body;
    const { scId } = req.params;

    const isValid = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().required()
    }).validate(req.body);

    if (isValid.error) {
        return res.status(404).send({
            message: isValid.error.message,
        });
    }

    try {
        const checkData = await StudentTeacher.findOne({ name, email });

        if (checkData) {
            return res.status(400).send({
                status: 400,
                message: 'User name and email already exists please try with different email and password',
            });
        } else {
            const havePassword = await bcrypt.hash(password, 10);
            const stuTechObj = StudentTeacher({
                name: name,
                email: email,
                password: havePassword,
                role: role,
                inSchool: scId
            });
            const saveData = await stuTechObj.save();



            const payload = {
                id: saveData._id,
                name: saveData.name
            };

            const token = jwt.sign(payload, 'dsfhgd', { expiresIn: '1d' });

            const link = `http://localhost:3000/actives/${token}`;
            await sendEmail(email, "active account", link);



            if (saveData.isActive === false) {
                const user = await StudentTeacher.findOne({ email });

                const payload = {
                    id: user._id,
                    name: user.name
                };

                const token = jwt.sign(payload, 'dsfhgd', { expiresIn: '1d' });

                return res.status(200).send({
                    status: 200,
                    message: 'Your Account is Created Successfully Check Your Email To Activate',
                    data: saveData,
                    token: token
                });
            } else {
                res.status(200).send({
                    message: 'wait for Activaton',
                    data: saveData
                });
            }
        }

    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error.message,
            'error': 'else error'
        });
    }
};

const teacherLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const findUser = await StudentTeacher.findOne({ email });

        if (!findUser) {
            return res.status(404).send({
                status: 404,
                message: 'You have No Account or check your email and password'
            });
        }
        const match = await bcrypt.compare(password, findUser.password);

        const { _id, name, role, isActive } = findUser;

        if (match) {
            if (role === 'teacher' || role === 'student' && isActive) {
                const payload = {
                    _id,
                    name,
                    role,
                    isActive
                };

                const token = jwt.sign(payload, 'hhshs', { expiresIn: '1d' });

                res.status(200).send({
                    status: 200,
                    message: 'logged in successfull',
                    token: token
                });
            } else {
                res.status(400).send({
                    status: 400,
                    message: 'Active Your Account First',
                });
            }
        } else {
            res.status(400).send({
                status: 400,
                message: 'Check Your Password',
            });
        }

    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error.message
        });
    }
};


const getActiveTeachers = async (req, res) => {
    const { schoolId } = req.params;
    // console.log(schoolId)

    try {
        // getting data on the basis of school ID 
        const data = await StTecher.find({ inSchool: schoolId });

        // filtering all active data 
        const activeTeacher = data.filter(teacher => teacher.isActive === true);

        // filtering all teacher
        const teacher = activeTeacher.filter(tech => tech.role === 'teacher');
        // confirm.log(teacher)

        if (!data) {
            return res.status(400).send({
                status: 400,
                message: "No Active Teacter right now"
            });
        }

        res.status(200).send({
            status: 200,
            message: "Active Teacher is getted SuccessFully",
            data: teacher
        });
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error
        })
    }
};


const getActiveStudent = async (req, res) => {

    const { schoolId } = req.params;

    try {
        // getting data on the basis of school ID 
        const data = await StTecher.find({ inSchool: schoolId });

        // filtering all active data 
        const activeStudent = data.filter(student => student.isActive === true);

        // filtering all student
        const student = activeStudent.filter(std => std.role === 'student');

        if (!data) {
            return res.status(400).send({
                status: 400,
                message: "No Active Student right now",
                data: student
            });
        }

        res.status(200).send({
            status: 200,
            message: "Active Student is getted SuccessFully",
            data: student
        });
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error
        })
    }
};

const unActiveUser = async (req, res) => {

    const { schoolId } = req.params;

    try {
        // getting all data through schoolID
        const data = await StTecher.find({ inSchool: schoolId });

        if (!data) {
            return res.status(400).send({
                status: 400,
                message: "No Un-ctive User right now"
            });
        }
        // getting all UnActive data
        const activeStudent = data.filter(student => student.isActive === false);


        res.status(200).send({
            status: 200,
            message: "SuccessFully",
            data: activeStudent
        });
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error
        })
    }
};

module.exports = {
    teacherRegistration,
    teacherLogin,
    getActiveTeachers,
    getActiveStudent,
    unActiveUser,
}