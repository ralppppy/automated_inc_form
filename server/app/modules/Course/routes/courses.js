const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetAllOrganizationCourse,
  handleGetOrganizationCourse,
  handleGetAllOrganizationCourseDropdown,
  handleCreateCourse,
  handleGetUpdatCourse,
  handleGetCoursesWithProjectFilter,
  generatePdf,
} = require("../controllers/CourseController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
router.post("/", verifyTokenMiddleware, handleCreateCourse);

router.get("/pdf/generate", generatePdf);

router.get(
  "/dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationCourseDropdown
);
router.get(
  "/filter_client_project/:organization_id",
  verifyTokenMiddleware,
  handleGetCoursesWithProjectFilter
);

router.get(
  "/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationCourse
);

router.put(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetUpdatCourse
);
router.get(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetOrganizationCourse
);

module.exports = router;
