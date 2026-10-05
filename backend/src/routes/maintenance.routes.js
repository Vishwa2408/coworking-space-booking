const express = require("express");

const {
    createMaintenance,
    getMaintenance,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance,
} = require("../controllers/maintenance.controller");


const {
    createMaintenanceSchema,
    updateMaintenanceSchema,
} = require("../validators/maintenance.validator");

const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.use(authenticate);
router.use(authorize("admin"));

router.post(
    "/",
    validate(createMaintenanceSchema),
    createMaintenance
);

router.get("/", getMaintenance);

router.get("/:id", getMaintenanceById);

router.patch(
    "/:id",
    validate(updateMaintenanceSchema),
    updateMaintenance
);

router.delete(
    "/:id",
    deleteMaintenance
);

module.exports = router;