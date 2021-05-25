import React  from "react";
import Header from "../../components/root/Header";
import {
    EuiPage,
    EuiPageContent,
    EuiPageContentBody,
    EuiPageHeader,
    EuiPageBody,
    EuiStat,
    EuiFlexItem,
    EuiFlexGroup,
    EuiPanel,
    EuiIcon,
} from "@elastic/eui";
import { humanNumber } from "../../utils/human-number";
import useSWR from "swr";
import moment from "moment";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const OverviewPage = () => {
    const { data } = useSWR("/api/stats", fetcher);

    const isLoading = !data;

    return (
        <>
            <Header
                breadcrumbs={[
                    {
                        text: "Главная",
                    },
                ]}
            />
            <EuiPage paddingSize="none">
                <EuiPageBody panelled>
                    <EuiPageHeader
                        iconType="dashboardApp"
                        pageTitle="Главная"
                        description={`Сегодня ${moment().format("MM.DD.YYYY HH:mm ")}`}
                    />

                    <EuiPageContent
                        hasBorder={false}
                        hasShadow={false}
                        paddingSize="none"
                        color="transparent"
                        borderRadius="none"
                    >
                        <EuiPageContentBody>
                            <EuiFlexGroup>
                                <EuiFlexItem>
                                    <EuiPanel>
                                        <EuiStat
                                            title={humanNumber(data?.totalCount)}
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
                                            title={humanNumber(data?.totalCount - data?.errorCount)}
                                            description="Логи без ошибок"
                                            titleColor="secondary"
                                            textAlign="right"
                                            isLoading={isLoading}
                                        >
                                            <EuiIcon type="check" color="secondary" />
                                        </EuiStat>
                                    </EuiPanel>
                                </EuiFlexItem>
                                <EuiFlexItem>
                                    <EuiPanel>
                                        <EuiStat
                                            title={humanNumber(data?.errorCount)}
                                            description="Логи с ошибками"
                                            titleColor="danger"
                                            textAlign="right"
                                            isLoading={isLoading}
                                        >
                                            <EuiIcon type="alert" color="danger" />
                                        </EuiStat>
                                    </EuiPanel>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                            <EuiFlexGroup>
                                <EuiFlexItem>
                                    <EuiPanel>
                                        <EuiStat
                                            title={humanNumber(data?.rayCount)}
                                            description="Логи с типом ray"
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
                                            title={humanNumber(data?.accessCount)}
                                            description="Логи с типом access"
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
                                            title={humanNumber(data?.driverCount)}
                                            description="Логи с типом driver"
                                            textAlign="right"
                                            isLoading={isLoading}
                                        >
                                            <EuiIcon type="empty" />
                                        </EuiStat>
                                    </EuiPanel>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                            <EuiFlexGroup>
                                <EuiFlexItem>
                                    <EuiPanel>
                                        <EuiStat
                                            title={humanNumber(data?.newForHour)}
                                            description="Новых логов за час"
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
                                            title={humanNumber(data?.newForDay)}
                                            description="Новых логов за день"
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
                                            title={humanNumber(data?.driverCount)}
                                            description="Логи с типом driver"
                                            textAlign="right"
                                            isLoading={isLoading}
                                        >
                                            <EuiIcon type="empty" />
                                        </EuiStat>
                                    </EuiPanel>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiPageContentBody>
                    </EuiPageContent>
                </EuiPageBody>
            </EuiPage>
        </>
    );
};

export default OverviewPage;
