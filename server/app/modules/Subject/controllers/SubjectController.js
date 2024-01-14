const path = require("path");
const Op = require("sequelize").Op;
const sequelize = require("sequelize");

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

const { Subject, EP_Project } = require(path.resolve("database", "models"));

const handleGetAllOrganizationSubject = async (req, res) => {
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
    Subject,
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
const handleGetAllOrganizationSubjectDropdown = async (req, res) => {
  let { organization_id } = req.params;

  let [clients, error] = await get(
    Subject,
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

const handleGetOrganizationSubject = async (req, res) => {
  let { organization_id, id } = req.params;

  let [users, error] = await getOne(Subject, { organization_id, id });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, users));
  }
};

const handleCreateSubject = async (req, res) => {
  let data = req.body;

  let [subject, error] = await create(Subject, data);
  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(formatResponse(false, null, "Subject id must be unique."));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, subject));
  }
};

const handleGetUpdatSubject = async (req, res) => {
  let { id } = req.params;

  let [subject, error] = await update(Subject, req.body, {
    id,
  });

  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(formatResponse(false, null, "Subject id must be unique."));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, subject));
  }
};

const handleGetSubjectsWithProjectFilter = async (req, res) => {
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
    Subject,
    { organization_id, ...clientWhere },
    null,
    null,
    null,
    {
      include: [
        {
          association: Subject.projects,
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

module.exports = {
  handleGetAllOrganizationSubject,
  handleGetAllOrganizationSubjectDropdown,
  handleGetOrganizationSubject,
  handleCreateSubject,
  handleGetUpdatSubject,
  handleGetSubjectsWithProjectFilter,
};
