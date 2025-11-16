import apolloClient from "@/configs/apollo.config";
import { gql } from "@apollo/client";
import { FunctionDeclaration, Type } from "@google/genai";

export const fetchProjectsFunctionDeclaration: FunctionDeclaration = {
  name: "fetchProjects",
  description:
    "Use this tool to get a list of completed, ongoing and planned future projects. You can specify by the status of the project.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      status: {
        type: Type.STRING,
        format: "enum",
        enum: ["completed", "ongoing", "planned"],
        description: "The status of the projects to fetch.",
        nullable: true,
      },
    },
  },
  response: {
    type: Type.OBJECT,
    properties: {
      totalProjects: {
        type: Type.NUMBER,
        description: "The total number of projects.",
      },
      projects: {
        type: Type.ARRAY,
        description: "The list of top 20 projects.",
        items: {
          type: Type.OBJECT,
          properties: {
            closed: {
              type: Type.BOOLEAN,
              description: "Whether the project is closed or not.",
            },
            creator: {
              type: Type.OBJECT,
              description: "The creator of the project.",
              properties: {
                login: {
                  type: Type.STRING,
                  description: "The username of the creator.",
                },
                email: {
                  type: Type.STRING,
                  description: "The email of the creator.",
                },
                name: {
                  type: Type.STRING,
                  description: "The name of the creator.",
                },
              },
            },
            id: {
              type: Type.STRING,
              description: "The unique ID of the project.",
            },
            number: {
              type: Type.NUMBER,
              description: "The project number.",
            },
            public: {
              type: Type.BOOLEAN,
              description: "Whether the project is public or not.",
            },
            readme: {
              type: Type.STRING,
              description: "The README content of the project.",
            },
            shortDescription: {
              type: Type.STRING,
              description: "The short description of the project.",
            },
            title: {
              type: Type.STRING,
              description: "The title of the project.",
            },
            template: {
              type: Type.BOOLEAN,
              description: "Whether the project is a template or not.",
            },
            url: {
              type: Type.STRING,
              description: "The URL of the project.",
            },
          },
        },
      },
    },
  },
};

export default async function fetchProjects(status?: "completed" | "ongoing") {
  if (status && !["completed", "ongoing"].includes(status)) {
    return {
      error: true,
      message: "Invalid status provided. Must be 'completed' or 'ongoing'.",
    };
  }

  const queryResponse = await apolloClient.query<{
    user: {
      projectsV2: {
        totalCount: number;
        nodes: Array<{
          closed: boolean;
          creator: {
            login: string;
            email: string;
            name: string;
          };
          id: string;
          number: number;
          public: boolean;
          readme: string;
          shortDescription: string;
          title: string;
          template: string;
          url: string;
        }>;
      };
    };
  }>({
    query: gql`
      query UserProjects {
        user(login: "rutajdash") {
          projectsV2(first: 20) {
            totalCount
            nodes {
              closed
              creator {
                login
                ... on User {
                  email
                  name
                }
                ... on Organization {
                  email
                  name
                }
              }
              id
              number
              public
              readme
              shortDescription
              title
              template
              url
            }
          }
        }
      }
    `,
  });

  if (queryResponse.error) {
    console.error(`Failed to fetch projects:`, queryResponse.error);
    return {
      error: true,
      message: "Failed to fetch projects from GitHub.",
    };
  }

  if (!queryResponse.data) {
    return {
      error: true,
      message: "No data received from GitHub.",
    };
  }

  if (status) {
    return {
      totalProjects: queryResponse.data.user.projectsV2.totalCount,
      projects: queryResponse.data.user.projectsV2.nodes.filter((project) =>
        status === "completed" && project.closed
          ? true
          : status === "ongoing" && !project.closed
            ? true
            : false,
      ),
    };
  }

  return {
    totalProjects: queryResponse.data.user.projectsV2.totalCount,
    projects: queryResponse.data.user.projectsV2.nodes,
  };
}
