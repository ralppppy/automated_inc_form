const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetAllOrganizationSubject,
  handleGetOrganizationSubject,
  handleGetAllOrganizationSubjectDropdown,
  handleCreateSubject,
  handleGetUpdatSubject,
  handleGetSubjectsWithProjectFilter,
} = require("../controllers/SubjectController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
router.post("/", verifyTokenMiddleware, handleCreateSubject);

router.get(
  "/dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationSubjectDropdown
);
router.get(
  "/filter_client_project/:organization_id",
  verifyTokenMiddleware,
  handleGetSubjectsWithProjectFilter
);

router.get(
  "/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationSubject
);

router.put(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetUpdatSubject
);
router.get(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetOrganizationSubject
);

module.exports = router;
