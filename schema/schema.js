const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");
const clientSchema = require("../model/Client");
const projectSchema = require("../model/Project");

// Project Type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return clientSchema.findById(parent.clientId);
      },
    },
  }),
});

// Client Type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return projectSchema.find();
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return projectSchema.findById(args.id);
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return clientSchema.find();
      },
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return clientSchema.findById(args.id);
      },
    },
  },
});

//   mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // addclient
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const { name, email, phone } = args;
        const client = clientSchema.create({
          name,
          email,
          phone,
        });

        return client;
      },
    },
    // deleteClient
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        projectSchema.find({ clientId: args.id }).then((projects) => {
          projects.forEach((project) => {
            project.remove();
          });
        });
        return clientSchema.findByIdAndDelete(args.id);
      },
    },
    // addProject
    addProject: {
      type: ProjectType,
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        description: {
          type: GraphQLNonNull(GraphQLString),
        },
        status: {
          type: new GraphQLEnumType({
            name: "projectStatus",
            values: {
              new: { value: "Not started" },
              progress: { value: "In progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not started"
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const { name, description, status, clientId } = args;
        const project = projectSchema.create({
          name,
          description,
          status,
          clientId,
        });
        return project;
      },
    },
    // deleteProject
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return projectSchema.findByIdAndDelete(args.id);
      },
    },
    // updateProject
    updateProject: {
      type: ProjectType,
      args: {
        name: {
          type: GraphQLString,
        },
        description: {
          type: GraphQLString,
        },
        status: {
          type: new GraphQLEnumType({
            name: "projectStatusUpdate",
            values: {
              new: { value: "Not started" },
              progress: { value: "In progress" },
              completed: { value: "Completed" },
            },
            defaultValue: "Not started",
          }),
        },
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const { name, description, status, id } = args;
        return projectSchema.findByIdAndUpdate(
          id,
          {
            $set: {
              name,
              description,
              status,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
