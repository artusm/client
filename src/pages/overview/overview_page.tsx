import React, { useEffect, useState } from 'react';
import Header from '../../components/root/Header';
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
} from '@elastic/eui';
import { humanNumber } from '../../utils/human-number';
import moment from 'moment';
import {
    loadAnomalyLogsCount,
    loadErrorCount,
    loadLogTypeCounts,
} from '../../query/overview';

interface Counters {
    total: number;
    ray: number;
    access: number;
    driver: number;
    error: number;
    anomaly: number;
}

const initialCounterState: Counters = {
    total: 0,
    access: 0,
    ray: 0,
    driver: 0,
    error: 0,
    anomaly: 0,
};

const useCounterData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [counters, setCounters] = useState<Counters>(initialCounterState);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            const [data, errorCount, anomalyCount] = await Promise.all([
                loadLogTypeCounts(),
                loadErrorCount(),
                loadAnomalyLogsCount(),
            ]);

            setCounters({
                ...counters,
                ...data,
                error: errorCount,
                anomaly: anomalyCount,
            });

            setIsLoading(false);
        };

        load();
    }, []);

    return {
        counters,
        isLoading,
    };
};

const OverviewPage = () => {
    const { counters, isLoading } = useCounterData();

    return (
        <>
            <Header
                breadcrumbs={[
                    {
                        text: 'Главная',
                    },
                ]}
            />
            <EuiPage paddingSize="none">
                <EuiPageBody panelled>
                    <EuiPageHeader
                        iconType="discoverApp"
                        pageTitle="Главная"
                        description={`Сегодня ${moment().format('MM.DD.YYYY HH:mm ')}`}
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
                                            title={humanNumber(counters.total)}
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
                                            title={humanNumber(counters.total - counters.error)}
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
                                            title={humanNumber(counters.error)}
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
                                            title={humanNumber(counters.ray)}
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
                                            title={humanNumber(counters.access)}
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
                                            title={humanNumber(counters.driver)}
                                            description="Логи с типом driver"
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
                                            title={humanNumber(counters.anomaly)}
                                            description="Логи с аномалиями"
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
