import apolloClient from "@/configs/apollo.config";
import { gql } from "@apollo/client";
import { FunctionDeclaration, Type } from "@google/genai";

export const getProjectInformationFunctionDeclaration: FunctionDeclaration = {
  name: "getProjectInformation",
  description:
    "Use this tool to get detailed information about a specific GitHub project using its unique project ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      projectId: {
        type: Type.STRING,
        description: "The unique ID of the project.",
      },
    },
  },
  response: {
    type: Type.OBJECT,
    properties: {
      project: {
        type: Type.OBJECT,
        description: "The detailed information about the project.",
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
          fields: {
            type: Type.OBJECT,
            description: "The fields of the project.",
            properties: {
              totalCount: {
                type: Type.NUMBER,
                description: "The total number of fields.",
              },
              nodes: {
                type: Type.ARRAY,
                description: "The list of fields.",
                items: {
                  type: Type.OBJECT,
                  description: "A project field.",
                  properties: {
                    name: {
                      type: Type.STRING,
                      description: "The name of the field.",
                    },
                    dataType: {
                      type: Type.STRING,
                      description: "The data type of the field.",
                    },
                    configuration: {
                      type: Type.OBJECT,
                      description: "The configuration of an iteration field.",
                      nullable: true,
                      properties: {
                        duration: {
                          type: Type.INTEGER,
                          description: "The duration of each iteration.",
                        },
                        startDay: {
                          type: Type.STRING,
                          description: "The start day of the iterations.",
                        },
                        iterations: {
                          type: Type.ARRAY,
                          description: "The list of upcoming iterations.",
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              duration: {
                                type: Type.INTEGER,
                                description: "The duration of the iteration.",
                              },
                              startDate: {
                                type: Type.STRING,
                                description: "The start date of the iteration.",
                              },
                              title: {
                                type: Type.STRING,
                                description: "The title of the iteration.",
                              },
                            },
                          },
                        },
                        completedIterations: {
                          type: Type.ARRAY,
                          description: "The list of completed iterations.",
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              duration: {
                                type: Type.INTEGER,
                                description:
                                  "The duration of the completed iteration.",
                              },
                              startDate: {
                                type: Type.STRING,
                                description:
                                  "The start date of the completed iteration.",
                              },
                              title: {
                                type: Type.STRING,
                                description:
                                  "The title of the completed iteration.",
                              },
                            },
                          },
                        },
                      },
                    },
                    options: {
                      type: Type.ARRAY,
                      description: "The options of a single-select field.",
                      nullable: true,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          color: {
                            type: Type.STRING,
                            description: "The color of the option.",
                          },
                          description: {
                            type: Type.STRING,
                            description: "The description of the option.",
                          },
                          name: {
                            type: Type.STRING,
                            description: "The name of the option.",
                          },
                        },
                      },
                    },
                  },
                },
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
          repositories: {
            type: Type.OBJECT,
            description: "The repositories linked to the project.",
            properties: {
              totalCount: {
                type: Type.NUMBER,
                description: "The total number of repositories.",
              },
              nodes: {
                type: Type.ARRAY,
                description: "The list of repositories.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    description: {
                      type: Type.STRING,
                      description: "The description of the repository.",
                    },
                    id: {
                      type: Type.STRING,
                      description: "The unique ID of the repository.",
                    },
                    name: {
                      type: Type.STRING,
                      description: "The name of the repository.",
                    },
                    owner: {
                      type: Type.OBJECT,
                      description: "The owner of the repository.",
                      properties: {
                        login: {
                          type: Type.STRING,
                          description: "The username of the owner.",
                        },
                      },
                    },
                    nameWithOwner: {
                      type: Type.STRING,
                      description: "The name with owner of the repository.",
                    },
                    url: {
                      type: Type.STRING,
                      description: "The URL of the repository.",
                    },
                    visibility: {
                      type: Type.STRING,
                      description: "The visibility of the repository.",
                    },
                  },
                },
              },
            },
          },
          title: {
            type: Type.STRING,
            description: "The title of the project.",
          },
          statusUpdates: {
            type: Type.OBJECT,
            description: "The status updates of the project.",
            properties: {
              totalCount: {
                type: Type.NUMBER,
                description: "The total number of status updates.",
              },
              nodes: {
                type: Type.ARRAY,
                description: "The list of status updates.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: {
                      type: Type.STRING,
                      description: "The title of the status update.",
                    },
                    body: {
                      type: Type.STRING,
                      description: "The body content of the status update.",
                    },
                    createdAt: {
                      type: Type.STRING,
                      description:
                        "The creation date and time of the status update.",
                    },
                    status: {
                      type: Type.STRING,
                      description: "The status of the status update.",
                    },
                    startDate: {
                      type: Type.STRING,
                      description: "The start date of the status update.",
                    },
                    targetDate: {
                      type: Type.STRING,
                      description: "The target date of the status update.",
                    },
                  },
                },
              },
            },
          },
          template: {
            type: Type.BOOLEAN,
            description: "Whether the project is a template or not.",
          },
          teams: {
            type: Type.OBJECT,
            description: "The teams associated with the project.",
            properties: {
              totalCount: {
                type: Type.NUMBER,
                description: "The total number of teams.",
              },
              nodes: {
                type: Type.ARRAY,
                description: "The list of teams.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    combinedSlug: {
                      type: Type.STRING,
                      description: "The combined slug of the team.",
                    },
                    description: {
                      type: Type.STRING,
                      description: "The description of the team.",
                    },
                    name: {
                      type: Type.STRING,
                      description: "The name of the team.",
                    },
                    members: {
                      type: Type.OBJECT,
                      description: "The members of the team.",
                      properties: {
                        totalCount: {
                          type: Type.NUMBER,
                          description: "The total number of members.",
                        },
                        nodes: {
                          type: Type.ARRAY,
                          description: "The list of members.",
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              email: {
                                type: Type.STRING,
                                description: "The email of the member.",
                              },
                              login: {
                                type: Type.STRING,
                                description: "The username of the member.",
                              },
                              name: {
                                type: Type.STRING,
                                description: "The name of the member.",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          url: {
            type: Type.STRING,
            description: "The URL of the project.",
          },
        },
      },
    },
  },
};

export default async function getProjectInformation(projectId: string) {
  if (projectId && projectId.trim() === "") {
    return {
      error: true,
      message: "Invalid project ID provided.",
    };
  }

  const sanitizedProjectId = projectId.replace(/[^a-zA-Z0-9_-]/g, "");
  if (sanitizedProjectId !== projectId) {
    return {
      error: true,
      message: "Project ID contains invalid characters.",
    };
  }

  const queryResponse = await apolloClient.query<{
    node: {
      closed: boolean;
      creator: {
        login: string;
        email: string;
        name: string;
      };
      fields: {
        totalCount: number;
        nodes: Array<
          | {
              name: string;
              dataType: string;
            }
          | {
              name: string;
              dataType: string;
              configuration: {
                duration: number;
                startDay: string;
                iterations: Array<{
                  duration: number;
                  startDate: string;
                  title: string;
                }>;
                completedIterations: Array<{
                  duration: number;
                  startDate: string;
                  title: string;
                }>;
              };
            }
          | {
              name: string;
              dataType: string;
              options: Array<{
                color: string;
                description: string;
                name: string;
              }>;
            }
        >;
      };
      id: string;
      number: number;
      public: boolean;
      readme: string;
      shortDescription: string;
      repositories: {
        totalCount: number;
        nodes: Array<{
          description: string;
          id: string;
          name: string;
          nameWithOwner: string;
          url: string;
          visibility: string;
        }>;
      };
      title: string;
      statusUpdates: {
        totalCount: number;
        nodes: Array<{
          body: string;
          status: string;
          startDate: string;
          targetDate: string;
        }>;
      };
      template: string;
      teams: {
        totalCount: number;
        nodes: Array<{
          combinedSlug: string;
          description: string;
          name: string;
          members: {
            totalCount: number;
            nodes: Array<{
              email: string;
              login: string;
              name: string;
            }>;
          };
        }>;
      };
      url: string;
    };
  }>({
    query: gql`
      query ProjectInformation {
        node(id: "${sanitizedProjectId}") {
          ... on ProjectV2 {
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
            fields(first: 20) {
              totalCount
              nodes {
                ... on ProjectV2Field {
                  name
                  dataType
                }
                ... on ProjectV2IterationField {
                  name
                  dataType
                  configuration {
                    duration
                    startDay
                    iterations {
                      duration
                      startDate
                      title
                    }
                    completedIterations {
                      duration
                      startDate
                      title
                    }
                  }
                }
                ... on ProjectV2SingleSelectField {
                  dataType
                  name
                  options {
                    color
                    description
                    name
                  }
                }
              }
            }
            id
            number
            public
            readme
            shortDescription
            repositories(first: 5) {
              nodes {
                description
                id
                name
                nameWithOwner
                url
                visibility
              }
              totalCount
            }
            title
            statusUpdates(first: 10) {
              nodes {
                body
                status
                startDate
                targetDate
              }
              totalCount
            }
            template
            teams(first: 5) {
              totalCount
              nodes {
                combinedSlug
                description
                name
                members(first: 20) {
                  totalCount
                  nodes {
                    email
                    login
                    name
                  }
                }
              }
            }
            url
          }
        }
      }
    `,
  });

  if (queryResponse.error || !queryResponse.data) {
    console.error(`Failed to project:`, queryResponse.error);
    return {
      error: true,
      message: "Failed to project from GitHub.",
    };
  }

  return {
    project: queryResponse.data.node,
  };
}
