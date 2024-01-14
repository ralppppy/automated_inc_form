const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetAllOrganizationTeacher,
  handleGetOrganizationTeacher,
  handleGetAllOrganizationTeacherDropdown,
  handleCreateTeacher,
  handleGetUpdatTeacher,
  handleGetTeachersWithProjectFilter,
} = require("../controllers/TeacherController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
router.post("/", verifyTokenMiddleware, handleCreateTeacher);

router.get(
  "/dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationTeacherDropdown
);
router.get(
  "/filter_client_project/:organization_id",
  verifyTokenMiddleware,
  handleGetTeachersWithProjectFilter
);

router.get(
  "/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationTeacher
);

router.put(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetUpdatTeacher
);
router.get(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetOrganizationTeacher
);

module.exports = router;
