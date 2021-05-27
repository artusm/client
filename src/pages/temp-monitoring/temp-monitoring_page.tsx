import {
    EuiPage,
    EuiPageBody,
    EuiPageHeader,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageSideBar,
    EuiSelectable
} from "@elastic/eui";
import {EslList} from "./components/esl-list";
import {Datepicker} from "./components/datepicker";
import React, {useEffect, useState} from "react";
import client from "redaxios";
import {get} from "get-wild";
import moment from "moment";
import Chart from "react-apexcharts";
import Header from "../../components/root/Header";

const convertDatesToLocal = (dates) => {
    if (dates && Array.isArray(dates)) {
        return dates.map(d => moment(d).utcOffset(360).format('YYYY-MM-DD HH:mm:ss'))
    }

    return [];
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const loadData = async (esl, startTime, endTime) => {
    try {
        const {data} = await client.post('http://localhost:9200/li-*/_search', {
            "size": 0,
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                "esl": esl
                            }
                        }
                    ],
                    "filter": [
                        {
                            "range": {
                                "@timestamp": {
                                    "gte": startTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                                    "lte": endTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ")
                                }
                            }
                        }
                    ]
                }
            },
            "aggs": {
                "histogram_with_avg_temp": {
                    "auto_date_histogram": {
                        "field": "@timestamp",
                        "buckets": 20,
                    },
                    "aggs": {
                        "avg_temp": {
                            "avg": {
                                "field": "esl_database_status.temp"
                            }
                        }
                    }
                }
            }
        });

        const dates = convertDatesToLocal(get(data, 'aggregations.histogram_with_avg_temp.buckets.*.key_as_string') ?? []);
        const xxl1 = get(data, 'aggregations.histogram_with_avg_temp.buckets.*.avg_temp.value') ?? [];

        return {
            dates,
            xxl1
        };
    } catch (e) {
        return [];
    }
};

const useData = () => {
    const [esl, setEsl] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [data, setData] = useState(null);

    const onChangeEsl = (esl) => {
        setEsl(esl);
    };

    const onTimeChange = (start, end) => {
        setStartTime(start);
        setEndTime(end);
    };

    useEffect(() => {
        if (esl && startTime && endTime) {
            const load = async () => {
                try {
                    const data = await loadData(esl, startTime, endTime);
                    // @ts-ignore
                    setData(data);
                } catch (e) {}

                setIsLoading(false);
            };
            setIsLoading(true);
            load();
        }
    }, [esl, startTime, endTime]);

    return {
        data,
        isLoading,
        onChangeEsl,
        onTimeChange,
    }
}


function TempMonitoringPage() {
    // @ts-ignore
    window.server.shutdown();
    const {data, onChangeEsl, isLoading, onTimeChange} = useData();
    useEffect(() => {
        // @ts-ignore
        window.server.shutdown();

        return () => {
            //@ts-ignore
            console.log(window.server.start)
        }
    }, [])
    return (
        <>
            <Header
                breadcrumbs={[
                    {
                        text: "Мониторинг температуры ценников",
                    },
                ]}
            />
            <EuiPage paddingSize="none">
                <EuiPageSideBar sticky>
                    <EslList onChangeEsl={onChangeEsl} isGlobalLoading={isLoading} />
                </EuiPageSideBar>

                <EuiPageBody panelled>
                    <EuiPageHeader
                        iconType="monitoringApp"
                        pageTitle="Мониторинг температуры ценников"
                        rightSideItems={[<Datepicker isLoading={isLoading} onChange={onTimeChange}/>]}
                    />

                    <EuiPageContent
                        hasBorder={false}
                        hasShadow={false}
                        paddingSize="none"
                        color="transparent"
                        borderRadius="none">
                        <EuiPageContentBody>
                            {data && <Chart
                                // @ts-ignore
                                options={getOptions(data)}
                                series={getSeries(data)}
                                type="area"
                                width="1200"
                            />}
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </>
    );
}

function getOptions(data) {
    return {
        chart: {
            height: 350,
            type: 'area'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'datetime',
            categories: data.dates,
            labels: {
                datetimeUTC: false
            }
        },
        tooltip: {
            theme: 'dark',
            x: {
                format: 'dd.MM.yy HH:mm'
            },
        },
    }
}

function getSeries(data) {
    return [
        {
            name: "temp",
            data: data.xxl1
        }
    ]
}



export default TempMonitoringPage;
