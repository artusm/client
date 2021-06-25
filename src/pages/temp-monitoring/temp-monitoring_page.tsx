import {
  EuiPage,
  EuiPageBody,
  EuiPageHeader,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageSideBar,
  EuiCallOut,
  EuiFlexItem,
  EuiPanel,
  EuiStat,
  EuiIcon,
  EuiFlexGroup,
  EuiLoadingContent,
  EuiSpacer,
  EuiEmptyPrompt,
} from "@elastic/eui";
import { EslList } from "./components/esl-list";
import { Datepicker } from "../../components/datepicker";
import React, { useEffect, useState } from "react";
import client from "redaxios";
import { get } from "get-wild";
import Chart from "react-apexcharts";

import Header from "../../components/root/Header";
import { DEFAULT_CONFIG, TimeBuckets } from "../../utils/time_buckets";
import { convertDatesToLocal } from "../../utils/date";
import { humanNumber } from "../../utils/human-number";

const average = (arr) => arr.reduce((acc, v) => acc + v) / arr.length;

const nor = (a: any[]) => {
  if (!a[0]) {
    a[0] = a.find((el) => !!el);
  }

  if (!a[a.length - 1]) {
    a[a.length - 1] = a.reverse().find((el) => !!el);
  }

  return a.map((v, i) => {
    if (v) {
      return v;
    }

    const prev = a[i - 1];
    const next = a[i + 1];

    return average([prev, next]);
  });
};

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
        stats: {
          filter: { exists: { field: "esl_database_status.temp" } },
          aggs: {
            actual_stats: {
              stats: { field: "esl_database_status.temp" },
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
    const stats = get(data, "aggregations.stats.actual_stats") ?? {};

    return {
      dates,
      xxl1: nor(xxl1),
      dateFormat: timeBuckets.getScaledDateFormat(),
      stats: {
        count: stats.count || 0,
        min: stats.min || 0,
        max: stats.max || 0,
        avg: stats.avg || 0,
      },
    };
  } catch (e) {
    return {};
  }
};

export const Loader = () => (
  <>
    <EuiLoadingContent lines={3} />
    <EuiSpacer size="xxl" />
    <EuiSpacer size="xxl" />
    <EuiSpacer size="xxl" />
    <EuiSpacer size="xxl" />

    <EuiSpacer size="xxl" />
    <EuiSpacer size="xxl" />
    <EuiSpacer size="xxl" />
    <EuiSpacer size="xxl" />
    <EuiSpacer size="xxl" />
    <EuiSpacer size="xxl" />
    <EuiSpacer size="xxl" />
    <EuiSpacer size="xxl" />
    <EuiSpacer size="xxl" />
    <EuiSpacer size="xxl" />
    <EuiSpacer size="xxl" />
  </>
);

const useData = () => {
  const [esl, setEsl] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState<any>(null);

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
        setData(null);
        try {
          const data = await loadData(esl, startTime, endTime);
          // @ts-ignore
          setData(data);
        } catch (e) {
          setError(e);
        }

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
    error,
  };
};

function TempMonitoringPage() {
  const { data, onChangeEsl, isLoading, onTimeChange, error } = useData();

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
            rightSideItems={[
              <Datepicker isLoading={isLoading} onChange={onTimeChange} />,
            ]}
          />

          <EuiPageContent
            hasBorder={false}
            hasShadow={false}
            paddingSize="none"
            color="transparent"
            borderRadius="none"
          >
            <EuiPageContentBody>
              {error && (
                <EuiCallOut
                  iconType="faceSad"
                  color="danger"
                  title={`Ошибка при поиске: ${error?.message}`}
                />
              )}
              {!isLoading && !data && (
                <>
                  <EuiEmptyPrompt
                    iconType="arrowLeft"
                    title={<h2>Выберите ценник</h2>}
                  />
                  <EuiSpacer size="xxl" />
                  <EuiSpacer size="xxl" />
                  <EuiSpacer size="xxl" />
                  <EuiSpacer size="xxl" />

                  <EuiSpacer size="xxl" />
                  <EuiSpacer size="xxl" />
                  <EuiSpacer size="xxl" />
                  <EuiSpacer size="xxl" />
                  <EuiSpacer size="xxl" />
                  <EuiSpacer size="xxl" />
                  <EuiSpacer size="xxl" />
                  <EuiSpacer size="xxl" />
                  <EuiSpacer size="xxl" />
                  <EuiSpacer size="xxl" />
                  <EuiSpacer size="xxl" />
                </>
              )}
              {isLoading || data ? (
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiPanel>
                      <EuiStat
                        // @ts-ignore
                        title={humanNumber(data?.stats?.count)}
                        description="Всего логов"
                        textAlign="right"
                        isLoading={isLoading}
                      >
                        <EuiIcon type="empty" />
                      </EuiStat>
                    </EuiPanel>
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiPanel>
                      <EuiStat
                        // @ts-ignore
                        title={humanNumber(data?.stats?.min)}
                        description="Минимальная температура"
                        textAlign="right"
                        isLoading={isLoading}
                      >
                        <EuiIcon type="empty" />
                      </EuiStat>
                    </EuiPanel>
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiPanel>
                      <EuiStat
                        // @ts-ignore
                        title={humanNumber(data?.stats?.avg)}
                        description="Средняя температура"
                        textAlign="right"
                        isLoading={isLoading}
                      >
                        <EuiIcon type="empty" />
                      </EuiStat>
                    </EuiPanel>
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiPanel>
                      <EuiStat
                        // @ts-ignore
                        title={humanNumber(data?.stats?.max)}
                        description="Максимальная температура"
                        textAlign="right"
                        isLoading={isLoading}
                      >
                        <EuiIcon type="empty" />
                      </EuiStat>
                    </EuiPanel>
                  </EuiFlexItem>
                </EuiFlexGroup>
              ) : null}
              <EuiSpacer />
              {isLoading && <Loader />}
              {data && (
                <div>
                  <Chart
                    // @ts-ignore
                    options={getOptions(data)}
                    series={getSeries(data)}
                    type="area"
                    width="1200"
                  />
                </div>
              )}
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
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: data.dates,
      labels: {
        datetimeUTC: false,
        format: data.dateFormat,
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => {
          return humanNumber(value);
        },
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        format: data.dateFormat,
      },
    },
  };
}

function getSeries(data) {
  return [
    {
      name: "temp",
      data: data.xxl1,
    },
  ];
}

export default TempMonitoringPage;
