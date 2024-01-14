const path = require("path");
const Op = require("sequelize").Op;
const sequelize = require("sequelize");
const fs = require("fs");
const renderTemplate = require("../../../../utils/PdfGenerator/render-template");
const createPdf = require("../../../../utils/PdfGenerator/create-pdf");

const { get, getOne, create, update } = require(path.resolve(
  "app",
  "common",
  "services",
  "CommonServices.js"
));
const { formatResponse } = require(path.resolve(
  "utils",
  "ResponseFormatter.js"
));

const { Request, EP_Project } = require(path.resolve("database", "models"));

const handleGetAllOrganizationRequest = async (req, res) => {
  let { organization_id } = req.params;
  let { paginate, sort, search, isSingle, userId } = req.query;

  isSingle = isSingle === "true";

  let pagingation = paginate
    ? {
        ...paginate,
      }
    : null;

  let sortFormat = {
    descend: "DESC",
    ascend: "ASC",
  };

  let sorting = sort ? [[sort.field, sortFormat[sort.order]]] : null;

  let searchData = {};

  if (search && search.s) {
    searchData = {
      [search.searchIndex]: {
        [Op.like]: `%${search.s}%`,
      },
    };
  }

  let where = req.user.is_student
    ? { requester_id: req.user.id }
    : isSingle
    ? { requester_id: userId }
    : {};

  let [requests, error] = await get(Request, where, sorting, null, pagingation);

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, requests));
  }
};
const handleGetAllOrganizationRequestDropdown = async (req, res) => {
  let { organization_id } = req.params;

  let [clients, error] = await get(
    Request,
    { organization_id },
    null,
    ["id", "name"],
    null
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, clients));
  }
};

const handleGetOrganizationRequest = async (req, res) => {
  let { organization_id, id } = req.params;

  let [users, error] = await getOne(Request, { organization_id, id });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, users));
  }
};

const handleCreateRequest = async (req, res) => {
  let data = req.body;

  let [request, error] = await create(Request, data);
  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(formatResponse(false, null, "Request id must be unique."));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, request));
  }
};

const handleGetUpdatRequest = async (req, res) => {
  let { id } = req.params;

  let [request, error] = await update(Request, req.body, {
    id,
  });

  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(formatResponse(false, null, "Request id must be unique."));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, request));
  }
};

const handleGetRequestsWithProjectFilter = async (req, res) => {
  let { organization_id } = req.params;
  let user = req.user;

  let { showTask } = req.query;

  showTask = showTask === "true";

  let clientWhere = !user.is_employee
    ? {
        id: user.client.client_id,
      }
    : {};

  let moduleInclude = showTask
    ? {
        include: [
          {
            association: EP_Project.modules,
            attributes: ["id", "name"],
          },
        ],
      }
    : {};

  let [clients, error] = await get(
    Request,
    { organization_id, ...clientWhere },
    null,
    null,
    null,
    {
      include: [
        {
          association: Request.projects,
          attributes: ["id", "name"],
          ...moduleInclude,
        },
      ],
      attributes: ["id", "name"],
    }
  );

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, clients));
  }
};

const bufferToStream = (buffer) => {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const generatePdf = async (req, res) => {
  let { id } = req.params;

  let request = await Request.findOne({
    where: {
      id,
    },
  });

  let image = fs
    .readFileSync(
      path.resolve("app", "modules", "Request", "controllers", "logo.jpg")
    )
    .toString("base64");
  let image2 = fs
    .readFileSync(
      path.resolve("app", "modules", "Request", "controllers", "logo2.jpg")
    )
    .toString("base64");

  let [year1, year2] = request.dataValues.school_year.split("-");
  let data = {
    ...request.dataValues,
    year1,
    year2,
  };

  let contentHtml = await renderTemplate({
    name: "RAlp",
    image,
    image2,
    ...data,
  });

  // return res.send(contentHtml);

  let pdf = await createPdf(contentHtml, {
    path: `test.pdf`,
    format: "A4",
    displayHeaderFooter: true,
    scale: 0.5,
    landscape: false,
    // `<span id="date" style=" color:#808080; font-size: 10px; width: 100%; height: 50px;  border-top:1px solid ${color}; margin-left:15px; margin-right:15px; padding: 5px; ">
    //                       <span style="margin-left:10px; margin-top:200px;">Report Date [${dayjs().format(
    //                         'DD.MM.YY'
    //                       )}]</span>
    //                       <div style="float:right" margin-top:200px;><span class="pageNumber" ></span>/<span class="totalPages"></span></div>
    //                  </span>`
  });

  // console.log(buffer)
  res.header("Content-type", "application/pdf");
  // res.send(buffer);
  res.attachment();
  // return bufferToStream(pdf).pipe(res);

  res.send(pdf);
};

module.exports = {
  handleGetAllOrganizationRequest,
  handleGetAllOrganizationRequestDropdown,
  handleGetOrganizationRequest,
  handleCreateRequest,
  handleGetUpdatRequest,
  handleGetRequestsWithProjectFilter,
  generatePdf,
};
