const StTecher = require("../schema/studentTeacher");

const getUnActive = async (req, res) => {
    const { schoolId } = req.params;
    console.log(schoolId)

    try {
        const unActiveData = await StTecher.findById({ _id: schoolId });

        if (!unActiveData) {
            return res.status(400).send({
                status: 400,
                message: 'No UnActive User'
            });
        }

        res.status(200).send({
            status: 200,
            message: 'User gated SuccessFully',
            data: unActiveData
        });
    } catch (error) {
        res.status(400).send({
            status: 400,
            message: error,
        })
    }

}
module.exports = { getUnActive }