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

const { EP_Course, EP_Project } = require(path.resolve("database", "models"));

const handleGetAllOrganizationCourse = async (req, res) => {
  let { organization_id } = req.params;
  let { paginate, sort, search } = req.query;

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

  let [clients, error] = await get(
    EP_Course,
    null,
    sorting,
    ["id", "name"],
    pagingation
  );

  if (error) {
    console.log(error);
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, clients));
  }
};
const handleGetAllOrganizationCourseDropdown = async (req, res) => {
  let { organization_id } = req.params;

  let [clients, error] = await get(
    EP_Course,
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

const handleGetOrganizationCourse = async (req, res) => {
  let { organization_id, id } = req.params;

  let [users, error] = await getOne(EP_Course, { organization_id, id });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, users));
  }
};

const handleCreateCourse = async (req, res) => {
  let data = req.body;

  let [course, error] = await create(EP_Course, data);
  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(formatResponse(false, null, "Course id must be unique."));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, course));
  }
};

const handleGetUpdatCourse = async (req, res) => {
  let { id } = req.params;

  let [course, error] = await update(EP_Course, req.body, {
    id,
  });

  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(formatResponse(false, null, "Course id must be unique."));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, course));
  }
};

const handleGetCoursesWithProjectFilter = async (req, res) => {
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
    EP_Course,
    { organization_id, ...clientWhere },
    null,
    null,
    null,
    {
      include: [
        {
          association: EP_Course.projects,
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
  let image = fs
    .readFileSync(
      path.resolve("app", "modules", "Course", "controllers", "logo.jpg")
    )
    .toString("base64");

  let data = {
    subject: "Physics",
    semester: "2nd",
    year1: "2020",
    year2: "2021",
    rating: "INC",
  };

  let contentHtml = await renderTemplate({ name: "RAlp", image, ...data });

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

  console.log("buffer");
  // console.log(buffer)
  res.header("Content-type", "application/pdf");
  // res.send(buffer);
  res.attachment();
  // return bufferToStream(pdf).pipe(res);

  res.send(pdf);
};

module.exports = {
  handleGetAllOrganizationCourse,
  handleGetAllOrganizationCourseDropdown,
  handleGetOrganizationCourse,
  handleCreateCourse,
  handleGetUpdatCourse,
  handleGetCoursesWithProjectFilter,
  generatePdf,
};
