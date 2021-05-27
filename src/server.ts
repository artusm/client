import { Server } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
    let server = new Server({
        environment,

        seeds(server) {
            server.db.loadData({
                users: [
                    {
                        enabled: true,
                        username: 'tester',
                        email: 'test@t.tt',
                        full_name: 'вфывф ывф ы',
                        password: 'test',
                        permissions: ['edit_users', 'access_anomaly_logs', 'access_field_analyse', 'user_list']
                    }
                ]
            })
        },

        routes() {
            this.namespace = "api";
            this.timing = 750;
            this.urlPrefix = 'http://localhost:3000'

            this.get("/stats", () => {
                return {totalCount: 4020916, errorCount: 402, rayCount: 1762763, driverCount: 1947878, accessCount: 310275, newForHour: 1231, newForDay: 574123, anomalyCount: 3}
            });

            this.get("/users", ({db}) => {
                return db.users
            });

            this.get("/users/:username", ({db}, request) => {
                const {username} = request.params;

                return db.users.findBy({
                    username,
                })
            });

            this.post("/users", (schema, request) => {
                let user = JSON.parse(request.requestBody);

                return {
                    created: true,
                    user
                };
            })

            this.post("/login", ({db}, request) => {
                let input = JSON.parse(request.requestBody);

                const user = db.users.findBy({
                    enabled: true,
                    username: input.username,
                    password: input.password
                });

                if (user) {
                    return {
                        success: true,
                        user,
                    }
                }

                return {success: false}
            });

            this.get("/anomaly-logs", ({db}) => {
                return [
                    {
                        description: "Пустой статус",
                        timestamp: "2021-05-23T06:50:00.000Z",
                        criticLevel: 3,
                        log: {
                            message: "ESL 2000003463534 Status {}"
                        }
                    },
                    {
                        description: "Пустой статус",
                        timestamp: "2021-05-23T06:50:00.000Z",
                        criticLevel: 3,
                        log: {
                            message: "ESL 2000003463534 Status {}"
                        }
                    },
                    {
                        description: "Пустой статус",
                        timestamp: "2021-05-23T06:50:00.000Z",
                        criticLevel: 3,
                        log: {
                            message: "ESL 2000003463534 Status {}"
                        }
                    },
                ]
            })

            this.put("/users/:id", ({db}, request) => {
                let user = JSON.parse(request.requestBody);

                db.users.update(request.params.id, user)

                return {
                    updated: true,
                    user
                };
            })
        }
    });

    // @ts-ignore
    window.server = server;

    return server;
}
