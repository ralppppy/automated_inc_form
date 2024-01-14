const express = require("express");
const path = require("path");
const router = express.Router();

const {
  handleGetAllOrganizationRequest,
  handleGetOrganizationRequest,
  handleGetAllOrganizationRequestDropdown,
  handleCreateRequest,
  handleGetUpdatRequest,
  handleGetRequestsWithProjectFilter,
  generatePdf,
} = require("../controllers/RequestController");

const { verifyTokenMiddleware } = require(path.resolve(
  "middleware",
  "verifyTokenMiddleware"
));

/* Data listing. */
router.post("/", verifyTokenMiddleware, handleCreateRequest);

router.get("/pdf/generate/:id", generatePdf);

router.get(
  "/dropdown/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationRequestDropdown
);
router.get(
  "/filter_client_project/:organization_id",
  verifyTokenMiddleware,
  handleGetRequestsWithProjectFilter
);

router.get(
  "/:organization_id",
  verifyTokenMiddleware,
  handleGetAllOrganizationRequest
);

router.put(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetUpdatRequest
);
router.get(
  "/:organization_id/:id",
  verifyTokenMiddleware,
  handleGetOrganizationRequest
);

module.exports = router;
