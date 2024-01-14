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

const { Teacher, EP_Project } = require(path.resolve("database", "models"));

const handleGetAllOrganizationTeacher = async (req, res) => {
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
    Teacher,
    null,
    sorting,
    ["id", "first_name", "last_name", "number"],
    pagingation
  );

  if (error) {
    console.log(error);
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, clients));
  }
};
const handleGetAllOrganizationTeacherDropdown = async (req, res) => {
  let { organization_id } = req.params;

  let [clients, error] = await get(
    Teacher,
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

const handleGetOrganizationTeacher = async (req, res) => {
  let { organization_id, id } = req.params;

  let [users, error] = await getOne(Teacher, { organization_id, id });

  if (error) {
    res.json(formatResponse(false, null));
  } else {
    res.json(formatResponse(true, users));
  }
};

const handleCreateTeacher = async (req, res) => {
  let data = req.body;

  let [teacher, error] = await create(Teacher, data);
  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(formatResponse(false, null, "Teacher id must be unique."));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, teacher));
  }
};

const handleGetUpdatTeacher = async (req, res) => {
  let { id } = req.params;

  let [teacher, error] = await update(Teacher, req.body, {
    id,
  });

  if (error) {
    if (error.errors[0]?.type === "unique violation") {
      res
        .status(409)
        .send(formatResponse(false, null, "Teacher id must be unique."));
    } else {
      res.json(formatResponse(false, null));
    }
  } else {
    res.json(formatResponse(true, teacher));
  }
};

const handleGetTeachersWithProjectFilter = async (req, res) => {
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
    Teacher,
    { organization_id, ...clientWhere },
    null,
    null,
    null,
    {
      include: [
        {
          association: Teacher.projects,
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
  handleGetAllOrganizationTeacher,
  handleGetAllOrganizationTeacherDropdown,
  handleGetOrganizationTeacher,
  handleCreateTeacher,
  handleGetUpdatTeacher,
  handleGetTeachersWithProjectFilter,
};
