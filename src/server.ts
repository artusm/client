import { Server } from 'miragejs';

export function makeServer({ environment = 'development' } = {}) {
    const createUser = (username) => ({
        enabled: false,
        username,
        email: `${username}@example.com`,
        full_name: username,
        password: username,
        permissions: ['access.anomaly_logs'],
    });

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
                        permissions: [
                            "user.edit", "user.create", "user.view_list", "access.anomaly_logs", "access.field_stats", "access.temp_stat", "access.rate", "user.delete"
                        ],
                    },
                    {
                        enabled: true,
                        username: 'usmanov',
                        email: 'usmanov@example.com',
                        full_name: 'Usmanov Arthur',
                        password: '12345',
                        permissions: [
                            "user.edit", "user.create", "user.view_list", "access.anomaly_logs", "access.field_stats", "access.temp_stat", "access.rate", "user.delete"
                        ],
                    },
                    {
                        enabled: true,
                        username: 'tester2',
                        email: 'test@t.tt',
                        full_name: 'вфывф ывф ы',
                        password: '12345678',
                        permissions: [],
                    },
                    createUser('user1'),
                    createUser('user2'),
                    createUser('user3'),
                    createUser('user4'),
                    createUser('user5'),
                    createUser('user6'),
                    createUser('user7'),
                    createUser('user8'),
                    createUser('user9'),
                    createUser('user10'),
                    createUser('user11'),
                    createUser('user12'),
                    createUser('user13'),
                    createUser('user14'),
                ],
            });
        },

        routes() {
            this.namespace = 'api';
            this.timing = 300;
            this.urlPrefix = 'http://localhost:3000';

            this.get('/users', ({ db }) => {
                return db.users;
            });

            this.get('/users/:username', ({ db }, request) => {
                const { username } = request.params;

                return db.users.findBy({
                    username,
                });
            });

            this.delete('/users/:ids', ({ db }, request) => {
                const { ids } = request.params;

                const idsNumber = ids.split(',');

                idsNumber.forEach((id) => db.users.remove(id));

                return db.users.findBy({
                    status: true,
                });
            });

            this.post('/users', ({db}, request) => {
                let user = JSON.parse(request.requestBody);

                db.users.insert(user);

                return {
                    created: true,
                    user,
                };
            });

            this.post('/login', ({ db }, request) => {
                let input = JSON.parse(request.requestBody);

                const user = db.users.findBy({
                    enabled: true,
                    username: input.username,
                    password: input.password,
                });

                if (user) {
                    return {
                        success: true,
                        user,
                    };
                }

                return { success: false };
            });

            this.put('/users/:id', ({ db }, request) => {
                let user = JSON.parse(request.requestBody);

                db.users.update(request.params.id, user);

                return {
                    updated: true,
                    user,
                };
            });
        },
    });

    // @ts-ignore
    window.server = server;

    return server;
}
