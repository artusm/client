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
import Chart from "react-apexcharts";

import Header from "../../components/root/Header";
import {DEFAULT_CONFIG, TimeBuckets} from "../../utils/time_buckets";
import {convertDatesToLocal} from "../../utils/date";


const loadData = async (esl, startTime, endTime) => {
    try {
        const timeBuckets = new TimeBuckets(DEFAULT_CONFIG);

        timeBuckets.setBounds({
            min: startTime,
            max: endTime,
        });

        const { data } = await client.post("http://localhost:9200/li-*/_search", {
            size: 0,
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                esl: esl,
                            },
                        },
                    ],
                    filter: [
                        {
                            range: {
                                "@timestamp": {
                                    gte: startTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                                    lte: endTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
                                },
                            },
                        },
                    ],
                },
            },
            aggs: {
                timestamp_histogram: {
                    histogram: {
                        field: "@timestamp",
                        interval: timeBuckets.getInterval().asMilliseconds(),
                    },
                    aggs: {
                        avg_temp: {
                            avg: {
                                field: "esl_database_status.temp",
                            },
                        },
                    },
                },
            },
        });

        const dates = convertDatesToLocal(
            get(data, "aggregations.timestamp_histogram.buckets.*.key_as_string") ??
            []
        );
        const xxl1 =
            get(data, "aggregations.timestamp_histogram.buckets.*.avg_temp.value") ??
            [];

        return {
            dates,
            xxl1,
            dateFormat: timeBuckets.getScaledDateFormat()
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
    const {data, onChangeEsl, isLoading, onTimeChange} = useData();

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
                datetimeUTC: false,
                format: data.dateFormat
            }
        },
        tooltip: {
            theme: 'dark',
            x: {
                format: data.dateFormat
            }
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
