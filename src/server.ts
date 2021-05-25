import { Server } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
    let server = new Server({
        environment,

        seeds(server) {
            server.db.loadData({
                users: [
                    {
                        enabled: true,
                        username: 'test',
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

            this.get("/stats", () => {
                return {totalCount: 4020916, errorCount: 402, rayCount: 1762763, driverCount: 1947878, accessCount: 310275, newForHour: 1231, newForDay: 574123,}
            });

            this.get("/field-stats", () => {
                return {
                    totalCount: 4020916,
                    fieldStats: [
                        {
                            fieldName: '@timestamp',
                            type: 'date',
                            count: 4020916,
                            earliest: 1621890000083,
                            latest: 1621911424000
                        },
                        {
                            fieldName: '@read_at',
                            type: 'date',
                            count: 4020916,
                            earliest: 1621890000083,
                            latest: 1621911424000
                        },
                        {
                            fieldName: 'message',
                            type: 'text',
                            count: 4020916,
                            examples: [
                                'star.services.picture:process_status_by_id:59 - Picture status for 2000001621578 is undefined, cluster is unknown',
                                'ESL Status requested from driver 0',
                                'ESL Status requested',
                                'Got event -> {\'type\': \'reconnected\', \'timestamp\': 1617570068459, \'esl\': 2000003563951, \'id\': 80425}',
                                'ESL 2000004725563 Status {}',
                                'Database ESL 2000004097875 Status {\'Esl\': {\'2000004097875\': {\'id\': \'2000004097875\', \'idx\': \'\', \'driver\': 0, \'online\': 0, \'type\': \'A\', \'size\': 0.0, \'display_type\': \'bwr\', \'height\': 0, \'width\': 0, \'proton_version\': 1, \'hw_version\': 1, \'sw_version\': 705, \'boot_version\': 603, \'boot_mode\': 0, \'esl_disp_type\': 5, \'esl_image_type\': 3, \'esl_disp_col\': 1, \'esl_width\': 128, \'esl_height\': 296, \'draw_count\': 42, \'batt_last\': 3084, \'batt_min\': 2880, \'temp\': 15, \'rssi\': 83, \'uptime\': 2059760, \'total_time\': 2059760, \'timestamp\': 0, \'err_timestamp\': 0, \'errcode\': 0, \'err_file\': 0, \'err_line\': 0, \'pic_crc\': 456978258, \'fw_crc\': 1348493123}}}',
                                'ESL Status requested from driver 0',
                                'Database ESL 2000004750848 Status {\'Esl\': {\'2000004750848\': {\'id\': \'2000004750848\', \'idx\': \'\', \'driver\': 0, \'online\': 1, \'type\': \'A\', \'size\': 0.0, \'display_type\': \'bwr\', \'height\': 0, \'width\': 0, \'proton_version\': 1, \'hw_version\': 1, \'sw_version\': 705, \'boot_version\': 705, \'boot_mode\': 0, \'esl_disp_type\': 2, \'esl_image_type\': 1, \'esl_disp_col\': 1, \'esl_width\': 152, \'esl_height\': 152, \'draw_count\': 34, \'batt_last\': 3150, \'batt_min\': 2892, \'temp\': 25, \'rssi\': 81, \'uptime\': 2796085, \'total_time\': 2796085, \'timestamp\': 1617569830, \'err_timestamp\': 0, \'errcode\': 0, \'err_file\': 0, \'err_line\': 0, \'pic_crc\': 1129220828, \'fw_crc\': 4294967295}}}'
                            ]
                        },
                        {
                            fieldName: 'offset',
                            type: 'number',
                            min: 0,
                            avg: 13123123122.45,
                            max: 40129412041,
                            count: 4020916,
                            distinctCount: 4000311,
                            topValues: [
                                {
                                    key: 412412312,
                                    doc_count: 30
                                },
                                {
                                    key: 123476,
                                    doc_count: 12
                                },
                                {
                                    key: 634534,
                                    doc_count: 3
                                },
                                {
                                    key: 4124121,
                                    doc_count: 2
                                },
                                {
                                    key: 3123242,
                                    doc_count: 2
                                }
                            ]
                        },
                        {
                            fieldName: 'esl',
                            type: 'number',
                            count: 4020916,
                            distinctCount: 2375,
                            min: 2000001097875,
                            max: 2000009492104,
                            avg: 2000004324234.43,
                            topValues: [
                                {
                                    key: 2000004097875,
                                    doc_count: 7043
                                },
                                {
                                    key: 2000004722586,
                                    doc_count: 5523
                                },
                                {
                                    key: 2000004666019,
                                    doc_count: 4321
                                },
                                {
                                    key: 2000003669462,
                                    doc_count: 4304
                                },
                                {
                                    key: 2000004731892,
                                    doc_count: 4124
                                }
                            ]
                        },
                        {
                            fieldName: 'level',
                            type: 'keyword',
                            count: 4020916,
                            distinctCount: 4,
                            topValues: [
                                {
                                    key: 'DEBUG',
                                    doc_count: 2829259
                                },
                                {
                                    key: 'INFO',
                                    doc_count: 802413
                                },
                                {
                                    key: 'WARNING',
                                    doc_count: 388889,
                                },
                                {
                                    key: 'ERROR',
                                    doc_count: 355
                                }
                            ]
                        },
                        {
                            fieldName: 'machine.hostname',
                            type: 'keyword',
                            count: 4020916,
                            distinctCount: 1,
                            topValues: [
                                {
                                    key: 'DESKTOP-IBVTCQR',
                                    doc_count: 4020916
                                }
                            ]
                        },
                        {
                            fieldName: 'log_type',
                            type: 'keyword',
                            count: 4020916,
                            distinctCount: 3,
                            topValues: [
                                {
                                    key: 'driver',
                                    doc_count: 1947878
                                },
                                {
                                    key: 'ray',
                                    doc_count: 1762763
                                },
                                {
                                    key: 'access',
                                    doc_count: 310275
                                },
                            ]
                        },
                        {
                            fieldName: 'source',
                            type: 'keyword',
                            count: 4020916,
                            distinctCount: 3,
                            topValues: [
                                {
                                    key: '/home/arthur/Logs/access.log',
                                    doc_count: 310275
                                },
                                {
                                    key: '/home/arthur/Logs/driver.log',
                                    doc_count: 1947878
                                },
                                {
                                    key: '/home/arthur/Logs/ray.log',
                                    doc_count: 1762763
                                },
                            ]
                        },
                        {
                            fieldName: 'type',
                            type: 'keyword',
                            count: 4020916,
                            distinctCount: 3,
                            topValues: [
                                {
                                    key: 'driver',
                                    doc_count: 1947878
                                },
                                {
                                    key: 'ray',
                                    doc_count: 1762763
                                },
                                {
                                    key: 'access',
                                    doc_count: 310275
                                },
                            ]
                        },
                        {
                            fieldName: 'esl_status.PROTONV',
                            type: 'number',
                            min: 1,
                            max: 1,
                            avg: 1,
                            distinctCount: 1,
                            count: 1123121,
                            topValues: [
                                {
                                    key: 1,
                                    doc_count: 1123121
                                }
                            ]
                        },
                        {
                            fieldName: 'esl_status.BOOTMODE',
                            type: 'number',
                            min: 1,
                            max: 1,
                            avg: 1,
                            distinctCount: 1,
                            count: 1123121,
                            topValues: [
                                {
                                    key: 1,
                                    doc_count: 1123121
                                }
                            ]
                        },
                        {
                            fieldName: 'esl_status.BOOTVER',
                            type: 'number',
                            min: 0,
                            max: 0,
                            avg: 0,
                            distinctCount: 1,
                            count: 1123121,
                            topValues: [
                                {
                                    key: 0,
                                    doc_count: 1123121
                                }
                            ]
                        },
                        {
                            fieldName: 'esl_status.APPVER',
                            type: 'number',
                            min: 1,
                            max: 1,
                            avg: 1,
                            distinctCount: 1,
                            count: 1123121,
                            topValues: [
                                {
                                    key: 1,
                                    doc_count: 1123121
                                }
                            ]
                        },
                        {
                            fieldName: 'esl_status.DispType',
                            type: 'number',
                            min: 5,
                            max: 5,
                            avg: 5,
                            distinctCount: 1,
                            count: 1123121,
                            topValues: [
                                {
                                    key: 5,
                                    doc_count: 1123121
                                }
                            ]
                        },
                        {
                            fieldName: 'esl_status.ImageType',
                            type: 'number',
                            min: 3,
                            max: 3,
                            avg: 3,
                            distinctCount: 1,
                            count: 1123121,
                            topValues: [
                                {
                                    key: 3,
                                    doc_count: 1123121
                                }
                            ]
                        },
                        // {
                        //     fieldName: 'esl_status.Crc32Img',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.Crc32Fw',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.DispCol',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.ScDimX',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.ScDimY',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.Uptime',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.TotalTime',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.DrawSum',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.Vmin',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.Vlast',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.Temp',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.Rssi',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.Errcode',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.ErrTime',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.ErrFileID',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_status.ErrLine',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.id',
                        //     type: 'keyword'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.idx',
                        //     type: 'keyword'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.driver',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.online',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.type',
                        //     type: 'keyword'
                        // },
                        {
                            fieldName: 'esl_database_status.size',
                            type: 'number',
                            min: 0,
                            avg: 0,
                            max: 0,
                            count: 132,
                            distinctCount: 1,
                            topValues: [
                                {
                                    key: 0,
                                    doc_count: 132
                                }
                            ]
                        },
                        // {
                        //     fieldName: 'esl_database_status.display_type',
                        //     type: 'keyword'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.height',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.width',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.proton_version',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.hw_version',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.sw_version',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.boot_version',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.boot_mode',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.esl_disp_type',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.esl_image_type',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.esl_disp_col',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.esl_width',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.esl_height',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.draw_count',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.batt_last',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.batt_min',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.temp',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.rssi',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.uptime',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.total_time',
                        //     type: 'number'
                        // },
                        {
                            fieldName: 'esl_database_status.timestamp',
                            type: 'date',
                            count: 3000,
                            earliest: 1621890000083,
                            latest: 1621911424000
                        },
                        {
                            fieldName: 'esl_database_status.err_timestamp',
                            type: 'date',
                            count: 502301,
                            earliest: 1621890000083,
                            latest: 1621911424000
                        },
                        {
                            fieldName: 'esl_database_status.errcode',
                            type: 'number',
                            count: 502301,
                            min: 0,
                            max: 1,
                            avg: 0.5,
                            distinctCount: 2,
                            topValues: [
                                {
                                    key: 0,
                                    doc_count: 412312,
                                },
                                {
                                    key: 1,
                                    doc_count: 502301 - 412312
                                }
                            ]
                        },
                        {
                            fieldName: 'esl_database_status.err_file',
                            type: 'number',
                            min: 0,
                            avg: 0,
                            max: 0,
                            count: 132,
                            distinctCount: 1,
                            topValues: [
                                {
                                    key: 0,
                                    doc_count: 132
                                }
                            ]
                        },
                        {
                            fieldName: 'esl_database_status.err_line',
                            type: 'number',
                            min: 0,
                            avg: 0,
                            max: 0,
                            count: 132,
                            distinctCount: 1,
                            topValues: [
                                {
                                    key: 0,
                                    doc_count: 132
                                }
                            ]
                        },
                        // {
                        //     fieldName: 'esl_database_status.pic_crc',
                        //     type: 'number'
                        // },
                        // {
                        //     fieldName: 'esl_database_status.fw_crc',
                        //     type: 'number'
                        // },
                        {
                            fieldName: 'event.type',
                            type: 'keyword',
                            count: 943,
                            distinctCount: 3,
                            topValues: [
                                {
                                    key: 'connected',
                                    doc_count: 402,
                                },
                                {
                                    key: 'reconnected',
                                    doc_count: 329,
                                },
                                {
                                    key: 'draw',
                                    doc_count: 212
                                }
                            ]
                        },
                        {
                            fieldName: 'event.timestamp',
                            type: 'date',
                            count: 943,
                            earliest: 1621890000083,
                            latest: 1621911424000
                        },
                        {
                            fieldName: 'event.els',
                            type: 'number',
                            distinctCount: 123,
                            count: 943,
                            topValues: [
                                {
                                    key: 2000004097875,
                                    doc_count: 123
                                },
                                {
                                    key: 2000004722586,
                                    doc_count: 23
                                },
                                {
                                    key: 2000004666019,
                                    doc_count: 12
                                },
                                {
                                    key: 2000003669462,
                                    doc_count: 5
                                },
                                {
                                    key: 2000004731892,
                                    doc_count: 4
                                }
                            ]
                        },
                        {
                            fieldName: 'event.id',
                            type: 'number',
                            distinctCount: 943,
                            min: 1,
                            max: 943,
                            avg: 471.5,
                            count: 943,
                            topValues: [
                                {
                                    key: 943,
                                    doc_count: 1,
                                },
                                {
                                    key: 942,
                                    doc_count: 1
                                },
                                {
                                    key: 941,
                                    doc_count: 1
                                },
                                {
                                    key: 940,
                                    doc_count: 1
                                },
                                {
                                    key: 939,
                                    doc_count: 1
                                }
                            ]
                        },
                        {
                            fieldName: 'event.error',
                            type: 'number',
                            distinctCount: 2,
                            min: 0,
                            max: 1,
                            avg: 0.5,
                            count: 943,
                            topValues: [
                                {
                                    key: 0,
                                    doc_count: 910
                                },
                                {
                                    key: 1,
                                    doc_count: 33
                                }
                            ]

                        },
                        {
                            fieldName: 'event.dongle',
                            type: 'number',
                            count: 34,
                            distinctCount: 1,
                            max: 12,
                            min: 12,
                            avg: 12,
                            topValues: [
                                {
                                    key: 12,
                                    doc_count: 34
                                }
                            ]
                        },
                        {
                            fieldName: 'event.slot',
                            type: 'number',
                            count: 34,
                            distinctCount: 1,
                            max: 800,
                            min: 800,
                            avg: 800,
                            topValues: [
                                {
                                    key: 800,
                                    doc_count: 34
                                }
                            ]
                        }
                    ]
                }
            })

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
